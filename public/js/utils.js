let SMOOTH_SCROLL_DURATION = 700;

$(document).ready(() => {
    $("#navbarContent ul a").click(function () {
        return $("body,html").animate({
            scrollTop: $($(this).attr("href")).offset().top
        }, SMOOTH_SCROLL_DURATION);
    });
});