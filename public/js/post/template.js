const likeFa = "<a class='far fa-heart' onclick='toggleLike(this)'></a>";
const likedFa = "<a class='fas fa-heart' style='color: #fb3958' onclick='toggleLike(this)'></a>";

const commentFa = "<i class='fas fa-comment'></i>";
const nocommentFa = "<i class='far fa-comment'></i>";

const commentTpl =
    "<div class='media my-2 mx-1'>" +
    "<img src='{{comment_pic_url}}' alt='Avatar' class='d-flex rounded-circle comment-avatar z-depth-1-half mr-3'>" +
    "<small class='media-body'>" +
    "<div class='mt-0 font-weight-bold blue-text'>{{comment_nickname}}</div>" +
    "{{comment_description}}" +
    "<div class='mt-1 small text-muted'>{{comment_timeago}}" +
    "{{#comment_id}}<a class='text-primary ml-2' onclick='deleteComment($(this))' data-comment-id='{{comment_id}}'>Delete</a>{{/comment_id}}" +
    "</div>" +
    "</small>" +
    "</div>";

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
    `{{#self_liked}}${likedFa}{{/self_liked}}` +
    `{{^self_liked}}${likeFa}{{/self_liked}}` +
    "{{post_n_likes}}</span>" +
    "<p>" +
    `{{#post_n_comments}}${commentFa}{{/post_n_comments}}` +
    `{{^post_n_comments}}${nocommentFa}{{/post_n_comments}}` +
    "{{post_n_comments}}</p>" +
    "</div>" +

    "<hr>" +

    // Comment input
    "<div class='md-form'>" +
    `<img class='prefix rounded-circle z-depth-1-half comment-avatar' style='top:-0.25rem' src='${$("#profile-pic img").attr("src")}' alt='profile picture'>` +
    "<input class='form-control' placeholder='Add Comment...' type='text' onfocus='$(this).next().slideDown()' onblur='$(this).next().slideUp()' onkeyup='comment(event)'>" +
    "<small class='form-text text-muted' style='display: none'>Press enter to submit</small>" +
    "</div>" +

    "<hr>" +

    "{{#post_comments}}" + commentTpl + "{{/post_comments}}" +

    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</section>" +
    "{{/post}}";

function toggleLike(e) {
    let p = $(e).parent();
    $(e).remove();

    if ($(e).hasClass("fas")) {
        $(likeFa).prependTo(p.html(function (i, val) {
            return parseInt(val) - 1;
        }));
    } else {
        $(likedFa).prependTo(p.html(function (i, val) {
            return parseInt(val) + 1;
        })).addClass("bounceIn animated");
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
    if (e.key === "Enter" && o.val()) {
        $(Mustache.render(commentTpl, {
            comment_nickname: $("#profile-nickname").html(),
            comment_pic_url: $("#profile-pic img").attr("src"),
            comment_description: o.val(),
            comment_timeago: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
            }),
            comment_id: false
        })).insertBefore(o.parents("section").find(".media").first());

        $.ajax({
            type: "Post",
            url: "/comment-post",
            data: {
                post_id: o.parents("section").attr("data-post-id"),
                comment: o.val()
            }
        });

        o.val("").blur();
        let i = o.parents(".card-body").find(".fa-comment");
        let p = i.parent();
        i.remove();
        $(commentFa).prependTo(p.html(function (i, val) {
            return parseInt(val) + 1;
        }));
    }
}

function deleteComment(o) {
    o.parents(".media").remove();

    $.ajax({
        type: "Post",
        url: "delete-comment",
        data: {
            comment_id: o.attr("data-comment-id")
        }
    });
}
