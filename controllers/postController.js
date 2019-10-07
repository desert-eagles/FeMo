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
 * When user create a post with photo(s) and/or description
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
            self_commented: comment._userId === user_id
        });
    }
    return res;
}


/**
 * Show posts to user, used together with pagination in infinite scrolling
 * GET /more-posts/:page
 */
function fetchPosts(req, res, next) {
    // TODO find all posts viewable by use

    let page = Math.max(0, req.params.page);

    // Now just find what the user has posted
    Post.find({_userId: req.session.user._id})
        .sort({createdAt: 'desc'})
        .skip(POSTS_PER_PAGE * page)
        .limit(POSTS_PER_PAGE)
        .populate("comments", "_userId description commentedAt")
        .populate("_userId", "pic_url nickname")
        .exec(function (err, posts) {
            if (err) {
                console.error("Database fetch posts error: " + err);
                return next(err);
            }

            if (!posts.length) {
                // Not more posts
                return res.sendStatus(404);
            }

            let fetched = [];
            // TODO remove pic_urls[0] once added photo college
            for (let post of posts) {
                let post_comments = prepareComments(post.comments);

                fetched.push({
                    post_description: post.description,
                    post_pic_urls: post.pic_urls[0],
                    post_like: post.like.length,
                    post_timeago: moment(post.createdAt).fromNow(),
                    post_occurredAt: post.occurredAt,
                    user_pic_url: post._userId.pic_url,
                    user_nickname: post._userId.nickname,
                    post_comments: post_comments
                });
            }
            
            return res.send(fetched);
        });


    // TODO populate array of post ids in user
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

        let new_comment = new Comment({
            user_id: req.sessions.user._id,
            post_id: post._id,
            comment: req.body.comment
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

                    // All done
                    return res.send({errMsg: ""});
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

module.exports = {
    createPost,
    fetchPosts,
    commentPost,
    deleteComment
};