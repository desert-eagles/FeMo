$(() => {
    $.ajax({
        type: "Post",
        url: "get-requests/",
        data: {},
        beforeSend: (() => {
            $("#request").empty().append($(loaderTpl));
        })
    }).done((res) => {
        $(Mustache.render(requestTpl, {
            request: res
        })).appendTo($("#request")).hide()
            .imagesLoaded((imgLoad) => {
                $("#request :visible").remove();
                $(imgLoad.elements).fadeIn();
                $(".mdb-select").materialSelect();
            });
    });
});
