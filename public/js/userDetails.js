let userDetails = new FormData();

$(document).ready(() => {
    // select gender
    let selectInputs = $("input#gender");
    selectInputs.focus((e) => {
        $(e.target).siblings("ul.dropdown-content").slideDown();
    });
    selectInputs.blur((e) => {
        $(e.target).siblings("ul.dropdown-content").fadeOut();
    });
    $("ul.dropdown-content li").mousedown((e) => {
        let clicked = $(e.target);
        clicked.parents("ul").siblings("input.select-dropdown").val(clicked.text());
    });

    $("#userDetails #submit").click(() => {
        for (let i of $("#userDetails input:not([type='file'])")) {
            if (isEmpty($(i))) {
                return;
            }
            userDetails.append(`${$(i).attr("id")}`, $(i).val());
        }

        $.ajax({
            type: "POST",
            url: "/user-details",
            data: userDetails,
            processData: false,
            contentType: false
        }).done((res) => {
            if (!res.errMsg) {
                // Saved user details, redirect to user main page
                console.log("Saved user details");
                window.location.href = "/user";
            }
        });
    });
});

function isEmpty(o) {
    if (!o.val()) {
        reportError(o, "Required field");
        return true;
    }
    return false;
}

// Ref: https://shareurcodes.com/blog/create-a-jquery-image-upload-widget-with-preview-and-image-cropping-in-laravel
$(function () {
    let croppie = null;

    $.base64ImageToBlob = function (str) {
        // extract content type and base64 payload from original string
        let pos = str.indexOf(';base64,');
        let type = str.substring(5, pos);
        let b64 = str.substr(pos + 8);

        // decode base64
        let imageContent = atob(b64);

        // create an ArrayBuffer and a view (as unsigned 8-bit)
        let buffer = new ArrayBuffer(imageContent.length);
        let view = new Uint8Array(buffer);

        // fill the view, using the decoded base64
        for (let n = 0; n < imageContent.length; n++) {
            view[n] = imageContent.charCodeAt(n);
        }

        // convert ArrayBuffer to Blob
        return new Blob([buffer], {type: type});
    };

    $.getImage = function (input, croppie) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                croppie.bind({
                    url: e.target.result,
                });
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    $("#file-upload").on("change", function (event) {
        $("#myModal").modal();
        // Initailize croppie instance and assign it to global variable
        croppie = new Croppie($('#resizer')[0], {
            viewport: {
                width: 200,
                height: 200,
                type: 'circle'
            },
            boundary: {
                width: 250,
                height: 250
            },
            enableOrientation: true
        });
        $.getImage(event.target, croppie);
    });

    // To Rotate Image Left or Right
    $(".rotate").on("click", function () {
        croppie.rotate(parseInt($(this).data('deg')));
    });

    $('#myModal').on('hidden.bs.modal', function (e) {
        // This function will call immediately after model close
        // To ensure that old croppie instance is destroyed on every model close
        setTimeout(function () {
            croppie.destroy();
        }, 100);
    });

    $("#upload").on("click", function () {
        croppie.result('base64').then(function (base64) {
            $("#myModal").modal("hide");
            $("#profile-pic").attr("src", base64);

            userDetails.append("profile-picture", $.base64ImageToBlob(base64));
        });
    });
});
