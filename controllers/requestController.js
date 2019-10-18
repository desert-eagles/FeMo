/**
 * Request logic and functions
 * (send, accept and delete family member request))
 */

const mongoose = require('mongoose');

// Collection from MongoDB
let User = mongoose.model('User');
let Relationship = mongoose.model('Relationship');
let Request = mongoose.model('Request');


/**
 * Send family member request to another user
 * POST /send-request
 */
function sendRequest(req, res, next) {
    let user_id = req.session.user._id;
    let partner_id = req.body.partner_id;
    let relationship = req.body.relationship;

    // Create two-way relationship
    let from_relationship = new Relationship({
        _fromId: user_id,
        _toId: partner_id,
        relationship: relationship
    });
    let to_relationship = new Relationship({
        _fromId: partner_id,
        _toId: user_id,
        relationship: null
    });

    //TODO other already sent a request

    // Save relationship
    Relationship.insertMany([from_relationship, to_relationship],
        function (err, rel_list) {
            if (err) {
                console.error("Database save relationships error: " + err);
                return next(err);
            }
            // Relationships successfully saved
            let new_request = new Request({
                _relationshipIds: rel_list.map((e) => {
                    return e._id
                }),
                _senderId: user_id,
                _receiverId: partner_id
            });

            // Save request
            new_request.save(function (err) {
                if (err) {
                    console.error("Database save request error: " + err);
                    return next(err);
                }
                // Append request to both sender and receiver
                User.updateMany({
                    _id: {$in: [user_id, partner_id]}
                }, {
                    $push: {'requests': new_request._id}
                }, {
                    multi: true
                }, function (err, _) {
                    if (err) {
                        console.error("Database append requests error: " + err);
                        return next(err);
                    }
                    // Request successfully sent
                    return res.send({errMsg: ""});
                });
            });
        });
}

/**
 * Show user a list of requests received
 * GET /get-requests
 */
function getRequests(req, res, next) {
    let user_id = req.session.user._id;

    // Find all requests of user
    User.findById(user_id)
        .populate({
            path: "requests",
            populate: [
                {path: "_relationshipIds", select: "relationship"},
                {path: "_senderId", select: "pic_url nickname firstname lastname"}
            ]
        })
        .exec(function (err, user) {
                if (err) {
                    console.error("Database find user error: " + err);
                    return next(err);
                }

                let requests_rcvd = [];
                for (let request of user.requests) {
                    let sender = request._senderId;
                    if (sender._id.toString() === user_id.toString() ||
                        request.accepted) {
                        // Request sent by user or already accepted
                        continue;
                    }
                    let idx = request._relationshipIds
                        .map((e) => {
                            return e.relationship
                        })
                        .indexOf(null);
                    let relationship = request._relationshipIds[(idx + 1) % 2]
                        .relationship;

                    // Request received from others
                    requests_rcvd.push({
                        sender_pic_url: sender.pic_url,
                        sender_name: `${sender.firstname} ${sender.lastname}`,
                        sender_nickname: sender.nickname,
                        sender_relationship: relationship,
                        request_id: request._id,
                        relationship_idx: idx
                    });
                }
                // Return a list of requests
                return res.send(requests_rcvd);
            }
        );
}


/**
 * When user clicks on "accept" a request
 * POST /accept-request
 */
function acceptRequest(req, res, next) {
    let request_id = req.body.request_id;
    let relationship_idx = req.body.relationship_idx;
    let relationship = req.body.relationship;

    console.log(request_id);
    console.log(relationship_idx);
    console.log(relationship);

    // Search for the request
    Request.findById(request_id, function (err, request) {
        if (err) {
            console.error("Database find request error: " + err);
            next(err);
        }

        if (request.accepted) {
            // Already accepted
            return res.send({errMsg: ""});
        }
        // Update relationship entry
        Relationship.findOneAndUpdate(
            {_id: request._relationshipIds[relationship_idx]},
            {$set: {relationship: relationship}},
            function (err) {
                if (err) {
                    console.error("Database update relationship error: " + err);
                    return next(err);
                }
                // Update request
                request.accepted = true;
                request.save(function (err) {
                    if (err) {
                        console.error("Database accept request error: " + err);
                        return next(err);
                    }
                    // Update in receiver
                    User.findOneAndUpdate(
                        {_id: request._receiverId},
                        {$push: {connections: request._senderId}},
                        function (err) {
                            if (err) {
                                console.error("Database update receiver error: " + err);
                                return next(err);
                            }
                            // Update in sender
                            User.findOneAndUpdate(
                                {_id: request._senderId},
                                {$push: {connections: request._receiverId}},
                                function (err) {
                                    if (err) {
                                        console.error("Database update sender error: " + err);
                                        return next(err);
                                    }
                                    // All done
                                    return res.send({errMsg: ""});
                                }
                            );
                        }
                    );
                });
            }
        );
    });
}


/**
 * When user clicks on "decline" a request
 * POST /decline-request
 */
function declineRequest(req, res, next) {
    let request_id = req.body.request_id;

    // Search for the request
    Request.findById(request_id, function (err, request) {
        let relationship_ids = request._relationshipIds;

        // Remove all relationship entries
        Relationship.deleteMany(
            {_id: {$in: relationship_ids}},
            function (err) {
                if (err) {
                    console.error("Database delete relationships error: " + err);
                    return next(err);
                }
                // Remove the request itself
                let request_id = request._id;
                request.remove(function (err) {
                    if (err) {
                        console.error("Database delete request error: " + err);
                        return next(err);
                    }

                    // Request successfully deleted, update users' requests list
                    User.updateMany(
                        {_id: {$in: relationship_ids}},
                        {$pull: {requests: request_id}},
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
    sendRequest,
    getRequests,
    acceptRequest,
    declineRequest
};