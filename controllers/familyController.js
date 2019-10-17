/**
 * Family logic and functions
 * (create family, invite to family)
 */

const mongoose = require('mongoose');

// Collection from MongoDB
let User = mongoose.model('User');
let Family = mongoose.model('Family');


/**
 * Create a family
 * POST /create-family
 */
function createFamily(req, res, next) {
    let members = req.body.members.concat([req.session.user._id]);

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
    Family.update(
        {_id: family_id},
        {$pull: {members: remove_id}},
        function (err) {
            if (err) {
                console.error("Database remove member error: " + err);
                return next(err);
            }
            // Update user that has been removed
            User.update(
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


// DELETE FAMILY
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


module.exports = {
    createFamily,
    inviteToFamily,
    removeFromFamily,
    deleteFamily
};