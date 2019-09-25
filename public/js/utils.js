function reportError(o, err) {
    o.addClass("invalid")
        .parent(".md-form").prevAll(".md-form").find("input")
        .removeClass("invalid").addClass("valid");

    let e = o[0];
    e.setCustomValidity(err);
    e.reportValidity();
}

// Helper function to check if the date is in the valid range
function isInvalidDate(o, min, max = new Date()) {
    let inputDate = new Date(o.val());
    if (!isNaN(inputDate) && (!min || inputDate >= min) && inputDate <= max) {
        return false;
    }
    reportError(o, "Invalid date");
    return true;
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
