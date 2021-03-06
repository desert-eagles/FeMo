/**
 * Frontend functions to create family groups
 */


var family_pic;

$(document).ready(() => {
    // Default profile picture
    toDataUrl($("#family-profile-pic").attr("src"), function (base64) {
        family_pic = $.base64ImageToBlob(base64);
    });

    // User submits form
    $("#familyDetails #submit").click(() => {
        let familyDetails = new FormData();
        for (let i of $("#name, #description")) {
            if (isEmpty($(i))) {
                return;
            }
            familyDetails.append(`${$(i).attr("id")}`, $(i).val());
        }

        // Append profile picture
        familyDetails.append("family-picture", family_pic);

        // Append family members
        let members = $("#selectMembers select").val();
        if (members.length) {
            familyDetails.append("members", JSON.stringify(members));
        } else {
            return reportError($("#selectMembers input"), "Please select family members");
        }

        // Send POST request to backend to store details
        $.ajax({
            type: "POST",
            url: "/create-family",
            data: familyDetails,
            processData: false,
            contentType: false
        }).done((res) => {
            if (!res.errMsg) {
                // Saved family details, redirect to family list page
                console.log("Saved family details");
                window.location.href = "/families";
            }
        });
    });

    // select members section
    $.ajax({
        type: "Post",
        url: "/get-connections"
    }).done(res => {
        $("#selectMembers").append(Mustache.render(selectMembersTpl, {
            connections: res
        }));
        $(".mdb-select").materialSelect();
        $("[role='status']").hide();
        $("#familyDetails").show();
    });
});

function profilePictureWidgetCallback(base64) {
    $("#family-profile-pic").attr("src", base64);
    // Modify global variable
    family_pic = $.base64ImageToBlob(base64);
}
