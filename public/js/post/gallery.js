function initPhotoSwipe(galleries, imgInfo) {

    // loop through all gallery elements and bind events
    galleries.forEach((g, i) => {
        $(g).attr('data-pswp-uid', i);
        $(g).find(".post-image").on("click", (e) => openPhotoSwipe(e, imgInfo));
    });
}

function openPhotoSwipe(e, imgInfo) {
    let gallery = $(e.currentTarget).closest(".post-images");
    let index = gallery.find(".post-image").index(e.currentTarget);
    let items = Array.from($(gallery).find(".post-image")).map(t => {
        let img = imgInfo.find(i => i.element === t);
        // create slide object
        return {
            src: img.url,
            msrc: img.url,
            w: img.img.width,
            h: img.img.height,
            el: t
        };
    });
    let options = {
        galleryUID: gallery.attr('data-pswp-uid'),
        index: index,
        getThumbBoundsFn: function (index) {
            let thumbnail = items[index].el,
                pageYScroll = $(window).scrollTop(),
                rect = thumbnail.getBoundingClientRect();

            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
        },
        showHideOpacity: true
    };

    // Pass data to PhotoSwipe and initialize it
    (new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, items, options)).init();
}