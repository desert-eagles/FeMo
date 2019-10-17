/**
 * User logic and functions
 * (save user details, check authentication, search users and logout)
 */

const mongoose = require('mongoose');

// Collection from MongoDB
let User = mongoose.model('User');
let Relationship = mongoose.model('Relationship');

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


/**
 * Search for users by email or nickname
 * POST /search
 */
function searchUsers(req, res, next) {
    let query = req.body.string;
    let user_id = req.session.user._id;

    User.findById(user_id)
        .populate({path: "requests", select: "_senderId _receiverId accepted"})
        .exec(function (err, user) {
            if (err) {
                console.error("Database find user error: " + err);
                return next(err);
            }

            // List of users already sent a request to
            let sent_requests = user.requests.filter((e) => {
                return e._senderId.toString() === user_id.toString()
            });

            // Fuzzy search user for nickname
            User.fuzzySearch(query, function (err, users) {
                if (err) {
                    console.error("Database find user error: " + err);
                    return next(err);
                }
                if (users.length) {
                    // Found some potential matches
                    let queried_users = [];

                    for (let q_user of users) {
                        if (q_user._id.toString() === user_id.toString()) {
                            // Do not show user him/herself in search results
                            continue;
                        }

                        let previous = requestSent(sent_requests, q_user._id);
                        let relationship = null;
                        if (previous.request_sent) {
                            // Previously sent to user
                            if (previous.accepted) {
                                // Already connect with the queried user
                                relationship = findRelationship(user_id, q_user._id, next);
                            }
                            // Still waiting for user's confirmation
                        }

                        queried_users.push({
                            user_id: q_user._id,
                            user_pic_url: q_user.pic_url,
                            user_name: `${q_user.firstname} ${q_user.lastname}`,
                            user_nickname: q_user.nickname,
                            request_sent: previous.request_sent,
                            relationship: relationship
                        });
                    }
                    return res.send(queried_users);
                }
                // User not found
                return res.send([]);
            });

        });


}

function requestSent(requests, target_id) {
    for (let req of requests) {
        if (req._receiverId.toString() === target_id.toString()) {
            return {request_sent: true, accepted: req.accepted}
        }
    }
    return {request_sent: false};
}


function findRelationship(from_user, to_user, next) {
    // Only when the request has been accepted
    Relationship.findOne({
        _fromId: from_user.toString(),
        _toId: to_user.toString()
    }, function (err, rel) {
        if (err) {
            console.error("Database find relationship error: " + err);
            return next(err);
        }
        return rel.relationship;
    });
}

module.exports = {
    sessionChecker,
    authChecker,
    saveNewUser,
    logout,
    searchUsers
};