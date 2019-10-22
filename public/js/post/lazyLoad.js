/**
 * Frontend for infinite scrolling and lazy loading of posts
 */

var postContainer = $("#postContainer");

$(() => {
    // add tabs of different families to the page
    $.ajax({
        type: "Post",
        url: "/get-families",
    }).done(res => {
        $(Mustache.render(tablist, {families: res})).hide().prependTo("#postContainer").fadeIn();

        // default to connections' posts
        initInfinityScroll(function () {
            return `/more-posts/${this.loadCount}`;
        });


        $("[data-is-path-prefix]").on("click", function (e) {
            $("[data-is-path-prefix]").removeClass("text-dark").addClass("text-primary");
            $(e.target).addClass("text-dark");
            $("section[data-post-id]").remove();
            initInfinityScroll(function () {
                return `${$(e.target).attr("data-IS-path-prefix")}/${this.loadCount}`;
            });
        });
    });
});

function initInfinityScroll(path) {
    if (postContainer.data('infinityScroll')) {
        postContainer.infiniteScroll('destroy');
    }

    postContainer.infiniteScroll({
        path: path,
        append: false,
        responseType: 'text',
        status: '.page-load-status',
        history: false,
    });

    postContainer.on('load.infiniteScroll', function (e, res) {
        $(Mustache.render(postTpl, {post: JSON.parse(res)})).appendTo(postContainer)
            .find(".post-image")
            .imagesLoaded({
                background: true
            }, (imgLoad) => {
                initPhotoSwipe(imgLoad.images);
            });
    });

    // first page
    postContainer.infiniteScroll('loadNextPage');
}


const tablist =
    '<section class="row d-flex justify-content-center">' +
    '<div class="col-lg-6 col-12">' +
    '<a class="btn-rounded d-inline-block border m-2 px-4 py-3 text-dark" data-is-path-prefix="/more-posts">Connections</a>' +
    '{{#families}}' +
    '<a class="btn-rounded d-inline-block border m-2 px-4 py-3 text-primary" data-is-path-prefix="/more-posts/{{family_id}}">{{family_name}}</a>' +
    '{{/families}}' +
    '</div>' +
    '</section>';

/**********************************************************************************************************************/

const deleteCommentTpl =
    "{{#comment_id}}" +
    "<span class='ml-2'>" +
    "<a class='text-primary' onclick='$(this).hide().next().fadeIn()'>Delete</a>" +
    "<span style='display: none'>" +
    "<a class='text-danger' onclick='deleteComment($(this))' data-comment-id='{{comment_id}}'>Confirm delete</a>" +
    "<a class='text-primary ml-1' onclick='$(this).parent().hide().prev().fadeIn()'>Cancel</a>" +
    "</span>" +
    "</span>" +
    "{{/comment_id}}";

const commentTpl =
    "<div class='media my-2 mx-1'>" +
    "<img src='{{comment_pic_url}}' alt='Avatar' class='d-flex rounded-circle comment-avatar z-depth-1-half mr-3'>" +
    "<small class='media-body'>" +
    "<div class='mt-0 font-weight-bold blue-text'>{{comment_nickname}}</div>" +
    "{{comment_description}}" +
    "<div class='mt-1 small text-muted' data-mark='commentMeta'>{{comment_timeago}}" +
    deleteCommentTpl +
    "</div>" +
    "</small>" +
    "</div>";

const postTpl =
    "{{#post}}" +
    "<section class='my-5' data-post-id='{{post_id}}'>" +

    // Grid row
    "<div class='row d-flex justify-content-center'>" +

    // Grid column
    "<div class='col-lg-6 col-12'>" +

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

    // mdbCard content
    "<div class='card-body'>" +
    "<p>{{post_description}}</p>" +
    // mdbCard image
    "<div class='post-images'>" +
    "{{#post_pic_urls}}" +
    "<a class='post-image' style='background-image:url({{pic_url}});' target='_blank'>" +
    "<div class='post-image-placeholder'></div>" +
    "</a>" +
    "{{/post_pic_urls}}" +
    "</div>" +
    "</div>" +

    // Social meta
    "<div class='card-body'>" +
    "<div class='social-meta'>" +
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
            post_id: $(e).parents("section").attr("data-post-id"),
            liked: !$(e).hasClass("fas")
        }
    });
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

        let comment = $(Mustache.render(commentTpl, {
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
        }).done(res => {
            if (!res.errMsg) {
                comment.find("[data-mark='commentMeta']")
                    .append(Mustache.render(deleteCommentTpl, {
                        comment_id: res.comment_id
                    }));
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
