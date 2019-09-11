$(document).ready(() => {

    $("#signin button").click(() => {
        let emailObj = $("#loginEmail");
        let pwdObj = $("#loginPwd");
        let email = emailObj.val();
        let pwd = pwdObj.val();

        removeNote("login-note");

        validateEmail(email, (err) => {
            if (err) {
                // Email is invalid
                return reportError(emailObj, err);
            } else {
                validatePassword(pwd, (err) => {
                    if (err) {
                        // Password is invalid
                        return reportError(pwdObj, err);
                    } else {
                        $.ajax({
                            type: "POST",
                            url: "/signin",
                            data: {
                                loginEmail: email,
                                loginPwd: pwd
                            },
                            beforeSend: (() => {
                                $('#signin').find('.spinner-border').show();
                            }),
                            complete: (() => {
                                $('#signin').find('.spinner-border').hide();
                            })
                        }).done((login) => {
                            if (login.errMsg) {
                                // Login failed
                                $("<p id='login-note' class='note note-danger'><strong>" + login.errMsg + "</strong></p>")
                                    .insertBefore("form#signin").hide().fadeIn();
                            } else {
                                // Login success
                                window.location.href = "/user";
                            }
                        });
                    }
                });
            }
        }, mode = "signin");
    });


    $("#signup button").click(() => {
        let emailObj = $("#registerEmail");
        let pwdObj = $("#registerPwd");
        let rptPwdObj = $("#registerReptPwd");
        let email = emailObj.val();
        let pwd = pwdObj.val();

        removeNote("signup-note");
        removeNote("resend-note");

        validateEmail(email, (err) => {
            if (err) {
                return reportError(emailObj, err);
            } else {
                validatePassword(pwd, (err) => {
                    if (err) {
                        return reportError(pwdObj, err);
                    } else {
                        if (pwd === rptPwdObj.val()) {
                            $.ajax({
                                type: "POST",
                                url: "/signup",
                                data: {
                                    registerEmail: email,
                                    registerPwd: pwd
                                },
                                beforeSend: (() => {
                                    $('#signup').find('.spinner-border').show();
                                }),
                                complete: (() => {
                                    $('#signup').find('.spinner-border').hide();
                                })
                            }).done((signup) => {
                                if (signup.success) {
                                    $("<p id='signup-note' class='note note-success'><strong>Register Success!</strong> " +
                                        "A confirmation email has been sent to your email, click " +
                                        "<a id='resend'> here</a> to resend again.</p>")
                                        .insertBefore("form#signup").hide().fadeIn()
                                        .find("#resend").click(resend(email));
                                }
                            });
                        } else {
                            return reportError(rptPwdObj, "Passwords do not match");
                        }
                    }
                });
            }
        });
    });
});

function validateEmail(email, cb, mode = "signup") {
    let err, mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !email.match(mailformat)) {
        cb("Please enter a valid email");
    } else if (mode === "signup") {
        // check if email is registered
        $.ajax({
            type: "POST",
            url: "/check-email-availability",
            data: {email: email},
            success: (available) => {
                let err = "";
                if (!available) {
                    err = "Email has already been taken";
                }
                return cb(err);
            }
        });
    } else {
        return cb("");
    }
}

function validatePassword(pwd, cb) {
    let err = "";
    if (pwd.length < 8) {
        err = "Password must be at least 8 characters";
    }
    return cb(err);
}

function removeNote(id) {
    $("#" + id).remove();
}

function resend(email) {
    removeNote("resend-note");
    $.ajax({
        type: "POST",
        url: "/resend-confirmation",
        data: {
            resendEmail: email
        },
        beforeSend: (() => {
            $('#signup').find('.spinner-border').show();
        }),
        complete: (() => {
            $('#signup').find('.spinner-border').hide();
        })
    }).done((resend) => {
        if (resend.success) {
            console.log("resend success");
            $("<p id='resend-note' class='note note-success'>" +
                "A new confirmation email has been sent to " +
                email +
                " . Please check your spam folder as well.</p>")
                .insertBefore("form#signup").hide().fadeIn();
        }
    })
}