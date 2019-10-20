/**
 * Post logic and functions
 * (create post and show posts to user)
 */

const mongoose = require('mongoose');
const POSTS_PER_PAGE = 3;

let moment = require('moment');

// Collections from MongoDB
let User = mongoose.model('User');
let Post = mongoose.model('Post');
let Comment = mongoose.model('Comment');

/**
 * When user creates a post with photo(s) and/or description
 * POST /upload
 */
function createPost(req, res, next) {
    // Extract details of post
    let new_post = new Post({
        _userId: req.session.user._id,
        description: req.body.description,
        occurredAt: req.body.occurredAt ? req.body.occurredAt : null
    });


    if (req.files) {
        // User uploaded photo
        new_post.pic_urls = req.files.map(e => {
            return e.secure_url
        });
        new_post.pic_ids = req.files.map(e => {
            return e.public_id
        });
    }

    // Save new post in the database
    new_post.save(function (err) {
        if (err) {
            console.error("Database save new post error: " + err);
            return next(err);
        }

        // Post successfully saved, update in User collection
        User.findOneAndUpdate(
            {_id: req.session.user._id},
            {$push: {'posts': new_post._id}},
            function (err) {
                if (err) {
                    console.error("Database update user error: " + err);
                    return next(err);
                }
            }
        );

        // Return a response
        return res.send({errMsg: ""});
    });
}


function prepareComments(user_id, comments) {
    let res = [];
    // Sort comment by time, oldest to newest
    comments.sort((a, b) => a.commentedAt > b.commentedAt);

    for (let comment of comments) {
        res.push({
            comment_pic_url: comment._userId.pic_url,
            comment_nickname: comment._userId.nickname,
            comment_description: comment.description,
            comment_timeago: moment(comment.commentedAt).format('lll'),
            comment_id: comment._userId._id.toString() === user_id ? comment._id : false
        });
    }
    return res;
}


/**
 * When user clicks on the "Like" button to like/unlike the post
 * POST /toggle-like
 */
function toggleLike(req, res, next) {
    // Add user to list of users who liked the post
    Post.findById(req.body.post_id, function (err, post) {
        if (err) {
            console.error("Database find post id error: " + err);
            return next(err);
        }

        if (!post) {
            return res.send({errMsg: "Cannot find post"});
        }

        let user_id = req.session.user._id;
        let liked = req.body.liked;

        if (liked === "false") {
            // User wants to unlike the post
            post.like = post.like.filter((e => e.toString() !== user_id));
        } else {
            // User wants to like the post
            post.like.push(user_id);
        }

        // Save updated post
        post.save(function (err) {
            if (err) {
                console.error("Database update post like error: " + err);
                return next(err);
            }
            return res.send({errMsg: ""});
        });
    });
}

/**
 * Show posts to user, used together with pagination in infinite scrolling
 * GET /more-posts/:page
 */
function fetchPosts(req, res, next) {
    let page = Math.max(0, req.params.page);
    let user_id = req.session.user._id;

    // Find user and connections
    User.findById(user_id)
        .select("posts connections")
        .populate({path: "connections", select: "posts"})
        .exec(function (err, user) {
            if (err) {
                console.error("Database find user error: " + err);
                return next(err);
            }
            // Find posts of others
            let others_posts = user.connections.reduce((acc, usr) => {
                return acc.concat(usr.posts);
            }, []);

            // Get list of all posts' ids viewable
            let all_posts = user.posts.concat(others_posts);
            all_posts = [...new Set(all_posts)];

            // Populate and find posts' content
            Post.find({_id: {$in: all_posts}})
                .sort({createdAt: 'desc'})
                .skip(POSTS_PER_PAGE * page)
                .limit(POSTS_PER_PAGE)
                .populate([
                    {
                        path: "comments", select: "_userId description commentedAt",
                        populate: {path: "_userId", select: "pic_url nickname"}
                    },
                    {path: "_userId", select: "pic_url nickname"}
                ])
                .exec(function (err, posts) {
                    if (err) {
                        console.error("Database fetch posts error: " + err);
                        return next(err);
                    }

                    if (!posts.length) {
                        // No more posts
                        return res.sendStatus(404);
                    }

                    // Prepare list of posts with their content
                    let fetched = [];
                    for (let post of posts) {
                        let post_comments = prepareComments(req.session.user._id, post.comments);
                        let post_pic_urls = post.pic_urls.map(function (pic) {
                            let single_url = {};
                            single_url["pic_url"] = pic;
                            return single_url;
                        });

                        fetched.push({
                            post_id: post._id,
                            post_description: post.description,
                            post_pic_urls: post_pic_urls,
                            post_timeago: moment(post.createdAt).fromNow(),
                            post_n_likes: post.like.length,
                            self_liked: post.like.includes(req.session.user._id),
                            post_occurredAt: post.occurredAt,
                            user_pic_url: post._userId.pic_url,
                            user_nickname: post._userId.nickname,
                            post_comments: post_comments,
                            post_n_comments: post_comments.length,
                        });
                    }

                    // Send out for display
                    return res.send(fetched);
                });
        });
}

/**
 * Store user's comment on a post
 * /POST /comment-post
 */
function commentPost(req, res, next) {
    Post.findById(req.body.post_id, function (err, post) {
        if (err) {
            console.error("Database find post id error: " + err);
            return next(err);
        }

        if (!post) {
            return res.send({errMsg: "Cannot find post"});
        }

        let new_comment = new Comment({
            _userId: req.session.user._id,
            _postId: post._id,
            description: req.body.comment
        });

        // Save user's comment
        new_comment.save(function (err) {
            if (err) {
                console.error("Database save comment error: " + err);
                return next(err);
            } else {
                // Comment successfully saved, update post

                post.comments.push(new_comment._id);

                post.save(function (err) {
                    if (err) {
                        console.error("Database update post comment error: " + err);
                        return next(err);
                    }
                    // All done, return comment id
                    return res.send({errMsg: "", comment_id: new_comment._id});
                });
            }
        });
    });
}


/**
 * Delete user's comment on a post
 * POST /delete-comment
 */
function deleteComment(req, res, next) {
    Comment.findByIdAndRemove(req.body.comment_id, function (err) {
        if (err) {
            console.error("Database find remove comment error: " + err);
            return next(err);
        }
        // Comment successfully deleted
        return res.send({errMsg: ""});
    });
}


//TODO deletePOST


//TODO fetchFamilyPosts

module.exports = {
    createPost,
    fetchPosts,
    toggleLike,
    commentPost,
    deleteComment
};