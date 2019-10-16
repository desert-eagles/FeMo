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
                _relationshipId: rel_list.map((e) => {return e._id}),
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


module.exports = {
    sendRequest
};