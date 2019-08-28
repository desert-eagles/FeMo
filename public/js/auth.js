$(document).ready(() => {
    $("#signin button").click(() => {
        // TODO login backend
    });


    $("#signup button").click(() => {
        let emailObj = $("#registerEmail");
        let pwdObj = $("#registerPwd");
        let rptPwdObj = $("#registerReptPwd");
        let email = emailObj.val();
        let pwd = pwdObj.val();

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
                                }
                            }).done((err) => {
                                if (!err) {
                                    $("<p class='note note-success'><strong>Register Success!</strong> " +
                                        "A confirmation email has been sent to your email, click here " +
                                        "to resend again.</p>").insertBefore("form#signup").hide().fadeIn()
                                }
                            });
                        } else {
                            return reportError(rptPwdObj, "Passwords do not match");
                        }
                    }
                });
            }
        });
    })
});

function reportError(o, err) {
    o.addClass("invalid")
        .parent(".md-form").prevAll(".md-form").find("input")
        .removeClass("invalid").addClass("valid");

    let e = o[0];
    e.setCustomValidity(err);
    e.reportValidity();
}

function validateEmail(email, cb) {
    let err, mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !email.match(mailformat)) {
        cb("Please enter a valid email");
    } else {
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
    }
}

function validatePassword(pwd, cb) {
    let err = "";
    if (pwd.length < 8) {
        err = "Password must be at least 8 characters";
    }
    return cb(err);
}