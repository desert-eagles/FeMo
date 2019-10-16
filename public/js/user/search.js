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
    "<div class='md-form select-wrapper mdb-select my-0 mr-2 ml-lg-auto'>" +
    "<i class='fas fa-user-friends prefix'></i>" +
    "<label class='mdb-main-label' for='{{resultId}}'>Relationship</label>" +
    "<span class='caret'>▼</span>" +
    "<input class='select-dropdown form-control' id='{{resultId}}' type='text' readonly='true' required='false' value=''>" +
    "<ul class='dropdown-content w-100' style='display: none;'>" +
    "<li><span>Father</span></li>" +
    "<li><span>Mother</span></li>" +
    "</ul>" +
    "</div>" +
    "<button class='btn btn-sm btn-primary' data-user-id='{{user_id}}'>Send request</button>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "{{/user}}";

function search() {
    let string = $("#search input").val();
    $.ajax({
        type: "Post",
        url: "/search",
        data: {
            string: string,
        },
        beforeSend: (() => {
            $("#results").empty().append($(
                "<div class='d-flex justify-content-center'>" +
                "<div class='spinner-grow my-5' role='status'></div>" +
                "</div>"
            ));
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
