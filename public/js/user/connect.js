/****************************** Display all connections *********************/
$(() => {
    $.ajax({
        type: "Post",
        url: "/get-connections",
        beforeSend: (() => {
            $("#connections").empty().append($(loaderTpl));
        })
    }).done(res => {
        $("#connections").empty().append(Mustache.render(connectionTpl, {
            connections: res
        }));
    });
});

/****************************** Add new connection **************************/

$(() => {
    $("#search input").keyup((e) => {
        if (e.key === "Enter" && $(e.target).val()) {
            search();
        }
    });
    $("#search a").click(() => {
        search();
    });
});

function search() {
    let string = $("#search input").val();
    $.ajax({
        type: "Post",
        url: "search-users/",
        data: {
            string: string,
        },
        beforeSend: (() => {
            $("#results").empty().append($(loaderTpl));
        })
    }).done((res) => {
        $(Mustache.render(userTpl, {
            users: res
        })).appendTo($("#results")).hide().imagesLoaded((imgLoad) => {
            $("#results :visible").remove();
            $(imgLoad.elements).fadeIn();
            $(".mdb-select").materialSelect();
        });
    });
}
