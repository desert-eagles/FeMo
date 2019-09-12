const mongoose = require('mongoose');
let Account = mongoose.model('Account');
let User = mongoose.model('User');

function saveDetails(req, res, next) {
    console.log("In save details");
    console.log(req.body);
    let new_user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        dob: req.body.dob,
        nickname: req.body.nickname
    });

    console.log("Saving");
    new_user.save(function (err) {
        if (err) {
            console.error("Database save new user error: " + err);
            return next(err);
        }

        // Redirect to user main page
        console.log("Saved");
        return res.send({errMsg: null});

    })
}

module.exports = {
    saveDetails
};