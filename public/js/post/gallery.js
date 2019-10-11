function initPhotoSwipe(images) {

    // loop through all gallery elements and bind events
    images.forEach(image => {
        $(image.element).on("click", (e) => openPhotoSwipe(e, images));
    });
}

function openPhotoSwipe(e, images) {
    let gallery = $(e.target).closest(".post-images");
    let clickedSlide = $(e.target).closest(".post-image");
    let slides = Array.from($(gallery).find(".post-image")).map(t => {
        let img = images.find(image => image.element === t).img;
        // create slide object
        return {
            src: img.src,
            msrc: img.src,
            w: img.width,
            h: img.height,
            thumb: t
        };
    });
    let options = {
        index: gallery.find(".post-image").index(clickedSlide),
        getThumbBoundsFn: function (index) {
            let rect = slides[index].thumb.getBoundingClientRect();
            return {x: rect.left, y: rect.top + $(window).scrollTop(), w: rect.width};
        },
        showHideOpacity: true,
        history: false,
        shareEl: false,
    };

    // Pass data to PhotoSwipe and initialize it
    (new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, slides, options)).init();
}