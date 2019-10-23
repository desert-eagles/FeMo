/**********************************************************************************************************************/
// user template

const sendRequestTpl =
    "<a class='text-primary mx-2' onclick='if (isRelationshipSelected($(this))) { $(this).parent().html(cfmRequestTpl) }'><i class='far fa-paper-plane'></i></a>";

const cfmRequestTpl =
    "<span class='d-flex'>" +
    "<a class='text-success mx-2' onclick='sendRequest($(this)); $(this).closest(\"div\").empty().after(requestSentTpl).closest(\".card\").find(\"[data-select-relation]\").remove()'><i class='far fa-check-circle'></i></a>" +
    "<a class='text-secondary mx-2' onclick='$(this).closest(\"div\").html(sendRequestTpl)'><i class='far fa-times-circle'></i></a>" +
    "</span>";

const requestSentTpl = "<div class='d-flex align-items-center ml-lg-auto'>Request sent</div>";

const userTpl =
    "{{#users}}" +
    "<div class='row justify-content-center'>" +
    "<div class='col-md-10'>" +
    "<div class='card testimonial-card shadow-none border mt-5 mb-2 px-3'>" +
    "<div class='card-body px-0 py-3 d-flex flex-lg-row flex-column'>" +
    "<div class='d-flex flex-row'>" +
    "<div class='avatar white d-flex align-items-center'>" +
    "<img src='{{user_pic_url}}' alt='profile picture' class='rounded-circle img-responsive'>" +
    "</div>" +
    "<div class='d-block ml-2 text-left col-lg-8 col-7'>" +
    "<h5 class='card-title font-weight-bold m-0 text-truncate'>{{user_name}}</h5>" +
    "<small class='text-muted text-left text-truncate'>@{{user_nickname}}</small>" +
    "</div>" +
    "</div>" +

    "{{#errMsg}}" +
    "<div class='d-flex align-items-center ml-auto'>{{errMsg}}</div>" +
    "{{/errMsg}}" +

    "{{^errMsg}}" +
    selectRelationTpl +
    "<div class='d-flex align-items-center' data-partner-id='{{user_id}}'>" +
    sendRequestTpl +
    "</div>" +
    "{{/errMsg}}" +

    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "{{/users}}" +
    "{{^users}}" +
    "<div class='text-center'>No matching results found</div>" +
    "{{/users}}";

function sendRequest(o) {

    $.ajax({
        type: "Post",
        url: "/send-request",
        data: {
            relationship: o.parents(".card").find('input').val(),
            partner_id: o.closest("[data-partner-id]").attr("data-partner-id")
        }
    });
}

/**********************************************************************************************************************/
// connected user template

const deleteRelationshipTpl =
    "<a class='text-danger mx-2' onclick='$(this).parent().html(cfmDeleteTpl)'><i class='far fa-trash-alt'></i></a>";

const cfmDeleteTpl =
    "<span class='d-flex'>" +
    "<a class='text-danger mx-2' onclick='deleteRelationship($(this))'><i class='far fa-check-circle'></i></a>" +
    "<a class='text-secondary mx-2' onclick='$(this).closest(\"div\").html(deleteRelationshipTpl)'><i class='far fa-times-circle'></i></a>" +
    "</span>";

function deleteRelationship(o) {
    $.ajax({
        type: "Post",
        url: "/delete-relationship",
        data: {
            partner_id: o.closest("[data-partner-id]").attr("data-partner-id")
        }
    });
    o.closest(".row").slideUp();
}

const rmFromFamilyTpl =
    "<a class='text-danger mx-2' onclick='$(this).parent().html(cfmRemoveTpl)'><i class='fas fa-user-minus'></i></a>";

const cfmRemoveTpl =
    "<span class='d-flex'>" +
    "<a class='text-danger mx-2' onclick='rmFromFamily($(this))'><i class='far fa-check-circle'></i></a>" +
    "<a class='text-secondary mx-2' onclick='$(this).closest(\"div\").html(rmFromFamilyTpl)'><i class='far fa-times-circle'></i></a>" +
    "</span>";

function rmFromFamily(o) {
    let row = o.closest(".row");
    $.ajax({
        type: "Post",
        url: "/remove-from-family",
        data: {
            family_id: row.find("[data-family-id]").attr("data-family-id"),
            remove_id: row.find("[data-remove-id]").attr("data-remove-id")
        }
    });
    row.slideUp();
}

const connectionTpl =
    "{{#connections}}" +
    "<div class='row justify-content-center'>" +
    "<div class='col-md-10'>" +
    "<div class='card testimonial-card shadow-none border mt-5 mb-2 px-3'>" +
    "<div class='card-body px-0 py-3 d-flex flex-lg-row flex-column'>" +
    "<div class='d-flex flex-row'>" +
    "<div class='avatar white d-flex align-items-center'>" +
    "<img src='{{user_pic_url}}' alt='profile picture' class='rounded-circle img-responsive'>" +
    "</div>" +
    "<div class='d-block ml-2 text-left col-lg-8 col-7'>" +
    "<h5 class='card-title font-weight-bold m-0 text-truncate'>{{user_name}}</h5>" +
    "<small class='text-muted text-left text-truncate'>@{{user_nickname}}</small>" +
    "</div>" +
    "</div>" +

    "<div class='d-flex flex-row align-items-center ml-lg-auto mt-lg-0 mt-3'>" +

    "{{#user_relationship}}" +
    "<div class='mr-3'>Relationship <b class='ml-2'>{{user_relationship}}</b></div>" +
    "{{/user_relationship}}" +

    "{{#family_id}}" +
    "<div data-family-id='{{family_id}}' data-remove-id='{{user_id}}'>" +
    rmFromFamilyTpl +
    "</div>" +
    "{{/family_id}}" +

    "{{^family_id}}" +
    "{{#user_relationship}}" +
    "<div data-partner-id='{{user_id}}'>" +
    deleteRelationshipTpl +
    "</div>" +
    "{{/user_relationship}}" +
    "{{/family_id}}" +

    "</div>" +

    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "{{/connections}}" +
    "{{^connections}}" +
    "<div class='text-center'>No connections to show</div>" +
    "{{/connections}}";
