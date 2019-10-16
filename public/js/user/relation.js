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
    "<div class='col-lg-3 col-md-4 col-sm-6'>" +
    "<div class='card testimonial-card my-5 px-3'>" +

    // Avatar
    "<div class='avatar mx-auto white'>" +
    "<img src='https://mdbootstrap.com/img/Photos/Avatars/img%20%2831%29.jpg' class='rounded-circle img-responsive' alt='woman avatar'>" +
    "</div>" +

    // Content
    "<div class='card-body px-0 py-4'>" +

    // Name
    "<h5 class='card-title font-weight-bold'>Martha Smith</h5>" +

    "<hr>" +

    "<div class='md-form select-wrapper mdb-select'>" +
    "<i class='fas fa-user-friends prefix'></i>" +
    "<label class='mdb-main-label' for='{{resultId}}'>Relationship</label>" +
    "<span class='caret'>▼</span>" +
    "<input class='select-dropdown form-control' id='{{resultId}}' type='text' readonly='true' required='false' value='' />" +
    "<ul class='dropdown-content w-100'>" +
    "<li><span>Father</span></li>" +
    "<li><span>Mother</span></li>" +
    "</ul>" +
    "</div>" +

    "<button class='btn btn-sm btn-primary'>Send request</button>" +

    "</div>" +
    "</div>";

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
                "<div class='mx-auto'>" +
                "<div class='spinner-grow my-5' role='status'></div>" +
                "</div>"
            ));
        })
    });

    $(searchResultTpl).appendTo($("#results")).hide()
        .imagesLoaded((imgLoad) => {
            $("#results :visible").remove();
            addSelectEvents($(imgLoad.elements).fadeIn().find(".select-wrapper input"));
        });
}
