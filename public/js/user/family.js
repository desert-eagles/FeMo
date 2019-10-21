$(() => {
    $.ajax({
        type: "Post",
        url: "/get-family",
        beforeSend: (() => {
            $("[data-family-id]").empty().append($(loaderTpl));
        }),
        data: {
            family_id: $("[data-family-id]").attr("data-family-id")
        }
    }).done(res => {
        $("[data-family-id]").empty().hide()
            .append(Mustache.render(familyDetailTpl, res.details))
            .append(res.connections.length ? Mustache.render(connectionTpl, {connections: res.connections}) : "")
            .append(res.users.length ? Mustache.render(userTpl, {users: res.users}) : "")
            .imagesLoaded(imgLoad => {
                $(imgLoad.elements).fadeIn();

                // select members section
                $.ajax({
                    type: "Post",
                    url: "/get-connections",
                    beforeSend: (() => {
                        $("#selectMembers").html("Loading invitation module...");
                    })
                }).done(res => {
                    let selectMembers = $("#selectMembers").empty();
                    selectMembers.hide()
                        .append(Mustache.render(selectMembersTpl, {
                            connections: res
                        }))
                        .append("<button class='btn btn-sm btn-primary my-auto ml-md-3 mx-0' onclick='invite()'>Invite</button>");
                    $(".mdb-select").materialSelect();
                    selectMembers.fadeIn();
                });
            });
    });
});

function invite() {
    $.ajax({
        type: "Post",
        url: "/invite-to-family",
        data: {
            family_id: $("[data-family-id]").first().attr("data-family-id"),
            invite_ids: JSON.stringify($("#selectMembers select").val())
        }
    });
}

const familyDetailTpl =
    "<div class='row'>" +
    "<div class='col-lg-4 d-flex justify-content-center align-items-start mb-5'>" +
    "<img src='{{family_pic_url}}' class='rounded-circle' style='max-width: 250px;' alt=''>" +
    "</div>" +
    "<div class='col-lg-8 pt-0'>" +
    "<h3 class='mb-3 font-weight-bold text-uppercase'><strong>{{family_name}}</strong></h3>" +
    "<small class='text-muted'>Created by <b>{{family_creator}}</b> on {{family_createdOn}}</small>" +
    "<p class='mt-4 text-muted'>{{family_description}}</p>" +
    "<hr>" +
    "<div id='selectMembers' class='d-flex flex-md-row flex-column'></div>" +
    "</div>" +
    "</div>" +
    "<hr class='my-5'>" +
    "<h3 class='d-flex justify-content-center'>Members</h3>";
