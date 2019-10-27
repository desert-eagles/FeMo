const replRequestTpl =
    "<span class='d-flex'>" +
    "<a class='text-primary mx-2' onclick='if (isRelationshipSelected($(this))) { $(this).closest(\"div\").html(acceptRequestTpl) }'><i class='fas fa-user-check'></i></a>" +
    "<a class='text-danger mx-2' onclick='$(this).closest(\"div\").html(declineRequestTpl)'><i class='far fa-trash-alt'></i></a>" +
    "</span>";

const acceptRequestTpl =
    "<span class='d-flex'>" +
    "<a class='text-success mx-2' onclick='acceptRequest($(this)); $(this).closest(\"div\").empty().after(acceptedTpl).closest(\".card\").find(\"[data-select-relation]\").remove()'><i class='far fa-check-circle'></i></a>" +
    "<a class='text-secondary mx-2' onclick='$(this).closest(\"div\").html(replRequestTpl)'><i class='far fa-times-circle'></i></a>" +
    "</span>";

const declineRequestTpl =
    "<span class='d-flex'>" +
    "<a class='text-danger mx-2' onclick='declineRequest($(this)); $(this).closest(\"div\").empty().after(declinedTpl).closest(\".card\").find(\"[data-select-relation]\").remove()'><i class='far fa-check-circle'></i></a>" +
    "<a class='text-secondary mx-2' onclick='$(this).closest(\"div\").html(replRequestTpl)'><i class='far fa-times-circle'></i></a>" +
    "</span>";

const acceptedTpl = "<div class='d-flex align-items-center ml-lg-auto'>Accepted</div>";

const declinedTpl = "<div class='d-flex align-items-center ml-lg-auto'>Declined</div>";

const requestTpl =
    "{{#request}}" +
    "<div class='row justify-content-center'>" +
    "<div class='col-12'>" +
    "<div class='card testimonial-card shadow-none border-success my-3 px-3'>" +
    "<div class='card-body px-0 py-3 d-flex flex-lg-row flex-column'>" +
    "<div class='d-flex flex-row'>" +
    "<div class='avatar white'>" +
    "<img src='{{sender_pic_url}}' alt='profile picture' class='rounded-circle img-responsive'>" +
    "</div>" +
    "<div class='d-flex flex-column justify-content-center ml-2 text-left col-lg-8 col-7'>" +
    "<h5 class='card-title font-weight-bold m-0 text-truncate'>{{sender_name}}</h5>" +
    "<small class='text-muted text-left text-truncate'>@{{sender_nickname}}</small>" +
    "</div>" +
    "</div>" +
    "<div class='d-flex align-items-center text-left mr-auto mt-3 mt-lg-0'>wants to add you as {{sender_relationship}}</div>" +

    "<div class='d-flex flex-row'>" +
    selectRelationTpl +
    "<div class='d-flex align-items-center' data-request-id='{{request_id}}' data-relationship-idx='{{relationship_idx}}'>" +
    replRequestTpl +
    "</div>" +
    "</div>" +

    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "{{/request}}" +
    "{{^request}}" +
    "<div class='text-center'>No requests to show</div>" +
    "{{/request}}";

function acceptRequest(o) {
    $.ajax({
        type: "Post",
        url: "accept-request/",
        data: {
            request_id: o.closest("div").attr("data-request-id"),
            relationship_idx: o.closest("div").attr("data-relationship-idx"),
            relationship: o.closest(".card").find("input").val(),
        }
    });
}

function declineRequest(o) {
    $.ajax({
        type: "Post",
        url: "decline-request/",
        data: {
            request_id: o.closest("div").attr("data-request-id"),
        }
    });
}
