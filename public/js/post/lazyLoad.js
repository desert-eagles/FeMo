$(() => {
    let container = $("#postContainer");

    container.infiniteScroll({
        path: function () {
            return `/more-posts/${this.loadCount}`;
        },
        append: false,
        responseType: 'text',
        status: '.page-load-status',
        history: false,
    });

    container.on('load.infiniteScroll', function (e, res) {
        $("#postContainer").append($(Mustache.render(postTpl, {post: JSON.parse(res)})));
    });

    // first page
    container.infiniteScroll('loadNextPage')
});

const postTpl =
    "{{#post}}" +
    "<section class='my-5'>" +

    // Grid row
    "<div class='d-flex justify-content-center'>" +

    // Grid column
    "<div class='w-50'>" +

    // mdbCard
    "<div class='card news-card'>" +

    // Heading
    "<div class='card-body'>" +
    "<div class='content'>" +
    "<div class='right-side-meta'>14 h</div>" +
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
    "<span><i class='far fa-heart'></i>{{post_like}} likes</span>" +
    "<p><i class='fa fa-comment'></i>13 comments</p>" +
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
