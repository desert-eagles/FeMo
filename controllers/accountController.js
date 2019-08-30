const mongoose = require('mongoose');
let Account = mongoose.model('Account');
let Token = mongoose.model('Token');

function emailAvailable(req, res, next) {
    // check if email has already been taken
    Account.findOne({email: req.body.email}, function (err, acc) {
        if (!err) {
            res.send(!acc);
        } else {
            console.error("Database find email error: " + err);
            return next(err);
        }
    });
}


// function resendPost

/**
 * When the user clicks the link in the confirmation email.
 * GET /confirm-email
 */
function confirmEmail(req, res) {

    // Find a matching token
    Token.findOne({token: req.params.token}, function (err, token) {
        if (!token) {
            // Unable to find a valid token, may have expired
            // TODO may need to redirect to login page with resend button
            // req.session.errors = [{msg: 'We were unable to find a valid token. Your token may have expired.'}];
            // req.session.save();
            return res.send("We were unable to find a valid token, your token may have expired.");
        }

        // If we found a token, find a matching user
        Account.findOne({_id: token._accountId}, function (err, acc) {
            if (!acc) {
                // TODO redirect to signup
                // req.session.errors = [{msg: 'We were unable to find a user for this token. The account may be deleted'}];
                // req.session.save();
                return res.send("We were unable to find an account for this token, the account may be deleted.");
            }
            if (acc.isVerified) {
                // TODO redirect to signup
                // req.session.errors = [{msg: 'This email has already been verified.'}];
                // req.session.save();
                return res.send("This email has already been verified. Please log in.");
            }

            // Verify the account
            acc.isVerified = true;
            acc.save(function (err) {
                if (err) {
                    console.error("Database verify email error: " + err);
                    return next(err);
                }
                // req.session.msg = "The account has been verified. Please log in.";
                // req.session.save();
                return res.send("The account has been verified. Please log in.");
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
    // Create and save new account
    new_acc = new Account({
        email: req.body.registerEmail,
        password: req.body.registerPwd
    });

    new_acc.save(function (err) {
        // Create a new token for this account
        let token = new Token({
            _accountId: new_acc._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        // Save verification token
        token.save(function (err) {
            if (err) {
                console.error("Database save token error: " + err);
                return next(err);
            }

            mailOptions.to = new_acc.email;
            mailOptions.text = `Hello, ${new_acc.email}\n\nPlease verify your account by visiting the link: \n
                    http://${req.headers.host}/confirm-email/${token.token}\n
                    Note: Be sure to check your spam folder as well!`;

            // send confirmation email
            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    console.error("Transporter send mail error: " + err);
                    return next(err);
                }
                console.log("Verification email sent to " + new_acc.email);
                return res.send({success: true});
            });
        });
    });
}

function loginPost(req, res) {
    // Find email and verify password with database
    Account.findOne({email: req.body.loginEmail}, function (err, acc) {
        if (err) {
            console.error("Database find email error: " + err);
            return next(err);
        }
        if (!acc) {
            // Cannot find email in database
            return res.send({errMsg: "Email not registered"});
        }
        acc.comparePassword(req.body.loginPwd, function (err, isMatch) {
            if (err) {
                console.error("Database compare password error: " + err);
                return next(err);
            }
            if (!isMatch) {
                // Password is incorrect
                return res.send({errMsg: "Incorrect password"});
            } else {
                if (!acc.isVerified) {
                    // Email has not been verified
                    return res.send({errMsg: "Please verify your email first"});
                } else {
                    // Log in success
                    return res.send({errMsg: null});
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