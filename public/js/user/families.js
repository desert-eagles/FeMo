$(() => {
    $.ajax({
        type: "Post",
        url: "/get-families",
        beforeSend: (() => {
            $("#families").empty().append($(loaderTpl));
        })
    }).done(res => {
        $(Mustache.render(familyTpl, {
            families: res
        })).appendTo($("#families").empty()).hide().imagesLoaded(imgLoad => {
            $(imgLoad.elements).fadeIn();
        });
    });
});

const familyTpl =
    "{{#families}}" +
    "<div class='col-lg-6 mb-5'>" +
    "<div class='card testimonial-card'>" +
    "<div class='card-up indigo lighten-1'></div>" +
    // profile picture
    "<div class='avatar mx-auto white' style='width: 100px; height: 100px; margin-top: -50px'>" +
    "<img src='{{family_pic_url}}' class='rounded-circle' alt='family avatar'>" +
    "</div>" +
    "<div class='card-body'>" +
    // Name
    "<a href='/family/{{family_id}}'><h4 class='card-title text-uppercase'>{{family_name}}</h4></a>" +
    "<hr>" +
    // description
    "<p><i class='fas fa-quote-left mr-2'></i><span class='text-muted'>{{family_description}}</span></p>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "{{/families}}" +
    "{{^families}}" +
    "<p class='flex-fill text-center'>" +
    "Not belong to any family groups yet. Tell your family to invite you into their group or <a href='/create-family'>create</a> one yourself" +
    "</p>" +
    "{{/families}}";
