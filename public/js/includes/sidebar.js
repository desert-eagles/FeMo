$(document).ready(() => {
    // SideNav Initialization
    $(".button-collapse").sideNav();
    $(".fade").addClass("show");
});

(function (e) {
    var t = 240, n = Infinity, i = 300, o = 200, r = 50, a = 200, s = "easeOutQuad", l = "easeOutCubic", c = !0, u = !1,
        d = function () {
            function d(h, f) {
                _classCallCheck(this, d), this.defaults = {
                    MENU_WIDTH: t,
                    edge: "left",
                    closeOnClick: !1,
                    breakpoint: n,
                    timeDurationOpen: i,
                    timeDurationClose: o,
                    timeDurationOverlayOpen: r,
                    timeDurationOverlayClose: a,
                    easingOpen: s,
                    easingClose: l,
                    showOverlay: c,
                    showCloseButton: u
                }, this.$element = h, this.$elementCloned = h.clone().css({
                    display: "inline-block",
                    lineHeight: "24px"
                }), this.options = this.assignOptions(f), this.menuOut = !1, this.lastTouchVelocity = {
                    x: {
                        startPosition: 0,
                        startTime: 0,
                        endPosition: 0,
                        endTime: 0
                    }
                }, this.$body = e("body"), this.$menu = e("#".concat(this.$element.attr("data-activates"))), this.$sidenavOverlay = e("#sidenav-overlay"), this.$dragTarget = e('<div class="drag-target"></div>'), this.$body.append(this.$dragTarget), this.init()
            }

            return _createClass(d, [{
                key: "init", value: function () {
                    this.setMenuWidth(), this.setMenuTranslation(), this.closeOnClick(), this.openOnClick(), this.bindTouchEvents(), this.showCloseButton(), this.inputOnClick()
                }
            }, {
                key: "bindTouchEvents", value: function () {
                    var e = this;
                    this.$dragTarget.on("click", function () {
                        return e.removeMenu()
                    }), this.$elementCloned.on("click", function () {
                        return e.removeMenu()
                    }), this.$dragTarget.on("touchstart", function (t) {
                        e.lastTouchVelocity.x.startPosition = t.touches[0].clientX, e.lastTouchVelocity.x.startTime = Date.now()
                    }), this.$dragTarget.on("touchmove", this.touchmoveEventHandler.bind(this)), this.$dragTarget.on("touchend", this.touchendEventHandler.bind(this))
                }
            }, {
                key: "touchmoveEventHandler", value: function (e) {
                    if ("touchmove" === e.type) {
                        var t = e.touches[0], n = t.clientX;
                        Date.now() - this.lastTouchVelocity.x.startTime > 20 && (this.lastTouchVelocity.x.startPosition = t.clientX, this.lastTouchVelocity.x.startTime = Date.now()), this.disableScrolling(), 0 !== this.$sidenavOverlay.length || this.buildSidenavOverlay(), "left" === this.options.edge && (n > this.options.MENU_WIDTH ? n = this.options.MENU_WIDTH : n < 0 && (n = 0)), this.translateSidenavX(n), this.updateOverlayOpacity(n)
                    }
                }
            }, {
                key: "panEventHandler", value: function (e) {
                    if ("touch" === e.gesture.pointerType) {
                        var t = e.gesture.center.x;
                        this.disableScrolling(), 0 !== this.$sidenavOverlay.length || this.buildSidenavOverlay(), "left" === this.options.edge && (t > this.options.MENU_WIDTH ? t = this.options.MENU_WIDTH : t < 0 && (t = 0)), this.translateSidenavX(t), this.updateOverlayOpacity(t)
                    }
                }
            }, {
                key: "translateSidenavX", value: function (e) {
                    if ("left" === this.options.edge) {
                        var t = e >= this.options.MENU_WIDTH / 2;
                        this.menuOut = t, this.$menu.css("transform", "translateX(".concat(e - this.options.MENU_WIDTH, "px)"))
                    } else {
                        var n = e < window.innerWidth - this.options.MENU_WIDTH / 2;
                        this.menuOut = n;
                        var i = e - this.options.MENU_WIDTH / 2;
                        i < 0 && (i = 0), this.$menu.css("transform", "translateX(".concat(i, "px)"))
                    }
                }
            }, {
                key: "updateOverlayOpacity", value: function (e) {
                    var t;
                    t = "left" === this.options.edge ? e / this.options.MENU_WIDTH : Math.abs((e - window.innerWidth) / this.options.MENU_WIDTH), this.$sidenavOverlay.velocity({opacity: t}, {
                        duration: 10,
                        queue: !1,
                        easing: this.options.easingOpen
                    })
                }
            }, {
                key: "buildSidenavOverlay", value: function () {
                    var t = this;
                    !0 === this.options.showOverlay && (this.$sidenavOverlay = e('<div id="sidenav-overlay"></div>'), this.$sidenavOverlay.css("opacity", 0).on("click", function () {
                        return t.removeMenu()
                    }), this.$body.append(this.$sidenavOverlay))
                }
            }, {
                key: "disableScrolling", value: function () {
                    var e = this.$body.innerWidth();
                    this.$body.css("overflow", "hidden"), this.$body.width(e)
                }
            }, {
                key: "touchendEventHandler", value: function (e) {
                    if ("touchend" === e.type) {
                        var t = e.changedTouches[0];
                        this.lastTouchVelocity.x.endTime = Date.now(), this.lastTouchVelocity.x.endPosition = t.clientX;
                        var n = this.calculateTouchVelocityX(), i = t.clientX, o = i - this.options.MENU_WIDTH,
                            r = i - this.options.MENU_WIDTH / 2;
                        o > 0 && (o = 0), r < 0 && (r = 0), "left" === this.options.edge ? (this.menuOut && n <= .3 || n < -.5 ? (0 !== o && this.translateMenuX([0, o], "300"), this.showSidenavOverlay()) : (!this.menuOut || n > .3) && (this.enableScrolling(), this.translateMenuX([-1 * this.options.MENU_WIDTH - 10, o], "200"), this.hideSidenavOverlay()), this.$dragTarget.css({
                            width: "10px",
                            right: "",
                            left: 0
                        })) : this.menuOut && n >= -.3 || n > .5 ? (this.translateMenuX([0, r], "300"), this.showSidenavOverlay(), this.$dragTarget.css({
                            width: "50%",
                            right: "",
                            left: 0
                        })) : (!this.menuOut || n < -.3) && (this.enableScrolling(), this.translateMenuX([this.options.MENU_WIDTH + 10, r], "200"), this.hideSidenavOverlay(), this.$dragTarget.css({
                            width: "10px",
                            right: 0,
                            left: ""
                        }))
                    }
                }
            }, {
                key: "calculateTouchVelocityX", value: function () {
                    return Math.abs(this.lastTouchVelocity.x.endPosition - this.lastTouchVelocity.x.startPosition) / Math.abs(this.lastTouchVelocity.x.endTime - this.lastTouchVelocity.x.startTime)
                }
            }, {
                key: "panendEventHandler", value: function (e) {
                    if ("touch" === e.gesture.pointerType) {
                        var t = e.gesture.velocityX, n = e.gesture.center.x, i = n - this.options.MENU_WIDTH,
                            o = n - this.options.MENU_WIDTH / 2;
                        i > 0 && (i = 0), o < 0 && (o = 0), "left" === this.options.edge ? (this.menuOut && t <= .3 || t < -.5 ? (0 !== i && this.translateMenuX([0, i], "300"), this.showSidenavOverlay()) : (!this.menuOut || t > .3) && (this.enableScrolling(), this.translateMenuX([-1 * this.options.MENU_WIDTH - 10, i], "200"), this.hideSidenavOverlay()), this.$dragTarget.css({
                            width: "10px",
                            right: "",
                            left: 0
                        })) : this.menuOut && t >= -.3 || t > .5 ? (this.translateMenuX([0, o], "300"), this.showSidenavOverlay(), this.$dragTarget.css({
                            width: "50%",
                            right: "",
                            left: 0
                        })) : (!this.menuOut || t < -.3) && (this.enableScrolling(), this.translateMenuX([this.options.MENU_WIDTH + 10, o], "200"), this.hideSidenavOverlay(), this.$dragTarget.css({
                            width: "10px",
                            right: 0,
                            left: ""
                        }))
                    }
                }
            }, {
                key: "translateMenuX", value: function (e, t) {
                    this.$menu.velocity({translateX: e}, {
                        duration: "string" == typeof t ? Number(t) : t,
                        queue: !1,
                        easing: this.options.easingOpen
                    })
                }
            }, {
                key: "hideSidenavOverlay", value: function () {
                    this.$sidenavOverlay.velocity({opacity: 0}, {
                        duration: this.options.timeDurationOverlayClose,
                        queue: !1,
                        easing: this.options.easingOpen,
                        complete: function () {
                            e(this).remove()
                        }
                    })
                }
            }, {
                key: "showSidenavOverlay", value: function () {
                    this.$sidenavOverlay.velocity({opacity: 1}, {
                        duration: this.options.timeDurationOverlayOpen,
                        queue: !1,
                        easing: this.options.easingOpen
                    })
                }
            }, {
                key: "enableScrolling", value: function () {
                    this.$body.css({overflow: "", width: ""})
                }
            }, {
                key: "openOnClick", value: function () {
                    var t = this;
                    this.$element.on("click", function (n) {
                        if (n.preventDefault(), !0 === t.menuOut) t.removeMenu(); else {
                            t.menuOut = !0, !0 === t.options.showOverlay ? e("#sidenav-overlay").length || (t.$sidenavOverlay = e('<div id="sidenav-overlay"></div>'), t.$body.append(t.$sidenavOverlay)) : t.showCloseButton();
                            var i = [];
                            i = "left" === t.options.edge ? [0, -1 * t.options.MENU_WIDTH] : [0, t.options.MENU_WIDTH], "matrix(1, 0, 0, 1, 0, 0)" !== t.$menu.css("transform") && t.$menu.velocity({translateX: i}, {
                                duration: t.options.timeDurationOpen,
                                queue: !1,
                                easing: t.options.easingOpen
                            }), t.$sidenavOverlay.on("click", function () {
                                return t.removeMenu()
                            }), t.$sidenavOverlay.on("touchmove", t.touchmoveEventHandler.bind(t)), t.$menu.on("touchmove", function (e) {
                                e.preventDefault(), t.$menu.find(".custom-scrollbar").css("padding-bottom", "30px")
                            }), t.menuOut = !0
                        }
                    })
                }
            }, {
                key: "closeOnClick", value: function () {
                    var e = this;
                    !0 === this.options.closeOnClick && (this.$menu.on("click", "a:not(.collapsible-header)", function () {
                        return e.removeMenu()
                    }), "translateX(0)" === this.$menu.css("transform") && this.click(function () {
                        return e.removeMenu()
                    }))
                }
            }, {
                key: "showCloseButton", value: function () {
                    !0 === this.options.showCloseButton && (this.$menu.prepend(this.$elementCloned), this.$menu.find(".logo-wrapper").css({borderTop: "1px solid rgba(153,153,153,.3)"}))
                }
            }, {
                key: "setMenuTranslation", value: function () {
                    var t = this;
                    "left" === this.options.edge ? (this.$menu.css("transform", "translateX(-100%)"), this.$dragTarget.css({left: 0})) : (this.$menu.addClass("right-aligned").css("transform", "translateX(100%)"), this.$dragTarget.css({right: 0})), this.$menu.hasClass("fixed") && (window.innerWidth > this.options.breakpoint && this.$menu.css("transform", "translateX(0)"), this.$menu.find("input[type=text]").on("touchstart", function () {
                        t.$menu.addClass("transform-fix-input")
                    }), e(window).resize(function () {
                        if (window.innerWidth > t.options.breakpoint) t.$sidenavOverlay.length ? t.removeMenu(!0) : t.$menu.css("transform", "translateX(0%)"); else if (!1 === t.menuOut) {
                            var e = "left" === t.options.edge ? "-100" : "100";
                            t.$menu.css("transform", "translateX(".concat(e, "%)"))
                        }
                    }))
                }
            }, {
                key: "setMenuWidth", value: function () {
                    var n = e("#".concat(this.$menu.attr("id"))).find("> .sidenav-bg");
                    this.options.MENU_WIDTH !== t && (this.$menu.css("width", this.options.MENU_WIDTH), n.css("width", this.options.MENU_WIDTH))
                }
            }, {
                key: "inputOnClick", value: function () {
                    var e = this;
                    this.$menu.find("input[type=text]").on("touchstart", function () {
                        return e.$menu.css("transform", "translateX(0)")
                    })
                }
            }, {
                key: "assignOptions", value: function (t) {
                    return e.extend({}, this.defaults, t)
                }
            }, {
                key: "removeMenu", value: function (e) {
                    var t = this;
                    this.$body.css({
                        overflow: "",
                        width: ""
                    }), this.$menu.velocity({translateX: "left" === this.options.edge ? "-100%" : "100%"}, {
                        duration: this.options.timeDurationClose,
                        queue: !1,
                        easing: this.options.easingClose,
                        complete: function () {
                            !0 === e && (t.$menu.removeAttr("style"), t.$menu.css("width", t.options.MENU_WIDTH))
                        }
                    }), this.$menu.hasClass("transform-fix-input") && this.$menu.removeClass("transform-fix-input"), this.hideSidenavOverlay(), this.menuOut = !1
                }
            }]), d
        }();
    e.fn.sideNav = function (t) {
        return this.each(function () {
            new d(e(this), t)
        })
    }
})(jQuery);

(function (e) {
    e.fn.collapsible = function (t) {
        var n = {accordion: void 0};

        function i(t, n) {
            $panelHeaders = t.find("> li > .collapsible-header"), n.hasClass("active") ? n.parent().addClass("active") : n.parent().removeClass("active"), n.parent().hasClass("active") ? n.siblings(".collapsible-body").stop(!0, !1).slideDown({
                duration: 350,
                easing: "easeOutQuart",
                queue: !1,
                complete: function () {
                    e(this).css("height", "")
                }
            }) : n.siblings(".collapsible-body").stop(!0, !1).slideUp({
                duration: 350,
                easing: "easeOutQuart",
                queue: !1,
                complete: function () {
                    e(this).css("height", "")
                }
            }), $panelHeaders.not(n).removeClass("active").parent().removeClass("active"), $panelHeaders.not(n).parent().children(".collapsible-body").stop(!0, !1).slideUp({
                duration: 350,
                easing: "easeOutQuart",
                queue: !1,
                complete: function () {
                    e(this).css("height", "")
                }
            })
        }

        function o(t) {
            t.hasClass("active") ? t.parent().addClass("active") : t.parent().removeClass("active"), t.parent().hasClass("active") ? t.siblings(".collapsible-body").stop(!0, !1).slideDown({
                duration: 350,
                easing: "easeOutQuart",
                queue: !1,
                complete: function () {
                    e(this).css("height", "")
                }
            }) : t.siblings(".collapsible-body").stop(!0, !1).slideUp({
                duration: 350,
                easing: "easeOutQuart",
                queue: !1,
                complete: function () {
                    e(this).css("height", "")
                }
            })
        }

        function r(e) {
            return a(e).length > 0
        }

        function a(e) {
            return e.closest("li > .collapsible-header")
        }

        return t = e.extend(n, t), this.each(function () {
            var n = e(this), s = e(this).find("> li > .collapsible-header"), l = n.data("collapsible");
            n.off("click.collapse", ".collapsible-header"), s.off("click.collapse"), t.accordion || "accordion" === l || void 0 === l ? ((s = n.find("> li > .collapsible-header")).on("click.collapse", function (t) {
                var o = e(t.target);
                r(o) && (o = a(o)), o.toggleClass("active"), i(n, o)
            }), i(n, s.filter(".active").first())) : s.each(function () {
                e(this).on("click.collapse", function (t) {
                    var n = e(t.target);
                    r(n) && (n = a(n)), n.toggleClass("active"), o(n)
                }), e(this).hasClass("active") && o(e(this))
            })
        })
    }, e(".collapsible").collapsible()
})(jQuery);

function _classCallCheck(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
}

function _createClass(e, t, n) {
    return t && _defineProperties(e.prototype, t), n && _defineProperties(e, n), e
}

function _defineProperties(e, t) {
    for (var n = 0; n < t.length; n++) {
        var i = t[n];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
    }
}
