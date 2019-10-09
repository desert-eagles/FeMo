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
    "<a class='far fa-heart' style='{{#self_liked}}display: none;{{/self_liked}}' onclick='toggleLike(this)'></a>" +
    "<a class='fas fa-heart' style='{{^self_liked}}display: none;{{/self_liked}}color: #fb3958' onclick='toggleLike(this)'></a>" +
    "<span>{{post_n_likes}}</span></span>" +
    "<div>" +
    "<i class='far fa-comment' style='{{#post_n_comments}}display: none;{{/post_n_comments}}'></i>" +
    "<i class='fas fa-comment' style='{{^post_n_comments}}display: none;{{/post_n_comments}}'></i>" +
    "<div class='d-inline'>{{post_n_comments}}</div></div>" +
    "</div>" +

    "<hr>" +

    // Comment input
    "<div class='md-form'>" +
    `<img class='prefix rounded-circle z-depth-1-half comment-avatar' style='top:-0.25rem' src='${$("#profile-pic img").attr("src")}' alt='profile picture'>` +
    "<input class='form-control' placeholder='Add Comment...' type='text' onfocus='$(this).next().slideDown()' onblur='$(this).next().slideUp()' onkeyup='comment(event)'>" +
    "<small class='form-text text-muted' style='display: none'>Press enter to submit</small>" +
    "</div>" +

    "{{#post_n_comments}}<hr>{{/post_n_comments}}" +
    "{{#post_comments}}" + commentTpl + "{{/post_comments}}" +

    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</section>" +
    "{{/post}}";

function toggleLike(e) {

    $(e).siblings("a").addBack().toggle().filter(":visible").addClass("bounceIn animated")
        .siblings("span").text((i, v) => {
        return parseInt(v) + ($(e).hasClass("fas") ? -1 : 1);
    });

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
        let container = o.closest(".card-body");
        let fas = container.find(".fa-comment");
        fas.siblings("div")
            .text((i, v) => {
                v = parseInt(v);
                if (!v) {
                    fas.toggle();
                    container.append("<hr>");
                }
                return v + 1
            });

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
        })).appendTo(container);

        $.ajax({
            type: "Post",
            url: "/comment-post",
            data: {
                post_id: o.parents("section").attr("data-post-id"),
                comment: o.val()
            }
        });

        // reset comment input
        o.val("").blur();
    }
}

function deleteComment(o) {
    let container = o.closest(".card-body");
    let fas = container.find(".fa-comment");
    fas.siblings("div")
        .text((i, v) => {
            v = parseInt(v) - 1;
            if (!v) {
                fas.toggle();
                container.find("hr").last().remove();
            }
            return v;
        });
    o.closest(".media").remove();

    $.ajax({
        type: "Post",
        url: "delete-comment",
        data: {
            comment_id: o.attr("data-comment-id")
        }
    });
}
