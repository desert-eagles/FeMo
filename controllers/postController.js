/**
 * Post logic and functions
 * (create post and show posts to user)
 */

const mongoose = require('mongoose');
const POSTS_PER_PAGE = 3;

// Collections from MongoDB
let User = mongoose.model('User');
let Post = mongoose.model('Post');


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
    // TODO find all posts viewable by use

    let page = Math.max(0, req.params.page);

    // Now just find what the user has posted
    Post.find({_userId: req.session.user._id})
        .sort({createdAt: 'desc'})
        .skip(POSTS_PER_PAGE * page)
        .limit(POSTS_PER_PAGE)
        .populate("_userId", "pic_url nickname")
        .exec(function (err, posts) {
            if (err) {
                console.error("Database fetch posts error: " + err);
                return next(err);
            }

            if (!posts.length) {
                // No more posts
                return res.sendStatus(404);
            }

            let fetched = [];
            // TODO remove pic_urls[0] once added photo college
            for (let post of posts) {
                fetched.push({
                    post_id: post._id,
                    post_description: post.description,
                    post_pic_urls: post.pic_urls[0],
                    post_n_likes: post.like.length,
                    self_liked: post.like.includes(req.session.user._id),
                    post_createdAt: post.createdAt,
                    post_occurredAt: post.occurredAt,
                    user_pic_url: post._userId.pic_url,
                    user_nickname: post._userId.nickname
                });
            }
            return res.send(fetched);
        });


    // TODO populate array of post ids in user
}


module.exports = {
    createPost,
    fetchPosts,
    toggleLike
};