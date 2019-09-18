function reportError(o, err) {
    o.addClass("invalid")
        .parent(".md-form").prevAll(".md-form").find("input")
        .removeClass("invalid").addClass("valid");

    let e = o[0];
    e.setCustomValidity(err);
    e.reportValidity();
}

$(document).ready(() => {
    // smooth scroll
    $("#navbarContent ul a").click(function () {
        let o = $($(this).attr("href")).offset();
        return o ? $("body,html").animate({
            scrollTop: o.top
        }, 700) : true;
    });

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };

    if (location.pathname !== "/") {
        $(".scrolling-navbar").addClass("top-nav-collapse").removeClass("scrolling-navbar");
    }

    $("input").keypress((e) => {
        $(e.target).removeClass("valid invalid");
    });

    // initialise animation
    new WOW().init();
});
