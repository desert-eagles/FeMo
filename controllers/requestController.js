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
                _senderId: user_id
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


module.exports = {
    sendRequest,
    getRequests
};