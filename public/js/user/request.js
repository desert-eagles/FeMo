$(() => {
    $.ajax({
        type: "Post",
        url: "get-requests/",
        data: {},
        beforeSend: (() => {
            $("#request").empty().append($(loaderTpl));
        })
    }).done((res) => {
        $(Mustache.render(requestTpl, {
            request: res
        })).appendTo($("#request")).hide()
            .imagesLoaded((imgLoad) => {
                $("#request :visible").remove();
                $(imgLoad.elements).fadeIn();
                $(".mdb-select").materialSelect();
            });
    });
});

const replRequestTpl =
    "<span class='d-flex'>" +
    "<button class='btn btn-sm btn-primary' onclick='if (isRelationshipSelected($(this))) { $(this).closest(\"div\").html(acceptRequestTpl) }'>Accept</button>" +
    "<button class='btn btn-sm btn-warning' onclick='$(this).closest(\"div\").html(declineRequestTpl)'>Decline</button>" +
    "</span>";

const acceptRequestTpl =
    "<span class='d-flex'>" +
    "<button class='btn btn-sm btn-success' onclick='acceptRequest($(this)); $(this).closest(\"div\").empty().after(acceptedTpl).closest(\".card\").find(\"[data-select-relation]\").remove()'>Confirm</button>" +
    "<button class='btn btn-sm btn-secondary' onclick='$(this).closest(\"div\").html(replRequestTpl)'>Cancel</button>" +
    "</span>";

const declineRequestTpl =
    "<span class='d-flex'>" +
    "<button class='btn btn-sm btn-danger' onclick='declineRequest($(this)); $(this).closest(\"div\").empty().after(declinedTpl).closest(\".card\").find(\".select-wrapper\").remove()'>Confirm</button>" +
    "<button class='btn btn-sm btn-secondary' onclick='$(this).closest(\"div\").html(replRequestTpl)'>Cancel</button>" +
    "</span>";

const acceptedTpl = "<div class='d-flex align-items-center ml-lg-auto'>Accepted</div>";

const declinedTpl = "<div class='d-flex align-items-center ml-lg-auto'>Declined</div>";

const requestTpl =
    "{{#request}}" +
    "<div class='row justify-content-center'>" +
    "<div class='col-12'>" +
    "<div class='card testimonial-card mt-5 mb-2 px-3'>" +
    "<div class='card-body px-0 py-3 d-flex flex-lg-row flex-column'>" +
    "<div class='d-flex flex-row'>" +
    "<div class='avatar white d-flex align-items-center'>" +
    "<img src='{{sender_pic_url}}' alt='profile picture' class='rounded-circle img-responsive'>" +
    "</div>" +
    "<div class='d-block ml-2 text-left col-lg-8 col-7'>" +
    "<h5 class='card-title font-weight-bold m-0 text-truncate'>{{sender_name}}</h5>" +
    "<small class='text-muted text-left text-truncate'>@{{sender_nickname}}</small>" +
    "</div>" +
    "</div>" +
    "<div class='d-flex align-items-center mx-lg-3 text-left'>who wants to add you as {{sender_relationship}}</div>" +

    selectRelationTpl +

    "<div data-request-id='{{request_id}}' data-relationship-idx='{{relationship_idx}}'>" +
    replRequestTpl +
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
