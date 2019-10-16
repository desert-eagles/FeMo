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
                addSelectEvents($(imgLoad.elements).fadeIn().find(".select-wrapper input"));
            });
    });
});

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

    "<span>" +
    "<button class='btn btn-sm btn-primary' onclick='$(this).parent().hide().next().show().click((e) => {acceptRequest(e)})'>Accept</button>" +
    "<button class='btn btn-sm btn-danger' onclick='$(this).parent().hide().next().show()'>Decline</button>" +
    "</span>" +
    "<span style='display: none'>" +
    "<button class='btn btn-sm btn-danger' data-request-id='{{request_id}}' data-relationship-idx='{{relationship_idx}}' onclick='$(this).parent().hide().next().show()'>Confirm</button>" +
    "<button class='btn btn-sm btn-secondary' onclick='$(this).parent().hide().prev().show()'>Cancel</button>" +
    "</span>" +
    "<button style='display: none' class='btn btn-sm btn-warning ml-auto'>Request sent</button>" +

    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "{{/request}}" +
    "{{^request}}" +
    "<div class='text-center'>No requests to show</div>" +
    "{{/request}}";

function acceptRequest(e) {
    let o = $(e.target);
    let i = o.prev().find("input");
    let r = i.val();

    if (r) {
        $.ajax({
            type: "Post",
            url: "accept-request/",
            data: {
                request_id: o.attr("data-request-id"),
                relationship_idx: o.attr("data-relationship-idx"),
                relationship: r,
            }
        });
    } else {
        reportError(i, "Please select a relationship");
    }
}
