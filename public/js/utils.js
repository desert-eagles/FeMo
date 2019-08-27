let SMOOTH_SCROLL_DURATION = 700;

$(document).ready(() => {
    $("#navbarContent ul a").click(function () {
        let o = $($(this).attr("href")).offset();
        return o ? $("body,html").animate({
            scrollTop: o.top
        }, SMOOTH_SCROLL_DURATION) : true;
    });
});

new WOW().init();

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

