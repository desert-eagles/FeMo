const mongoose = require('mongoose');
let Account = mongoose.model('Account');
let Token = mongoose.model('Token');

function emailAvailable(req, res, next) {
    // check if email has already been taken
    Account.findOne({email: req.body.email}, function (err, acc) {
        if (!err) {
            res.send(!acc);
        } else {
            next(err);
        }
    });
};


// function resendPost

/**
 * When the user clicks the link in the confirmation email.
 * GET /confirm-email
 */
function confirmEmail(req, res) {

    // Find a matching token
    Token.findOne({token: req.params.token}, function (err, token) {
        if (!token) {
            console.log("unable to find valid token");
            // req.session.errors = [{msg: 'We were unable to find a valid token. Your token may have expired.'}];
            // req.session.save();
            return res.send("unable to find valid token");
        }

        // If we found a token, find a matching user
        Account.findOne({_id: token._accountId}, function (err, acc) {
            if (!acc) {
                console.log("unable to find a user for this token, account deleted");
                // req.session.errors = [{msg: 'We were unable to find a user for this token. The account may be deleted'}];
                // req.session.save();
                return res.send("unable to find a user for this token, account deleted");
            }
            if (acc.isVerified) {
                console.log("this email has already been verified");
                // req.session.errors = [{msg: 'This email has already been verified.'}];
                // req.session.save();
                return res.send("this email has already been verified");
            }

            // Verify the account
            acc.isVerified = true;
            acc.save(function (err) {
                if (err) {
                    return next(err);
                }
                console.log("Account verified, please log in ");
                // req.session.msg = "The account has been verified. Please log in.";
                // req.session.save();
                return res.send("Account verified, please log in");
            });
        });
    });
}

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

function signupPost(req, res) {
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
        token.save(function (err) {
            if (err) {
                console.log("Cannot save token");
                next(err);
            }
            console.log("Token saved");

            mailOptions.to = new_acc.email;
            mailOptions.text = `Hello, ${new_acc.email}\n\nPlease verify your account by visiting the link: \n
                    http://${req.headers.host}/confirm-email/${token.token}\n
                    Note: Be sure to check your spam folder as well!`;

            // send confirmation email
            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    return next(err);
                }
                console.log(`Verification email sent to ${new_acc.email}`);
                return res.send(err);
            });
        });
    });
}

function loginPost(req, res) {
    // find email and verify password with database
    Account.findOne({email: req.body.loginEmail}, function (err, acc) {
        if (!acc) {
            console.log("Cannot find account");
            return res.send("Email not registered");
        }
        acc.comparePassword(req.body.loginPwd, function (err, isMatch) {
            if (err) {
                return next(err);
            }
            // check if passwords match
            if (!isMatch) {
                console.log("Invalid password");
                return res.send("Incorrect password");
            } else {
                // check if user has verified email
                console.log("Check if user verified email");

                if (acc.isVerified) {
                    console.log("You are logged in!");
                    return res.send("You are logged in!");
                } else {
                    console.log("Please verify your email first");
                    return res.send("Please verify your email first");
                }
            }
        })
    });
}

module.exports = {
    emailAvailable,
    confirmEmail,
    signupPost,
    loginPost
};