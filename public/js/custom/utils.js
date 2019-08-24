let SMOOTH_SCROLL_DURATION = 700;

$(document).ready(() => {
    $("#navbarContent ul a").click(function () {
        let e = $(this).attr("href");
        if (void 0 !== e && 0 === e.indexOf("#")) {
            var t = $(this).attr("data-offset") ? $(this).attr("data-offset") : 0,
                n = $(this).parentsUntil(".smooth-scroll").last().parent().attr("data-allow-hashes");
            return $("body,html").animate({
                scrollTop: $(e).offset().top - t
            }, SMOOTH_SCROLL_DURATION), void 0 !== n && !1 !== n && history.replaceState(null, null, e), !1
        }
    });
});