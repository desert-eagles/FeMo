/**
 * Frontend functions to ask for more user details
 */


var profile_pic;

$(document).ready(() => {
    // Default profile picture
    toDataUrl($("#profile-pic-upload").attr("src"), function (base64) {
        profile_pic = $.base64ImageToBlob(base64);
    });

    // User submits form
    $("#userDetails #submit").click(() => {
        let userDetails = new FormData();
        for (let i of $("#userDetails input:not([type='file'])")) {
            if (isEmpty($(i)) || ($(i).attr("type") === "date" &&
                isInvalidDate($(i), new Date(1900, 1, 1)))) {
                return;
            }
            userDetails.append(`${$(i).attr("id")}`, $(i).val());
        }

        // Append profile picture
        userDetails.append("profile-picture", profile_pic);

        // Send POST request to backend to store details
        $.ajax({
            type: "POST",
            url: "/user-details",
            data: userDetails,
            processData: false,
            contentType: false
        }).done((res) => {
            if (!res.errMsg) {
                // Saved user details, redirect to user main page
                console.log("Saved user details");
                window.location.href = "/user";
            }
        });
    });

    $("#userDetails").show();
});

function profilePictureWidgetCallback(base64) {
    $("#profile-pic-upload").attr("src", base64);
    // Modify global variable
    profile_pic = $.base64ImageToBlob(base64);
}
