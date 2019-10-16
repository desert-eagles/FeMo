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

    selectRelationTpl +

    "<button class='btn btn-sm btn-primary' onclick='$(this).hide().next().show()'>Send request</button>" +
    "<span style='display: none'>" +
    "<button class='btn btn-sm btn-danger' data-partner-id='{{user_id}}' onclick='sendRequest($(this)); $(this).parent().hide().next().show()'>Confirm</button>" +
    "<button class='btn btn-sm btn-secondary' onclick='$(this).parent().hide().prev().show()'>Cancel</button>" +
    "</span>" +
    "<button style='display: none' class='btn btn-sm btn-warning'>Request sent</button>" +

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
    let i = o.parents(".card").find('input');
    let r = i.val();
    if (r) {
        $.ajax({
            type: "Post",
            url: "send-request/",
            data: {
                relationship: r,
                partner_id: o.attr("data-partner-id")
            }
        });
    } else {
        reportError(i, "Please select a relationship");
    }
}
