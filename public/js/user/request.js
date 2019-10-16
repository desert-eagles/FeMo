$(() => {
    $.ajax({
        type: "Post",
        url: "/get-requests",
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
    "<div class='col-md-10'>" +
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
    "<div>who wants to add you as {{sender_relationship}}</div>" +
    relationTpl +
    "<button class='btn btn-sm btn-primary' data-request-id='{{request_id}}' onclick='cfmRequest($(this))'>Send request</button>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "{{/request}}";

function cfmRequest(o) {
    let i = o.prev().find("input");
    let r = i.val();

    if (r) {
        $.ajax({
            type: "Post",
            url: "confirm-request/",
            data: {
                relationship: r,
                request_id: o.attr("data-request-id")
            }
        });
    } else {
        reportError(i, "Please select a relationship");
    }
}
