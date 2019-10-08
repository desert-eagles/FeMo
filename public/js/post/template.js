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
    "<p><i class='far fa-comment'></i>0</p>" +
    "</div>" +

    "<hr>" +

    // Comment input
    "<div class='md-form'>" +
    `<img class='prefix rounded-circle z-depth-1-half' style='top:0; width:25px' src='${$("#profile-pic img").attr("src")}' alt='profile picture'>` +
    "<input class='form-control' placeholder='Add Comment...' type='text' onfocus='$(this).next().slideDown()' onblur='$(this).next().slideUp()' onkeyup='comment(event)' data-ready='true'>" +
    "<small class='form-text text-muted' style='display: none'>Press enter to submit</small>" +
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

function comment(e) {
    let o = $(e.target);
    if (e.key === "Enter" && o.val() && o.attr("data-ready") === "true") {
        o.attr("data-ready", "false");
        $.ajax({
            type: "Post",
            url: "/comment-post",
            data: {
                post_id: o.parents("section").attr("data-post-id"),
                comment: o.val()
            }
        }).done((res) => {
            if (!res.errMsg) {
                o.val("").attr("data-ready", "true").blur();

                let i = o.parents(".md-form").siblings(".social-meta").find(".fa-comment");
                let p = i.parent();
                i.remove().removeClass("far").addClass("fas").prependTo(p.html(function (_, val) {
                    return parseInt(val) + 1;
                })).addClass("bounceIn animated");
            }
        });
    }
}
