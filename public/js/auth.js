$(document).ready(() => {
    $("#signup input").keyup((e) => {
        var inputted = e.target.value;
        if (inputted === "") {
            return;
        }
        if (e.target.id === "registerEmail") {
            validateEmail(inputted);
        } else if (e.target.id === "registerPwd") {
            validatePassword(inputted);
        } else if (e.target.id === "registerReptPwd") {
            checkPasswordsMatch(inputted);
        }
    });

    $("#signup button").click(() => {
        let email = $("#registerEmail").val();
        let pwd = $("#registerPwd").val();


        $.ajax({
            type: "POST",
            url: "/signup",
            data: {
                registerEmail: email,
                registerPwd: pwd
            }
        })
    })

});


function validateEmail(email) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat)) {
        console.log("Invalid email");
    } else {
        // check if email is registered
        $.ajax({
            type: "POST",
            url: "/check-email-availability",
            data: { email: email },
            success: function(available) {
                if (available) {
                    console.log("Email available");
                } else {
                    console.log("Email taken");
                }
            }
        });
    }
}

function validatePassword(pwd) {
    console.log(pwd.length >= 8
                ? "Valid password"
                : "Password must be at least 8 characters");
}

function checkPasswordsMatch(confirmPwd) {
    console.log(confirmPwd == $("#registerPwd").val()
                ? "Passwords match"
                : "Passwords do not match"
    );
}