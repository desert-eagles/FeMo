/**
 * Family logic and functions
 * (create family, invite to family)
 */

const mongoose = require('mongoose');
let moment = require('moment');

// Collection from MongoDB
let User = mongoose.model('User');
let Family = mongoose.model('Family');
let Relationship = mongoose.model('Relationship');

/**
 * Create a family
 * POST /create-family
 */
function createFamily(req, res, next) {
    let members = JSON.parse(req.body.members);
    members = members.concat([req.session.user._id]);

    // Extract details of new family
    let new_family = new Family({
        name: req.body.name,
        description: req.body.description,
        creator: req.session.user._id,
        pic_url: req.file.url,
        pic_id: req.file.public_id,
        members: members
    });

    // Save new family in the database
    new_family.save(function (err) {
        if (err) {
            console.error("Database save new family error: " + err);
            return next(err);
        }

        // Update all members'
        User.updateMany({
            _id: {$in: members}
        }, {
            $push: {'families': new_family._id}
        }, {
            multi: true
        }, function (err, _) {
            if (err) {
                console.error("Database save family error: " + err);
                return next(err);
            }
            // Members all update
            return res.send({errMsg: ""});
        });
    });
}

/**
 * Invite another (connected) user to the family
 * POST /invite-to-family
 */
function inviteToFamily(req, res, next) {
    let family_id = req.body.family_id;
    let invited_id = req.body.invited_id;

    // Add into family members list
    Family.findOneAndUpdate(
        {_id: family_id},
        {$push: {members: invited_id}},
        function (err) {
            if (err) {
                console.error("Database add member error: " + err);
                return next(err);
            }

            // Update person invited
            User.findOneAndUpdate(
                {_id: invited_id},
                {$push: {families: family_id}},
                function (err) {
                    if (err) {
                        console.error("Database update member error: " + err);
                        return next(err)
                    }

                    // Successfully add the user into the family
                    return res.send({errMsg: ""});
                }
            )
        }
    )
}

/**
 * Remove a user from the family
 * POST /remove-from-family
 */
function removeFromFamily(req, res, next) {
    let family_id = req.body.family_id;
    let remove_id = req.body.remove_id;

    // Remove user from the family members list
    Family.updateOne(
        {_id: family_id},
        {$pull: {members: remove_id}},
        function (err) {
            if (err) {
                console.error("Database remove member error: " + err);
                return next(err);
            }
            // Update user that has been removed
            User.updateOne(
                {_id: remove_id},
                {$pull: {families: family_id}},
                function (err) {
                    if (err) {
                        console.error("Database remove family error: " + err);
                        return next(err);
                    }

                    // Successfully removed
                    return res.send({errMsg: ""});
                }
            );
        }
    );
}


/**
 * Delete the family
 * POST /delete-family
 */
function deleteFamily(req, res, next) {
    let family_id = req.body.family_id;

    // Find all members of the family
    Family.findById(family_id, function (err, family) {
        let members = family.members;

        // Update all members' families list
        User.updateMany(
            {_id: {$in: members}},
            {$pull: {families: family_id}},
            {multi: true},
            function (err, _) {
                if (err) {
                    console.error("Database remove members' families error: " + err);
                    return next(err);
                }
                // Remove the family
                family.remove(function (err) {
                    if (err) {
                        console.error("Database delete family error: " + err);
                        return next(err);
                    }
                    // Family removed
                    return res.send({errMsg: ""});
                });
            });
    });
}


/**
 * Get details and members (connected or not connected) of family
 * POST /get-family
 */
function getFamily(req, res, next) {
    let family_id = req.body.family_id;
    let self = req.session.user;

    User.findById(self._id)
        .populate([
            {path: "connections", select: "pic_url firstname lastname nickname"},
            {path: "requests", select: "_senderId _receiverId accepted"}
        ])
        .exec(function (err, user) {
            if (err) {
                console.error("Database find user error: " + err);
                return next(err);
            }
            if (!user.families.includes(family_id)) {
                // User did not join the family
                return res.send({errMsg: "Family not found"});
            }

            // Find all the members in the family
            Family.findById(family_id)
                .populate([
                    {path: "members", select: "pic_url firstname lastname nickname"},
                    {path: "creator", select: "firstname lastname"}
                ])
                .exec(function (err, family) {
                    if (err) {
                        console.error("Database find family error: " + err);
                        return next(err);
                    }
                    let members = family.members;
                    let members_ids = members.map((usr) => {
                        return usr._id;
                    });

                    // Find members that user already connected with
                    let connected_members = user.connections
                        .filter((usr) => {
                            return members_ids.includes(usr._id)
                        });
                    let connected_ids = connected_members.map((usr) => {
                        return usr._id;
                    });

                    // Find relationships of those connections

                    Relationship.find(
                        {
                            $and: [
                                {_fromId: self._id},
                                {_toId: {$in: connected_ids}}
                            ]
                        },
                        function (err, rels) {
                            if (err) {
                                console.error("Database find relationships error: " + err);
                                return next(err);
                            }

                            rels = rels.reduce((acc, rel) => {
                                acc[rel._toId] = rel.relationship;
                                return acc;
                            }, {});

                            // Details of the family
                            let creator = family.creator;

                            let details = {
                                family_id: family._id,
                                family_name: family.name,
                                family_description: family.description,
                                family_pic_url: family.pic_url,
                                family_creator: `${creator.firstname} ${creator.lastname}`,
                                family_createdOn: moment(family.createdAt).format('ll')
                            };

                            // List of users already connected
                            let connections = [];

                            // Add user him/herself
                            connections.push({
                                user_id: self._id,
                                user_pic_url: self.pic_url,
                                user_name: `${self.firstname} ${self.lastname}`,
                                user_nickname: self.nickname,
                                user_relationship: false
                            });

                            // Append connected members
                            for (let usr of connected_members) {
                                if (!usr._id.toString() in rels) {
                                    continue
                                }
                                connections.push({
                                    family_id: family._id,
                                    user_id: usr._id,
                                    user_pic_url: usr.pic_url,
                                    user_name: `${usr.firstname} ${usr.lastname}`,
                                    user_nickname: usr.nickname,
                                    user_relationship: rels[usr._id.toString()]
                                });
                            }

                            // List of non-connected users
                            let users = [];

                            // List of users already sent a request to
                            let sent_to = user.requests.map((e) => {
                                return e._receiverId
                            });
                            // List of users already received a request from
                            let received_from = user.requests.map((e) => {
                                return e._senderId
                            });

                            // Append non-connected members
                            for (let usr of members) {
                                if (usr._id.toString() in rels) {
                                    // Already appended
                                    continue;
                                } else if (usr._id.toString() === self._id.toString()) {
                                    // User him/herself
                                    continue;
                                }
                                let nc_user = {
                                    family_id: family._id,
                                    user_id: usr._id,
                                    user_pic_url: usr.pic_url,
                                    user_name: `${usr.firstname} ${usr.lastname}`,
                                    user_nickname: usr.nickname
                                };
                                if (sent_to.includes(usr._id)) {
                                    nc_user["errMsg"] = "Already sent a request";
                                } else if (received_from.includes(usr._id)) {
                                    nc_user["errMsg"] = "Already received a request";
                                }
                                users.push(nc_user);
                            }

                            // All done, send to frontend for displaying
                            return res.send({
                                details: details,
                                connections: connections,
                                users: users
                            });
                        });
                });
        });
}


/**
 * Show families joined by the user
 * POST /get-families
 */
function getFamilies(req, res, next) {
    let user_id = req.session.user._id;

    // Find families joined by the user
    User.findById(user_id)
        .populate({path: "families", select: "name pic_url description"})
        .exec(function (err, user) {
            if (err) {
                console.error("Database find user error: " + err);
                return next(err);
            }
            let families = [];
            for (let fam of user.families) {
                families.push({
                    family_id: fam._id,
                    family_name: fam.name,
                    family_pic_url: fam.pic_url,
                    family_description: fam.description
                });
            }
            res.send(families);
        });
}


module.exports = {
    createFamily,
    inviteToFamily,
    removeFromFamily,
    deleteFamily,
    getFamily,
    getFamilies
};