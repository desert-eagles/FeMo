const mongoose = require('mongoose');
let Account = mongoose.model('Account');
let Token = mongoose.model('Token');

let emailAvailable = function (req, res) {
    // check if email has already been taken
    Account.findOne({email: req.body.email}, function (err, acc) {
        if (!err) {
            res.send(!acc);
        }
    });
};


/* Signup */
const nodemailer = require('nodemailer');
require('dotenv').config();
let transporter = nodemailer.createTransport({
    service: "Sendgrid",
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS
    }
});
let mailOptions = {
    from: "no-reply@femo.io",
    subject: "Account Verification Token"
};
let crypto = require('crypto');

let signupPost = function (req, res) {
    // create and save new account
    new_acc = new Account({
        email: req.body.registerEmail,
        password: req.body.registerPwd
    });

    new_acc.save(function (err) {
        // create a new token for this account
        let token = new Token({
            _accountId: new_acc._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        // save verification token
        token.save(function(err) {
            if (err) {
                console.log("Cannot save token");
                return res.status(500).send({msg: err.message});
            }
            console.log("Token saved");

            mailOptions.to = new_acc.email;
            mailOptions.text = `Hello, ${new_acc.email}\n\nPlease verify your account by visiting the link: \n
                    http://${req.headers.host}/confirm-email/${token.token}\n
                    Note: Be sure to check your spam folder as well!`;

            // send confirmation email
            transporter.sendMail(mailOptions, function(err) {
                console.log(`Verification email sent to ${new_acc.email}`);
                return res.send(err);
            });
        });
    });
};

let loginPost = function (req, res) {
    // find account and verify with database
    Account.findOne({email: req.body.email}, function (err, acc) {
        if (!acc) {
            console.log("Cannot find account");
        }
        acc.comparePassword(req.body.password, function (err, isMatch) {
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