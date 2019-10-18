/**
 * User logic and functions
 * (save user details, check authentication, search users and logout)
 */

const mongoose = require('mongoose');

// Collection from MongoDB
let User = mongoose.model('User');
let Relationship = mongoose.model('Relationship');
let Request = mongoose.model('Request');


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
            let sent_to = user.requests.map((e) => {
                return e._receiverId
            });
            // List of users already received a request from
            let received_from = user.requests.map((e) => {
                return e._senderId
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

                        let queried = {
                            user_id: q_user._id,
                            user_pic_url: q_user.pic_url,
                            user_name: `${q_user.firstname} ${q_user.lastname}`,
                            user_nickname: q_user.nickname
                        };

                        if (user.connections.includes(q_user._id)) {
                            queried["errMsg"] = "Already connected";
                        } else if (sent_to.includes(q_user._id)) {
                            queried["errMsg"] = "Already sent a request";
                        } else if (received_from.includes(q_user._id)) {
                            queried["errMsg"] = "Already received a request";
                        }

                        queried_users.push(queried);
                    }
                    return res.send(queried_users);
                }
                // User not found
                return res.send([]);
            });

        });


}


/**
 * Find all connections of user
 * POST /get-connections
 */
function getConnections(req, res, next) {
    let user_id = req.session.user._id;

    // Find user by ID
    User.findById(user_id, "connections")
        .populate({path: "connections", select: "pic_url firstname lastname nickname"})
        .exec(function (err, user) {
            if (err) {
                console.error("Database find user error: " + err);
                return next(err);
            }
            let connected_ids = user.connections.map((e) => {
                return e._id
            });
            // Find relationships with the users connected
            Relationship.find(
                {
                    $and: [
                        {_fromId: user_id},
                        {_toId: {$in: connected_ids}}
                    ]
                },
                function (err, rels) {
                    rels = rels.reduce((acc, rel) => {
                        acc[rel._toId] = rel.relationship;
                        return acc;
                    }, {});

                    let connections = [];

                    // Append relationship to connections
                    for (let usr of user.connections) {
                        if (!usr._id.toString() in rels) {
                            continue
                        }
                        connections.push({
                            user_id: usr._id,
                            user_pic_url: usr.pic_url,
                            user_name: `${usr.firstname} ${usr.lastname}`,
                            user_nickname: usr.nickname,
                            user_relationship: rels[usr._id.toString()]
                        });
                    }
                    return res.send(connections);
                }
            );
        });
}

/**
 * Delete relationship with other user
 * POST /delete-relationship
 */
function deleteRelationship(req, res, next) {
    let delete_id = req.body.partner_id;
    let user_id = req.session.user._id;

    // Search for the request
    Request.findOne(
        {
            $and: [
                {_senderId: {$in: [user_id, delete_id]}},
                {_receiverId: {$in: [user_id, delete_id]}}
            ]
        },
        function (err, request) {

            // Remove relationship entries
            Relationship.deleteMany(
                {_id: {$in: request._relationshipIds}},
                function (err) {
                    if (err) {
                        console.error("Database delete relationships error: " + err);
                        return next(err);
                    }
                    // Remove the request itself
                    let request_id = request._id;
                    let users_id = [request._senderId, request._receiverId];

                    request.remove(function (err) {
                        if (err) {
                            console.error("Database delete request error: " + err);
                            return next(err);
                        }

                        // Request successfully deleted, update users' requests list
                        User.updateMany(
                            {_id: {$in: users_id}},
                            {
                                $pull: {
                                    requests: request_id,
                                    connections: {$in: users_id}
                                }
                            },
                            {multi: true},
                            function (err, _) {
                                if (err) {
                                    console.error("Database remove users' requests error: " + err);
                                    return next(err);
                                }
                                // Users updated
                                return res.send({errMsg: ""});
                            });
                    });
                });
        });
}


module.exports = {
    sessionChecker,
    authChecker,
    saveNewUser,
    logout,
    searchUsers,
    getConnections,
    deleteRelationship
};