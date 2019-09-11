$(document).ready(() => {
    $("#userDetails .btn").click(() => {
        let userDetails = {};
        for (let i of $("#userDetails input")) {
            if (isEmpty($(i))) {
                return;
            }
            userDetails[`${$(i).attr("id")}`] = $(i).val();
        }

        $.ajax({
            type: "POST",
            url: "/user-details",
            data: userDetails
        }).done(() => {
        });
    });
});

function isEmpty(o) {
    if (!o.val()) {
        reportError(o, "Required field");
        return true;
    }
    return false;
}