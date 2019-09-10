let SMOOTH_SCROLL_DURATION = 700;

$(document).ready(() => {
    // smooth scroll
    $("#navbarContent ul a").click(function () {
        let o = $($(this).attr("href")).offset();
        return o ? $("body,html").animate({
            scrollTop: o.top
        }, SMOOTH_SCROLL_DURATION) : true;
    });

    // main page animation
    new WOW().init();

    if (location.pathname !== "/") {
        $(".scrolling-navbar").addClass("top-nav-collapse").removeClass("scrolling-navbar");
    }
});

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

