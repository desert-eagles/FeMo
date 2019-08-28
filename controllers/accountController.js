const mongoose = require('mongoose');
let Account = mongoose.model('Account');

let emailAvailable = function(req, res) {
    // check if email has already been taken
    Account.findOne({email: req.body.email}, function(err, acc) {
        if (err) {
            console.log("Cannot find email in database: " + err);
        } else {
            res.send(!acc);
        }
    });

};

let signupPost = function(req, res) {
    // create and save new account
    new_acc = new Account({
        email: req.body.registerEmail,
        password: req.body.registerPwd
    });

    new_acc.save(function(err) {
        if (err) {
            console.log("Cannot save new account to database: " + err);
        } else {
            console.log("Saved new account to database");
        }
    });
};

let loginPost = function(req, res) {
    // find account and verify with database
    Account.findOne({email: req.body.email}, function(err, acc) {
        if (!acc) {
            console.log("Cannot find account");
        }
        acc.comparePassword(req.body.password, function(err, isMatch) {
            if (err) {
                throw new Error(err);
            }
            if (!isMatch) {
                console.log("Invalid password");
            } else {
                console.log("User logged in");
            }
        })
    });

};

module.exports = {
    emailAvailable,
    signupPost,
    loginPost
};