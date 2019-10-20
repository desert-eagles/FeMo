$(() => {
    $('.mdb-select').materialSelect();
});

(function (e) {
    e.fn.scrollTo = function (t) {
        return e(this).scrollTop(e(this).scrollTop() - e(this).offset().top + e(t).offset().top), this
    }, e.fn.dropdown = function (t) {
        this.each(function () {
            var n = e(this), i = e.extend({}, e.fn.dropdown.defaults, t), o = !1,
                r = e("#".concat(n.attr("data-activates")));

            function a() {
                void 0 !== n.data("induration") && (i.inDuration = n.data("inDuration")), void 0 !== n.data("outduration") && (i.outDuration = n.data("outDuration")), void 0 !== n.data("constrainwidth") && (i.constrain_width = n.data("constrainwidth")), void 0 !== n.data("hover") && (i.hover = n.data("hover")), void 0 !== n.data("gutter") && (i.gutter = n.data("gutter")), void 0 !== n.data("beloworigin") && (i.belowOrigin = n.data("beloworigin")), void 0 !== n.data("alignment") && (i.alignment = n.data("alignment"))
            }

            function s(t) {
                "focus" === t && (o = !0), a(), r.addClass("active"), n.addClass("active"), !0 === i.constrain_width ? r.css("width", n.outerWidth()) : r.css("white-space", "nowrap");
                var s = window.innerHeight, l = n.innerHeight(), c = n.offset().left,
                    u = n.offset().top - e(window).scrollTop(), d = i.alignment, h = 0, f = 0, p = 0;
                !0 === i.belowOrigin && (p = l);
                var g = 0, m = n.parent();
                if (!m.is("body") && m[0].scrollHeight > m[0].clientHeight && (g = m[0].scrollTop), c + r.innerWidth() > e(window).width() ? d = "right" : c - r.innerWidth() + n.innerWidth() < 0 && (d = "left"), u + r.innerHeight() > s) if (u + l - r.innerHeight() < 0) {
                    var v = s - u - p;
                    r.css("max-height", v)
                } else p || (p += l), p -= r.innerHeight();
                if ("left" === d) h = i.gutter, f = n.position().left + h; else if ("right" === d) {
                    f = n.position().left + n.outerWidth() - r.outerWidth() + (h = -i.gutter)
                }
                r.css({
                    position: "absolute",
                    top: n.position().top + p + g,
                    left: f
                }), r.stop(!0, !0).css("opacity", 0).slideDown({
                    queue: !1,
                    duration: i.inDuration,
                    easing: "easeOutCubic",
                    complete: function () {
                        e(this).css("height", "")
                    }
                }).animate({opacity: 1, scrollTop: 0}, {queue: !1, duration: i.inDuration, easing: "easeOutSine"})
            }

            function l() {
                o = !1, r.fadeOut(i.outDuration), r.removeClass("active"), n.removeClass("active"), setTimeout(function () {
                    r.css("max-height", "")
                }, i.outDuration)
            }

            if (a(), n.after(r), i.hover) {
                var c = !1;
                n.unbind("click.".concat(n.attr("id"))), n.on("mouseenter", function () {
                    !1 === c && (s(), c = !0)
                }), n.on("mouseleave", function (t) {
                    var n = t.toElement || t.relatedTarget;
                    e(n).closest(".dropdown-content").is(r) || (r.stop(!0, !0), l(), c = !1)
                }), r.on("mouseleave", function (t) {
                    var i = t.toElement || t.relatedTarget;
                    e(i).closest(".dropdown-button").is(n) || (r.stop(!0, !0), l(), c = !1)
                })
            } else n.unbind("click.".concat(n.attr("id"))), n.bind("click.".concat(n.attr("id")), function (t) {
                o || (n[0] !== t.currentTarget || n.hasClass("active") || 0 !== e(t.target).closest(".dropdown-content").length ? n.hasClass("active") && (l(), e(document).unbind("click.".concat(r.attr("id"), " touchstart.").concat(r.attr("id")))) : (t.preventDefault(), s("click")), r.hasClass("active") && e(document).bind("click.".concat(r.attr("id"), " touchstart.").concat(r.attr("id")), function (t) {
                    r.is(t.target) || n.is(t.target) || n.find(t.target).length || (l(), e(document).unbind("click.".concat(r.attr("id"), " touchstart.").concat(r.attr("id"))))
                }))
            });
            n.on("open", function (e, t) {
                s(t)
            }), n.on("close", l)
        })
    }, e.fn.dropdown.defaults = {
        inDuration: 300,
        outDuration: 225,
        constrain_width: !0,
        hover: !1,
        gutter: 0,
        belowOrigin: !1,
        alignment: "left"
    }, e(".dropdown-button").dropdown(), e.fn.mdbDropSearch = function (t) {
        var n = e(this).find("input");
        this.filter(function (t, i) {
            e(i).on("keyup", function () {
                for (var e = n.closest("div[id]").find("a, li"), t = 0; t < e.length; t++) e.eq(t).html().toUpperCase().indexOf(n.val().toUpperCase()) > -1 ? e.eq(t).css({display: ""}) : e.eq(t).css({display: "none"})
            })
        });
        var i = e.extend({
            color: "#000",
            backgroundColor: "",
            fontSize: ".9rem",
            fontWeight: "400",
            borderRadius: "",
            borderColor: ""
        }, t);
        return this.css({
            color: i.color,
            backgroundColor: i.backgroundColor,
            fontSize: i.fontSize,
            fontWeight: i.fontWeight,
            borderRadius: i.borderRadius,
            border: i.border,
            margin: i.margin
        })
    }
})(jQuery);

(function (e) {
    var t, n = function () {
        function t(n, i) {
            _classCallCheck(this, t), this.$nativeSelect = n, this.defaults = {
                destroy: !1,
                nativeID: null,
                BSsearchIn: !1,
                BSinputText: !1,
                fasClasses: "",
                farClasses: "",
                fabClasses: "",
                copyClassesOption: !1,
                language: {
                    active: !1,
                    pl: {selectAll: "Wybierz wszystko", optionsSelected: "wybranych opcji"},
                    in: {selectAll: "Pilih semuanya", optionsSelected: "opsi yang dipilih"},
                    fr: {selectAll: "Tout choisir", optionsSelected: "options sélectionnées"},
                    ge: {selectAll: "Wähle alles aus", optionsSelected: "ausgewählte Optionen"},
                    ar: {selectAll: "اختر كل شيء", optionsSelected: "الخيارات المحددة"}
                }
            }, this.options = this.assignOptions(i), this.isMultiple = Boolean(this.$nativeSelect.attr("multiple")), this.isSearchable = Boolean(this.$nativeSelect.attr("searchable")), this.isRequired = Boolean(this.$nativeSelect.attr("required")), this.isEditable = Boolean(this.$nativeSelect.attr("editable")), this.selectAllLabel = Boolean(this.$nativeSelect.attr("selectAllLabel")) ? this.$nativeSelect.attr("selectAllLabel") : "Select all", this.optionsSelectedLabel = Boolean(this.$nativeSelect.attr("optionsSelectedLabel")) ? this.$nativeSelect.attr("optionsSelectedLabel") : "options selected", this.keyboardActiveClass = Boolean(this.$nativeSelect.attr("keyboardActiveClass")) ? this.$nativeSelect.attr("keyboardActiveClass") : "heavy-rain-gradient", this.uuid = null !== this.options.nativeID && "" !== this.options.nativeID && void 0 !== this.options.nativeID && "string" == typeof this.options.nativeID ? this.options.nativeID : this._randomUUID(), this.$selectWrapper = e('<div class="select-wrapper"></div>'), this.$materialOptionsList = e('<ul id="select-options-'.concat(this.uuid, '" class="dropdown-content select-dropdown w-100 ').concat(this.isMultiple ? "multiple-select-dropdown" : "", '"></ul>')), this.$materialSelectInitialOption = n.find("option:selected").text() || n.find("option:first").text() || "", this.$nativeSelectChildren = this.$nativeSelect.children("option, optgroup"), this.$materialSelect = e('<input type="text" class="'.concat(this.options.BSinputText ? "browser-default custom-select multi-bs-select select-dropdown form-control" : "select-dropdown form-control", '" ').concat(!this.options.validate && 'readonly="true"', ' required="').concat(this.options.validate ? "true" : "false", '" ').concat(this.$nativeSelect.is(" :disabled") ? "disabled" : "", ' data-activates="select-options-').concat(this.uuid, '" value=""/>')), this.$dropdownIcon = this.options.BSinputText ? "" : e('<span class="caret">&#9660;</span>'), this.$searchInput = null, this.$toggleAll = e('<li class="select-toggle-all"><span><input type="checkbox" class="form-check-input"><label>'.concat(this.selectAllLabel, "</label></span></li>")), this.$addOptionBtn = e('<i class="select-add-option fas fa-plus"></i>'), this.mainLabel = this.$nativeSelect.next(".mdb-main-label"), this.$validFeedback = e('<div class="valid-feedback">'.concat(this.options.validFeedback || "Good choice", "</div>")), this.$invalidFeedback = e('<div class="invalid-feedback">'.concat(this.options.invalidFeedback || "Bad choice", "</div>")), this.valuesSelected = [], this.keyCodes = {
                tab: 9,
                esc: 27,
                enter: 13,
                arrowUp: 38,
                arrowDown: 40
            }, t.mutationObservers = []
        }

        return _createClass(t, [{
            key: "assignOptions", value: function (t) {
                return e.extend({}, this.defaults, t)
            }
        }, {
            key: "init", value: function () {
                if (Boolean(this.$nativeSelect.data("select-id")) && this._removeMaterialWrapper(), this.options.destroy) {
                    var e = !!this.$nativeSelect.parent().find("button.btn-save").length && this.$nativeSelect.parent().find("button.btn-save");
                    return this.$nativeSelect.data("select-id", null).removeClass("initialized"), void this.$nativeSelect.parent().append(e)
                }
                this.options.BSsearchIn || this.options.BSinputText ? this.$selectWrapper.addClass(this.$nativeSelect.attr("class").split(" ").filter(function (e) {
                    return "md-form" !== e
                }).join(" ")).css({
                    marginTop: "1.5rem",
                    marginBottom: "1.5rem"
                }) : this.$selectWrapper.addClass(this.$nativeSelect.attr("class")), this.$nativeSelect.data("select-id", this.uuid);
                var t = this.$materialSelectInitialOption.replace(/"/g, "&quot;").replace(/  +/g, " ").trim();
                0 === this.mainLabel.length ? this.$materialSelect.val(t) : this.mainLabel.text(), this.renderMaterialSelect(), this.bindEvents(), this.isRequired && this.enableValidation(), this.options.language.active && this.$toggleAll && (this.options.language.pl && this.$toggleAll.find("label").text(this.options.language.pl.selectAll ? this.options.language.pl.selectAll : this.defaults.language.pl.selectAll), this.options.language.fr && this.$toggleAll.find("label").text(this.options.language.fr.selectAll ? this.options.language.fr.selectAll : this.defaults.language.fr.selectAll), this.options.language.ge && this.$toggleAll.find("label").text(this.options.language.ge.selectAll ? this.options.language.ge.selectAll : this.defaults.language.ge.selectAll), this.options.language.ar && this.$toggleAll.find("label").text(this.options.language.ar.selectAll ? this.options.language.ar.selectAll : this.defaults.language.ar.selectAll), this.options.language.in && this.$toggleAll.find("label").text(this.options.language.in.selectAll ? this.options.language.in.selectAll : this.defaults.language.in.selectAll)), this.$materialSelect.hasClass("custom-select") && this.$materialSelect.hasClass("select-dropdown") && this.$materialSelect.css({
                    display: "inline-block",
                    width: "100%",
                    height: "calc(1.5em + .75rem + 2px)",
                    padding: ".375rem 1.75rem .375rem .75rem",
                    fontSize: "1rem",
                    lineHeight: "1.5",
                    backgroundColor: "#fff",
                    border: "1px solid #ced4da"
                })
            }
        }, {
            key: "_removeMaterialWrapper", value: function () {
                var t = this.$nativeSelect.data("select-id");
                this.$nativeSelect.parent().find("span.caret").remove(), this.$nativeSelect.parent().find("input").remove(), this.$nativeSelect.unwrap(), e("ul#select-options-".concat(t)).remove()
            }
        }, {
            key: "renderMaterialSelect", value: function () {
                var e = this;
                if (this.$nativeSelect.before(this.$selectWrapper), this.appendDropdownIcon(), this.appendValidation(), this.appendMaterialSelect(), this.appendMaterialOptionsList(), this.appendNativeSelect(), this.appendSaveSelectButton(), this.$nativeSelect.is(":disabled") || this.$materialSelect.dropdown({
                    hover: !1,
                    closeOnClick: !1
                }), !1 !== this.$nativeSelect.data("inherit-tabindex") && this.$materialSelect.attr("tabindex", this.$nativeSelect.attr("tabindex")), this.isMultiple) this.$nativeSelect.find("option:selected:not(:disabled)").each(function (t, n) {
                    var i = n.index;
                    e._toggleSelectedValue(i), e.$materialOptionsList.find("li:not(.optgroup):not(.select-toggle-all)").eq(i).find(":checkbox").prop("checked", !0)
                }); else {
                    var t = this.$nativeSelect.find("option[selected]").first(),
                        n = this.$nativeSelect.find("option").index(t.get(0));
                    "disabled" !== t.attr("disabled") && n >= 0 && this._toggleSelectedValue(n)
                }
                this.$nativeSelect.addClass("initialized"), this.options.BSinputText && this.mainLabel.css("top", "-7px")
            }
        }, {
            key: "appendDropdownIcon", value: function () {
                this.$nativeSelect.is(":disabled") && this.$dropdownIcon.addClass("disabled"), this.$selectWrapper.append(this.$dropdownIcon)
            }
        }, {
            key: "appendValidation", value: function () {
                this.options.validate && (this.$validFeedback.insertAfter(this.$selectWrapper), this.$invalidFeedback.insertAfter(this.$selectWrapper))
            }
        }, {
            key: "appendMaterialSelect", value: function () {
                this.$selectWrapper.append(this.$materialSelect)
            }
        }, {
            key: "appendMaterialOptionsList", value: function () {
                this.isSearchable && this.appendSearchInputOption(), this.isEditable && this.isSearchable && this.appendAddOptionBtn(), this.buildMaterialOptions(), this.isMultiple && this.appendToggleAllCheckbox(), this.$selectWrapper.append(this.$materialOptionsList)
            }
        }, {
            key: "appendNativeSelect", value: function () {
                this.$nativeSelect.appendTo(this.$selectWrapper)
            }
        }, {
            key: "appendSearchInputOption", value: function () {
                var t = this.$nativeSelect.attr("searchable");
                this.options.BSsearchIn ? this.$searchInput = e('<span class="search-wrap ml-2"><div class="mt-0"><input type="text" class="search mb-2 w-100 d-block select-default" tabindex="-1" placeholder="'.concat(t, '"></div></span>')) : this.$searchInput = e('<span class="search-wrap ml-2"><div class="md-form mt-0"><input type="text" class="search w-100 d-block" tabindex="-1" placeholder="'.concat(t, '"></div></span>')), this.$materialOptionsList.append(this.$searchInput), this.$searchInput.on("click", function (e) {
                    e.stopPropagation()
                })
            }
        }, {
            key: "appendAddOptionBtn", value: function () {
                this.$searchInput.append(this.$addOptionBtn), this.$addOptionBtn.on("click", this.addNewOption.bind(this))
            }
        }, {
            key: "addNewOption", value: function () {
                var t = this.$searchInput.find("input").val(),
                    n = e('<option value="'.concat(t.toLowerCase(), '" selected>').concat(t, "</option>")).prop("selected", !0);
                this.isMultple || this.$nativeSelectChildren.each(function (t, n) {
                    e(n).attr("selected", !1)
                }), this.$nativeSelect.append(n)
            }
        }, {
            key: "appendToggleAllCheckbox", value: function () {
                var e = this.$materialOptionsList.find("li").first();
                e.hasClass("disabled") && e.find("input").prop("disabled") ? e.after(this.$toggleAll) : this.$materialOptionsList.find("li").first().before(this.$toggleAll)
            }
        }, {
            key: "appendSaveSelectButton", value: function () {
                this.$selectWrapper.parent().find("button.btn-save").appendTo(this.$materialOptionsList)
            }
        }, {
            key: "buildMaterialOptions", value: function () {
                var t = this;
                this.$nativeSelectChildren.each(function (n, i) {
                    var o = e(i);
                    if (o.is("option")) t.buildSingleOption(o, t.isMultiple ? "multiple" : ""); else if (o.is("optgroup")) {
                        var r = e('<li class="optgroup"><span>'.concat(o.attr("label"), "</span></li>"));
                        t.$materialOptionsList.append(r), o.children("option").each(function (n, i) {
                            t.buildSingleOption(e(i), "optgroup-option")
                        })
                    }
                })
            }
        }, {
            key: "buildSingleOption", value: function (t, n) {
                var i = t.is(":disabled") ? "disabled" : "", o = "optgroup-option" === n ? "optgroup-option" : "",
                    r = t.data("icon"),
                    a = t.data("fas") ? '<i class="fa-pull-right m-2 fas fa-'.concat(t.data("fas"), " ").concat([...this.options.fasClasses].join(""), '"></i> ') : "",
                    s = t.data("far") ? '<i class="fa-pull-right m-2 far fa-'.concat(t.data("far"), " ").concat([...this.options.farClasses].join(""), '"></i> ') : "",
                    l = t.data("fab") ? '<i class="fa-pull-right m-2 fab fa-'.concat(t.data("fab"), " ").concat([...this.options.fabClasses].join(""), '"></i> ') : "",
                    c = t.attr("class"), u = r ? '<img alt="" src="'.concat(r, '" class="').concat(c, '">') : "",
                    d = this.isMultiple ? '<input type="checkbox" class="form-check-input" '.concat(i, "/><label></label>") : "";
                this.$materialOptionsList.append(e('<li class="'.concat(i, " ").concat(o, " ").concat(this.options.copyClassesOption ? c : "", ' ">').concat(u, '<span class="filtrable">').concat(d, " ").concat(t.html(), " ").concat(a, " ").concat(s, " ").concat(l, "</span></li>")))
            }
        }, {
            key: "enableValidation", value: function () {
                this.$nativeSelect.css({
                    position: "absolute",
                    top: "1rem",
                    left: "0",
                    height: "0",
                    width: "0",
                    opacity: "0",
                    padding: "0",
                    "pointer-events": "none"
                }), -1 === this.$nativeSelect.attr("style").indexOf("inline!important") && this.$nativeSelect.attr("style", "".concat(this.$nativeSelect.attr("style"), " display: inline!important;")), this.$nativeSelect.attr("tabindex", -1), this.$nativeSelect.data("inherit-tabindex", !1)
            }
        }, {
            key: "bindEvents", value: function () {
                var n = this, i = new MutationObserver(this._onMutationObserverChange.bind(this));
                i.observe(this.$nativeSelect.get(0), {
                    attributes: !0,
                    childList: !0,
                    characterData: !0,
                    subtree: !0
                }), i.customId = this.uuid, i.customStatus = "observing", t.clearMutationObservers(), t.mutationObservers.push(i), this.$nativeSelect.parent().find("button.btn-save").on("click", this._onSaveSelectBtnClick.bind(this)), this.$materialSelect.on("focus", this._onMaterialSelectFocus.bind(this)), this.$materialSelect.on("click", this._onMaterialSelectClick.bind(this)), this.$materialSelect.on("blur", this._onMaterialSelectBlur.bind(this)), this.$materialSelect.on("keydown", this._onMaterialSelectKeydown.bind(this)), this.$toggleAll.on("click", this._onToggleAllClick.bind(this)), this.$materialOptionsList.on("mousedown", this._onEachMaterialOptionMousedown.bind(this)), this.$materialOptionsList.find("li:not(.optgroup)").not(this.$toggleAll).each(function (t, i) {
                    e(i).on("click", n._onEachMaterialOptionClick.bind(n, t, i))
                }), !this.isMultiple && this.isSearchable && this.$materialOptionsList.find("li").on("click", this._onSingleMaterialOptionClick.bind(this)), this.isSearchable && this.$searchInput.find(".search").on("keyup", this._onSearchInputKeyup.bind(this)), e("html").on("click", this._onHTMLClick.bind(this))
            }
        }, {
            key: "_onMutationObserverChange", value: function (n) {
                n.forEach(function (n) {
                    var i = e(n.target).closest("select");
                    !0 !== i.data("stop-refresh") && ("childList" === n.type || "attributes" === n.type && e(n.target).is("option")) && (t.clearMutationObservers(), i.materialSelect({destroy: !0}), i.materialSelect())
                })
            }
        }, {
            key: "_onSaveSelectBtnClick", value: function () {
                e("input.multi-bs-select").trigger("close"), this.$materialOptionsList.hide(), this.$materialSelect.removeClass("active")
            }
        }, {
            key: "_onEachMaterialOptionClick", value: function (t, n, i) {
                i.stopPropagation();
                var o = e(n);
                if (!o.hasClass("disabled") && !o.hasClass("optgroup")) {
                    var r = !0;
                    if (this.isMultiple) {
                        o.find('input[type="checkbox"]').prop("checked", function (e, t) {
                            return !t
                        });
                        var a = Boolean(this.$nativeSelect.find("optgroup").length),
                            s = this._isToggleAllPresent() ? o.index() - 1 : o.index();
                        r = this.isSearchable && a ? this._toggleSelectedValue(s - o.prevAll(".optgroup").length - 1) : this.isSearchable ? this._toggleSelectedValue(s - 1) : a ? this._toggleSelectedValue(s - o.prevAll(".optgroup").length) : this._toggleSelectedValue(s), this._isToggleAllPresent() && this._updateToggleAllOption(), this.$materialSelect.trigger("focus")
                    } else this.$materialOptionsList.find("li").removeClass("active"), o.toggleClass("active"), this.$materialSelect.val(o.text().replace(/  +/g, " ").trim()), this.$materialSelect.trigger("close");
                    this._selectSingleOption(o), this.$nativeSelect.data("stop-refresh", !0), this.$nativeSelect.find("option").eq(t).prop("selected", r), this.$nativeSelect.removeData("stop-refresh"), this._triggerChangeOnNativeSelect(), this.mainLabel.prev().find("input").hasClass("select-dropdown") && this.mainLabel.prev().find("input.select-dropdown").val().length > 0 && this.mainLabel.addClass("active"), "function" == typeof this.options && this.options(), o.hasClass("li-added") && this.$materialOptionsList.append(this.buildSingleOption(o, ""))
                }
            }
        }, {
            key: "_escapeKeyboardActiveOptions", value: function () {
                var t = this;
                this.$materialOptionsList.find("li").each(function (n, i) {
                    e(i).removeClass(t.keyboardActiveClass)
                })
            }
        }, {
            key: "_triggerChangeOnNativeSelect", value: function () {
                var e = new KeyboardEvent("change", {bubbles: !0, cancelable: !0});
                this.$nativeSelect.get(0).dispatchEvent(e)
            }
        }, {
            key: "_onMaterialSelectFocus", value: function (t) {
                var n = e(t.target);
                if (e("ul.select-dropdown").not(this.$materialOptionsList.get(0)).is(":visible") && e("input.select-dropdown").trigger("close"), this.mainLabel.addClass("active"), !this.$materialOptionsList.is(":visible")) {
                    n.trigger("open", ["focus"]);
                    var i = n.val(), o = this.$materialOptionsList.find("li").filter(function () {
                        return e(this).text().toLowerCase() === i.toLowerCase()
                    })[0];
                    this._selectSingleOption(o)
                }
                this.isMultiple || this.mainLabel.addClass("active"), e(document).find("input.select-dropdown").each(function (t, n) {
                    return e(n).val().length <= 0
                }).parent().next(".mdb-main-label").filter(function (t, n) {
                    return e(n).prev().find("input.select-dropdown").val().length <= 0 && !e(n).prev().find("input.select-dropdown").hasClass("active")
                }).removeClass("active")
            }
        }, {
            key: "_onMaterialSelectClick", value: function (e) {
                this.mainLabel.addClass("active"), e.stopPropagation()
            }
        }, {
            key: "_onMaterialSelectBlur", value: function (t) {
                var n = e(t);
                this.isMultiple || this.isSearchable || n.trigger("close"), this.$materialOptionsList.find("li.selected").removeClass("selected")
            }
        }, {
            key: "_onSingleMaterialOptionClick", value: function () {
                this.$materialSelect.trigger("close")
            }
        }, {
            key: "_onEachMaterialOptionMousedown", value: function (t) {
                var n = t.target;
                e(".modal-content").find(this.$materialOptionsList).length && n.scrollHeight > n.offsetHeight && t.preventDefault()
            }
        }, {
            key: "_onHTMLClick", value: function (t) {
                e(t.target).closest("#select-options-".concat(this.uuid)).length || e(t.target).hasClass("mdb-select") || !e("#select-options-".concat(this.uuid)).hasClass("active") || (this.$materialSelect.trigger("close"), !this.$materialSelect.val().length > 0 && this.mainLabel.removeClass("active")), this.isSearchable && null !== this.$searchInput && this.$materialOptionsList.hasClass("active") && this.$materialOptionsList.find(".search-wrap input.search").focus()
            }
        }, {
            key: "_onToggleAllClick", value: function (t) {
                var n = this, i = e(this.$toggleAll).find('input[type="checkbox"]').first(), o = !e(i).prop("checked");
                e(i).prop("checked", o), this.$materialOptionsList.find("li:not(.optgroup):not(.select-toggle-all)").each(function (t, i) {
                    var r = e(i).find('input[type="checkbox"]');
                    o && r.is(":checked") || !o && !r.is(":checked") || e(i).is(":hidden") || e(i).is(".disabled") || (r.prop("checked", o), n.$nativeSelect.find("option").eq(t).prop("selected", o), o ? e(i).removeClass("active") : e(i).addClass("active"), n._toggleSelectedValue(t), n._selectOption(i), n._setValueToMaterialSelect())
                }), this.$nativeSelect.data("stop-refresh", !0), this._triggerChangeOnNativeSelect(), this.$nativeSelect.removeData("stop-refresh"), t.stopPropagation()
            }
        }, {
            key: "_onMaterialSelectKeydown", value: function (t) {
                var n = e(t.target), i = t.which === this.keyCodes.tab, o = t.which === this.keyCodes.esc,
                    r = t.which === this.keyCodes.enter, a = r && t.shiftKey, s = t.which === this.keyCodes.arrowUp,
                    l = t.which === this.keyCodes.arrowDown, c = this.$materialOptionsList.is(":visible");
                i ? this._handleTabKey(n) : !l || c ? r && !c || (t.preventDefault(), a ? this._handleEnterWithShiftKey(n) : r ? this._handleEnterKey(n) : l ? this._handleArrowDownKey() : s ? this._handleArrowUpKey() : o ? this._handleEscKey(n) : this._handleLetterKey(t)) : n.trigger("open")
            }
        }, {
            key: "_handleTabKey", value: function (e) {
                this._handleEscKey(e)
            }
        }, {
            key: "_handleEnterWithShiftKey", value: function (e) {
                this.isMultiple ? this.$toggleAll.trigger("click") : this._handleEnterKey(e)
            }
        }, {
            key: "_handleEnterKey", value: function (t) {
                this.$materialOptionsList.find("li.selected:not(.disabled)").trigger("click").addClass("active"), this.isMultiple || e(t).trigger("close")
            }
        }, {
            key: "_handleArrowDownKey", value: function () {
                var t = this, n = this.$materialOptionsList.find("li:visible").not(".disabled, .select-toggle-all"),
                    i = this.$materialOptionsList.find("li:visible").not(".disabled, .select-toggle-all").first(),
                    o = this.$materialOptionsList.find("li:visible").not(".disabled, .select-toggle-all").last(),
                    r = this.$materialOptionsList.find("li.selected").length > 0,
                    a = r ? this.$materialOptionsList.find("li.selected").first() : i,
                    s = a.next("li:visible:not(.disabled, .select-toggle-all)"), l = s;
                n.each(function (i, o) {
                    e(o).hasClass(t.keyboardActiveClass) && (s = n.eq(i + 1), l = n.eq(i))
                });
                var c = a.is(o) || !r ? a : s;
                this._selectSingleOption(c), this._escapeKeyboardActiveOptions(), c.find("input").is(":checked") || c.removeClass(this.keyboardActiveClass), l.hasClass("selected") || l.find("input").is(":checked") || !this.isMultiple || l.removeClass("active", this.keyboardActiveClass), c.addClass(this.keyboardActiveClass), c.position() && this.$materialOptionsList.scrollTop(this.$materialOptionsList.scrollTop() + c.position().top)
            }
        }, {
            key: "_handleArrowUpKey", value: function () {
                var t = this, n = this.$materialOptionsList.find("li:visible").not(".disabled, .select-toggle-all"),
                    i = this.$materialOptionsList.find("li:visible").not(".disabled, .select-toggle-all").first(),
                    o = this.$materialOptionsList.find("li:visible").not(".disabled, .select-toggle-all").last(),
                    r = this.$materialOptionsList.find("li.selected").length > 0,
                    a = r ? this.$materialOptionsList.find("li.selected").first() : o,
                    s = a.prev("li:visible:not(.disabled, .select-toggle-all)"), l = s;
                n.each(function (i, o) {
                    e(o).hasClass(t.keyboardActiveClass) && (s = n.eq(i - 1), l = n.eq(i))
                });
                var c = a.is(i) || !r ? a : s;
                this._selectSingleOption(c), this._escapeKeyboardActiveOptions(), c.find("input").is(":checked") || c.removeClass(this.keyboardActiveClass), l.hasClass("selected") || l.find("input").is(":checked") || !this.isMultiple || l.removeClass("active", this.keyboardActiveClass), c.addClass(this.keyboardActiveClass), c.position() && this.$materialOptionsList.scrollTop(this.$materialOptionsList.scrollTop() + c.position().top)
            }
        }, {
            key: "_handleEscKey", value: function (t) {
                this._escapeKeyboardActiveOptions(), e(t).trigger("close")
            }
        }, {
            key: "_handleLetterKey", value: function (t) {
                var n = this;
                if (this._escapeKeyboardActiveOptions(), this.isSearchable) {
                    var i = t.which > 46 && t.which < 91, o = t.which > 93 && t.which < 106, r = 8 === t.which;
                    (i || o) && this.$searchInput.find("input").val(t.key).focus(), r && this.$searchInput.find("input").val("").focus()
                } else {
                    var a = "", s = String.fromCharCode(t.which).toLowerCase(),
                        l = Object.keys(this.keyCodes).map(function (e) {
                            return n.keyCodes[e]
                        });
                    if (s && -1 === l.indexOf(t.which)) {
                        a += s;
                        var c = this.$materialOptionsList.find("li").filter(function (t, n) {
                            return e(n).text().toLowerCase().includes(a)
                        }).first();
                        this.isMultiple || this.$materialOptionsList.find("li").removeClass("active"), c.addClass("active"), this._selectSingleOption(c)
                    }
                }
            }
        }, {
            key: "_onSearchInputKeyup", value: function (t) {
                var n = e(t.target), i = t.which === this.keyCodes.tab, o = t.which === this.keyCodes.esc,
                    r = t.which === this.keyCodes.enter, a = r && t.shiftKey, s = t.which === this.keyCodes.arrowUp;
                if (t.which === this.keyCodes.arrowDown || i || o || s) return this.$materialSelect.focus(), void this._handleArrowDownKey();
                var l = n.closest("ul"), c = n.val(), u = l.find("li span.filtrable"), d = !1;
                if (u.each(function () {
                    var t = e(this);
                    if ("string" == typeof this.outerHTML) {
                        var n = this.textContent.toLowerCase();
                        n.includes(c.toLowerCase()) ? t.show().parent().show() : t.hide().parent().hide(), n.trim() === c.toLowerCase() && (d = !0)
                    }
                }), r) return this.isEditable && !d ? void this.addNewOption() : (a && this._handleEnterWithShiftKey(n), void this.$materialSelect.trigger("open"));
                c && this.isEditable && !d ? this.$addOptionBtn.show() : this.$addOptionBtn.hide(), this._updateToggleAllOption()
            }
        }, {
            key: "_isToggleAllPresent", value: function () {
                return this.$materialOptionsList.find(this.$toggleAll).length
            }
        }, {
            key: "_updateToggleAllOption", value: function () {
                var e = this.$materialOptionsList.find("li").not(".select-toggle-all, .disabled, :hidden").find("[type=checkbox]"),
                    t = e.filter(":checked"), n = this.$toggleAll.find("[type=checkbox]").is(":checked");
                t.length !== e.length || n ? t.length < e.length && n && this.$toggleAll.find("[type=checkbox]").prop("checked", !1) : this.$toggleAll.find("[type=checkbox]").prop("checked", !0)
            }
        }, {
            key: "_toggleSelectedValue", value: function (e) {
                var t = this.valuesSelected.indexOf(e), n = -1 !== t;
                return n ? this.valuesSelected.splice(t, 1) : this.valuesSelected.push(e), this.$materialOptionsList.find("li:not(.optgroup):not(.select-toggle-all)").eq(e).toggleClass("active"), this.$nativeSelect.find("option").eq(e).prop("selected", !n), this._setValueToMaterialSelect(), !n
            }
        }, {
            key: "_selectSingleOption", value: function (e) {
                this.$materialOptionsList.find("li.selected").removeClass("selected"), this._selectOption(e)
            }
        }, {
            key: "_selectOption", value: function (t) {
                e(t).addClass("selected")
            }
        }, {
            key: "_setValueToMaterialSelect", value: function () {
                var e = this, t = "", n = this.optionsSelectedLabel, i = this.valuesSelected.length;
                this.options.language.active && this.$toggleAll && (this.options.language.pl ? n = this.options.language.pl.optionsSelected ? this.options.language.pl.optionsSelected : this.defaults.language.pl.optionsSelected : this.options.language.fr ? n = this.options.language.fr.optionsSelected ? this.options.language.fr.optionsSelected : this.defaults.language.fr.optionsSelected : this.options.language.ge ? n = this.options.language.ge.optionsSelected ? this.options.language.ge.optionsSelected : this.defaults.language.ge.optionsSelected : this.options.language.ar ? n = this.options.language.ar.optionsSelected ? this.options.language.ar.optionsSelected : this.defaults.language.ar.optionsSelected : this.options.language.in && (n = this.options.language.in.optionsSelected ? this.options.language.in.optionsSelected : this.defaults.language.in.optionsSelected)), this.valuesSelected.map(function (n) {
                    return t += ", ".concat(e.$nativeSelect.find("option").eq(n).text().replace(/  +/g, " ").trim())
                }), 0 === (t = i >= 5 ? "".concat(i, " ").concat(n) : t.substring(2)).length && 0 === this.mainLabel.length && (t = this.$nativeSelect.find("option:disabled").eq(0).text()), t.length > 0 && !this.options.BSinputText ? this.mainLabel.addClass("active ") : this.mainLabel.removeClass("active"), this.options.BSinputText && this.mainLabel.css("top", "-7px"), this.$nativeSelect.siblings("".concat(this.options.BSinputText ? "input.multi-bs-select" : "input.select-dropdown")).val(t)
            }
        }, {
            key: "_randomUUID", value: function () {
                var e = (new Date).getTime();
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
                    var n = (e + 16 * Math.random()) % 16 | 0;
                    return e = Math.floor(e / 16), ("x" === t ? n : 3 & n | 8).toString(16)
                })
            }
        }], [{
            key: "clearMutationObservers", value: function () {
                t.mutationObservers.forEach(function (e) {
                    e.disconnect(), e.customStatus = "stopped"
                })
            }
        }]), t
    }();
    e.fn.materialSelect = function (t) {
        e(this).not(".browser-default").not(".custom-select").each(function () {
            new n(e(this), t).init()
        })
    }, e.fn.material_select = e.fn.materialSelect, t = e.fn.val, e.fn.val = function (e) {
        if (!arguments.length) return t.call(this);
        if (!0 !== this.data("stop-refresh") && this.hasClass("mdb-select") && this.hasClass("initialized")) {
            n.clearMutationObservers(), this.materialSelect({destroy: !0});
            var i = t.call(this, e);
            return this.materialSelect(), i
        }
        return t.call(this, e)
    }
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
