const mongoose = require('mongoose');
let Account = mongoose.model('Account');
let User = mongoose.model('User');
let Post = mongoose.model('Post');

// Middleware to check if user is logged in
function sessionChecker(req, res, next) {
    if (req.session.logged_in) {
        // User has logged in
        if (req.session.user.first_login) {
            // Redirect back to user-details
            return res.redirect('/user-details');
        } else {
            // Redirect to user main page
            return res.redirect('/user');
        }
    }

    // User has not logged in
    next();
}


// Middlewere to check if user is authenticated
function authChecker(req, res, next) {
    if (!req.session.logged_in) {
        // User has not logged in, redirect back to homepage
        return res.redirect('/');
    }

    // Continue
    next();
}

function saveNewUser(req, res, next) {
    // Extract details of new user
    let new_user = new User({
        _accountId: req.session.user._accountId,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        pic_url: req.file.url,
        pic_id: req.file.public_id,
        gender: req.body.gender,
        dob: req.body.dob,
        nickname: req.body.nickname
    });

    // Save new user entry in the database
    new_user.save(function (err) {
        if (err) {
            console.error("Database save new user error: " + err);
            return next(err);
        }

        req.session.user = new_user;
        // Redirect to user main page
        return res.send({errMsg: null});

    });
}


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

        return res.send({errMsg: ""});
    });
}


function logout(req, res, next) {
    // Log user out
    req.session.destroy(function (err) {
        if (err) {
            console.error("Cannot access session: " + err);
            return next(err);
        }

        // Successfully logout, back to homepage
        return res.redirect('/');
    });
}

module.exports = {
    sessionChecker,
    authChecker,
    saveNewUser,
    createPost,
    logout
};