const mongoose = require('mongoose');
let User = mongoose.model('User');
let Post = mongoose.model('Post');


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


function fetchPosts(req, res, next) {
    // TODO find all posts viewable by user


    // Now just find what the user has posted
    Post.find({_userId: req.session.user._id})
        .populate("_userId", "pic_url nickname")
        .exec(function(err, posts) {
            if (err) {
                console.error("Database fetch posts error: " + err);
                return next(err);
            }
        return res.send(posts);
    });


    // TODO populate array of post ids in user
}

module.exports = {
    createPost,
    fetchPosts
};