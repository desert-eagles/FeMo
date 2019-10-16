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
    "{{#user}}" +
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
    relationTpl +
    "<button class='btn btn-sm btn-primary' onclick='checkRelation($(this))'>Send request</button>" +
    "<span style='display: none'>" +
    "<button class='btn btn-sm btn-danger' data-partner-id='{{user_id}}' onclick='sendRequest($(this))'>Confirm</button>" +
    "<button class='btn btn-sm btn-secondary' onclick='$(this).parent().hide().prev().show()'>Cancel</button>" +
    "</span>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "{{/user}}";

function search() {
    let string = $("#search input").val();
    $.ajax({
        type: "Post",
        url: "/searchRelation",
        data: {
            string: string,
        },
        beforeSend: (() => {
            $("#results").empty().append($(loaderTpl));
        })
    }).done((res) => {
        $(Mustache.render(searchResultTpl, {
            user: res
        })).appendTo($("#results")).hide()
            .imagesLoaded((imgLoad) => {
                $("#results :visible").remove();
                addSelectEvents($(imgLoad.elements).fadeIn().find(".select-wrapper input"));
            });
    });
}

function checkRelation(o) {
    let i = o.parents(".card").find('input');
    if (i.val()) {
        o.hide().next().show()
    } else {
        reportError(i, "Please select a relationship");
    }
}

function sendRequest(o) {
    $.ajax({
        type: "Post",
        url: "send-request/",
        data: {
            relationship: o.prev().find("input").val(),
            partner_id: o.attr("data-partner-id")
        }
    });

    let p = o.parent().addClass("ml-auto");
    p.empty().html("<button class='btn btn-sm btn-warning'>Request sent</button>");
    p.prevAll(":visible").first().remove();
}
