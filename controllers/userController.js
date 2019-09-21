/**
 * User logic and functions
 * (save user details, check authentication and logout)
 */

const mongoose = require('mongoose');

// Collection from MongoDB
let User = mongoose.model('User');


/**
 * Middleware to check if user has already logged in
 */
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


/**
 * Middleware to check if user is authenticated to access this page
 */
function authChecker(req, res, next) {
    if (!req.session.logged_in) {
        // User has not logged in, redirect back to homepage
        return res.redirect('/');
    }

    // Continue
    next();
}


/**
 * Save details entered by user logging in for the first time
 * POST /user-details
 */
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


/**
 * Log user out of session
 * GET /logout
 */
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
    logout
};