/**
 * Frontend for infinite scrolling and lazy loading of posts
 */


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
        // console.log(JSON.parse(res));
        $("#postContainer").append($(Mustache.render(postTpl, {post: JSON.parse(res)})));
    });

    // first page
    container.infiniteScroll('loadNextPage')
});
