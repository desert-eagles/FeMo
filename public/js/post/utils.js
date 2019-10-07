const likeTpl = "<a class='far fa-heart' onclick='toggleLike(this)'></a>";
const likedTpl = "<a class='fas fa-heart' style='color: #fb3958' onclick='toggleLike(this)'></a>";

const postTpl =
    "{{#post}}" +
    "<section class='my-5' data-post-id='{{post_id}}'>" +

    // Grid row
    "<div class='d-flex justify-content-center'>" +

    // Grid column
    "<div class='w-50'>" +

    // mdbCard
    "<div class='card news-card'>" +

    // Heading
    "<div class='card-body'>" +
    "<div class='content'>" +
    "<div class='right-side-meta'>{{post_timeago}}</div>" +
    "<img class='rounded-circle avatar-img z-depth-1-half' src='{{user_pic_url}}' alt='profile picture'>" +
    "{{user_nickname}}" +
    "</div>" +
    "</div>" +

    // mdbCard image
    "{{#post_pic_urls}}" +
    "<img class='card-img-top' src='{{post_pic_urls}}' alt='post pictures'>" +
    "{{/post_pic_urls}}" +

    // mdbCard content
    "<div class='card-body'>" +

    // Social meta
    "<div class='social-meta'><p>{{post_description}}</p>" +
    "<span>" +
    `{{#self_liked}}${likedTpl}{{/self_liked}}` +
    `{{^self_liked}}${likeTpl}{{/self_liked}}` +
    "{{post_n_likes}}</span>" +
    "<p><i class='fa fa-comment mr-2'></i>13</p>" +
    "</div>" +

    "<hr>" +

    // Comment input
    "<div class='md-form'>" +
    "<i class='far fa-heart prefix active'></i>" +
    "<input class='form-control' id='form5' placeholder='Add Comment...' type='text'>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</section>" +
    "{{/post}}";

function toggleLike(e) {
    let parent = $(e).parent();
    $(e).remove();

    if ($(e).hasClass("fas")) {
        parent.html(function (i, val) {
            return parseInt(val) - 1;
        });
        $(likeTpl).prependTo(parent);
    } else {
        parent.html(function (i, val) {
            return parseInt(val) + 1;
        });
        $(likedTpl).prependTo(parent).addClass("bounceIn animated");
    }

    $.ajax({
        type: "Post",
        url: "/toggle-like",
        data: {
            post_id: parent.parents("section").attr("data-post-id"),
            liked: parent.find("a").hasClass("fas")
        }
    })
}
