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
    "<div class='card testimonial-card mb-3 result-card'>" +

    // Avatar
    "<div class='avatar mx-auto white'>" +
    "<img src='https://mdbootstrap.com/img/Photos/Avatars/img%20%2831%29.jpg' class='rounded-circle img-responsive' alt='woman avatar'>" +
    "</div>" +

    // Content
    "<div class='card-body closed'>" +

    // Name
    "<h5 class='card-title font-weight-bold'>Martha Smith</h5>" +
    "<hr>" +

    "<div class='md-form select-wrapper mdb-select'>" +
    "<i class='fas fa-user-friends prefix'></i>" +
    "<label class='mdb-main-label' for='{{resultId}}'>Relation</label>" +
    "<span class='caret'>▼</span>" +
    "<input class='select-dropdown form-control' id='{{resultId}}' type='text' readonly='true' required='false' value='' />" +
    "<ul class='dropdown-content w-100'>" +
    "<li><span>Father</span></li>" +
    "<li><span>Mother</span></li>" +
    "</ul>" +
    "</div>" +

    "<button class='btn btn-sm btn-primary'>Send request</button>" +

    "</div>";

function search() {
    let string = $("#search input").val();
    $.ajax({
        type: "Post",
        url: "/search",
        data: {
            string: string,
            type: string.includes("@") ? "email" : "nickname"
        },
        beforeSend: (() => {
            // $(".spinner-grow").show();
        }),
        complate: (() => {
            $(".spinner-grow").hide();
        })
    });

    $(searchResultTpl).appendTo($("#results")).hide()
        .imagesLoaded((imgLoad) => {
            addSelectEvents($(imgLoad.elements).fadeIn().find(".select-wrapper input"));
        });
}
