const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
let Account = mongoose.model('Account');
let Token = mongoose.model('Token');

require('dotenv').config();

/**
 * Helper function to send email.
 */
function sendMail(to, subject, text, cb) {
    // Create transporter with SendGrid API
    let transporter = nodemailer.createTransport({
        service: "Sendgrid",
        auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASS
        }
    });

    // Mail content
    let mailOptions = {
        from: "no-reply@femo.io",
        to: to,
        subject: subject,
        text: text
    };

    // Send the email out
    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            return cb(err);
        }
        // Email sent
        return cb(null);
    });
}


/**
 * Handle ajax POST request to check if email has already been
 * used to sign up for an account.
 */
function emailAvailable(req, res, next) {
    // Check if email has already been taken
    Account.findOne({email: req.body.email}, function (err, acc) {
        if (err) {
            console.error("Database find email error: " + err);
            return next(err);
        }
        return res.send(!acc);
    });
}

/**
 * When user clicks to resend the confirmation email again
 * in the login page.
 */
function resendConfirmation(req, res, next) {

    Account.findOne({email: req.body.resendEmail}, function (err, acc) {
        if (err) {
            console.error("Database find email error: " + err);
            return next(err);
        }

        // Regenerate a new token and send to user's email
        let token = new Token({
            _accountId: acc._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        // Save new verification token
        token.save(function (err) {
            if (err) {
                console.error("Database save token error: " + err);
                return next(err);
            }

            // Send new confirmation email
            let subject = "FeMo - Please Verify Your Email";
            let content = `Hello, ${acc.email}\n\nWe have generated a new confirmation link.\n
                    Please verify your account by visiting the link: \n
                    http://${req.headers.host}/confirm-email/${token.token}\n
                    Note: Be sure to check your spam folder as well!`;

            sendMail(acc.email, subject, content, (err) => {
                if (err) {
                    console.error("Transporter send mail error: " + err);
                    return next(err);
                }

                // Email sent
                return res.send({success: true});
            });
        });
    });
}

/**
 * When the user clicks the link in the confirmation email.
 * GET /confirm-email
 */
function confirmEmail(req, res, next) {

    // Find a matching token
    Token.findOne({token: req.params.token}, function (err, token) {
        if (err) {
            console.error("Database find token error: " + err);
            return next(err);
        }

        if (!token) {
            // Unable to find a valid token, may have expired
            // TODO may need to redirect to login page with resend button
            // req.session.errors = [{msg: 'We were unable to find a valid token. Your token may have expired.'}];
            // req.session.save();
            return res.send("We were unable to find a valid token, your token may have expired." +
                "Please contact us to get a new token.");
        }

        // If we found a token, find a matching user
        Account.findOne({_id: token._accountId}, function (err, acc) {
            if (err) {
                console.error("Database find account error: " + err);
                return next(err);
            }

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


function signupPost(req, res, next) {
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

            // Send confirmation email
            let subject = "FeMo - Please Verify Your Email";
            let content = `Hello, ${new_acc.email}\n\nPlease verify your account by visiting the link: \n
                    http://${req.headers.host}/confirm-email/${token.token}\n
                    Note: Be sure to check your spam folder as well!`;

            sendMail(new_acc.email, subject, content, (err) => {
                if (err) {
                    console.error("Transporter send mail error: " + err);
                    return next(err);
                }

                // Email sent
                return res.send({success: true});
            });
        });
    });
}

function loginPost(req, res, next) {
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
                    return res.send({resend: "Please verify your email first"});
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
    resendConfirmation,
    signupPost,
    loginPost
};