$(() => {
    $("#search input").keyup((e) => {
        if (e.key === "Enter" && $(e.target).val()) {
            search();
        }
    });
    $("#search a").click(() => {
        search();
    });
});

const sendRequestTpl =
    "<button class='btn btn-sm btn-primary' onclick='if (isRelationshipSelected($(this))) { $(this).parent().html(cfmRequestTpl) }'>Send request</button>";

const cfmRequestTpl =
    "<span class='d-flex'>" +
    "<button class='btn btn-sm btn-success' onclick='sendRequest($(this)); $(this).closest(\"div\").empty().after(requestSentTpl).closest(\".card\").find(\".select-wrapper\").remove()'>Confirm</button>" +
    "<button class='btn btn-sm btn-secondary' onclick='$(this).closest(\"div\").html(sendRequestTpl)'>Cancel</button>" +
    "</span>";

const requestSentTpl = "<div class='d-flex align-items-center ml-lg-auto'>Request sent</div>";

const searchResultTpl =
    "{{#results}}" +
    "<div class='row justify-content-center'>" +
    "<div class='col-md-10'>" +
    "<div class='card testimonial-card mt-5 mb-2 px-3'>" +
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
    "{{/results}}" +
    "{{^results}}" +
    "<div class='text-center'>No matching results found</div>" +
    "{{/results}}";

function search() {
    let string = $("#search input").val();
    $.ajax({
        type: "Post",
        url: "search-users/",
        data: {
            string: string,
        },
        beforeSend: (() => {
            $("#results").empty().append($(loaderTpl));
        })
    }).done((res) => {
        $(Mustache.render(searchResultTpl, {
            results: res
        })).appendTo($("#results")).hide().imagesLoaded((imgLoad) => {
            $("#results :visible").remove();
            addSelectEvents($(imgLoad.elements).fadeIn().find(".select-wrapper input"));
        });
    });
}

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
