$(() => {
    $.ajax({
        type: "Post",
        url: "/get-family",
        beforeSend: (() => {
            $("[data-family-id]").empty().append($(loaderTpl));
        }),
        data: {
            family_id: $("[data-family-id]").attr("data-family-id")
        }
    }).done(res => {
        console.log(res);
        $("[data-family-id]").empty().hide()
            .append(Mustache.render(familyDetailTpl, res.details))
            .append(res.connections.length ? Mustache.render(connectionTpl, {
                connections: res.connections
            }) : "")
            .append(res.users.length ? Mustache.render(userTpl, {
                users: res.users
            }) : "")
            .imagesLoaded(imgLoad => {
                $(imgLoad.elements).fadeIn();
            });
    });
});

const familyDetailTpl =
    "<div class='row'>" +
    "<div class='col-lg-4 d-flex justify-content-center align-items-center'>" +
    "<img src='{{family_pic_url}}' class='rounded-circle' style='max-width: 250px;'>" +
    "</div>" +
    "<div class='col-lg-8 pt-0 my-5'>" +
    "<h3 class='mb-3 font-weight-bold text-uppercase'><strong>{{family_name}}</strong></h3>" +
    "<small class='text-muted'>Created by <b>{{family_creator}}</b> on {{family_createdOn}}</small>" +
    "<p class='mt-4 text-muted'>{{family_description}}</p>" +
    "</div>" +
    "</div>" +
    "<hr class='my-5'>" +
    "<h3 class='d-flex justify-content-center'>Members</h3>";
