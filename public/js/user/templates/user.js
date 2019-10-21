/**********************************************************************************************************************/
// user template

const sendRequestTpl =
    "<button class='btn btn-sm btn-primary' onclick='if (isRelationshipSelected($(this))) { $(this).parent().html(cfmRequestTpl) }'>Send request</button>";

const cfmRequestTpl =
    "<span class='d-flex'>" +
    "<button class='btn btn-sm btn-success' onclick='sendRequest($(this)); $(this).closest(\"div\").empty().after(requestSentTpl).closest(\".card\").find(\"[data-select-relation]\").remove()'>Confirm</button>" +
    "<button class='btn btn-sm btn-secondary' onclick='$(this).closest(\"div\").html(sendRequestTpl)'>Cancel</button>" +
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
    "<div data-partner-id='{{user_id}}'>" +
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
        url: "send-request/",
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

    "{{#user_relationship}}" +
    "<div class='d-flex align-items-center ml-lg-auto mr-3'>Relationship <b class='ml-2'>{{user_relationship}}</b></div>" +
    "<div class='d-flex align-items-center' data-partner-id='{{user_id}}'>" +
    deleteRelationshipTpl +
    "</div>" +
    "{{/user_relationship}}" +

    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "{{/connections}}" +
    "{{^connections}}" +
    "<div class='text-center'>No connections to show</div>" +
    "{{/connections}}";

function deleteRelationship(o) {
    $.ajax({
        type: "Post",
        url: "delete-relationship",
        data: {
            partner_id: o.closest("[data-partner-id]").attr("data-partner-id")
        }
    });
    o.closest(".row").slideUp();
}
