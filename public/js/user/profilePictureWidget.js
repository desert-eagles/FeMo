/**
 * Ref: https://shareurcodes.com/blog/create-a-jquery-image-upload-widget-with-preview-and-image-cropping-in-laravel
 */
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
        $("#profilePictureWidget").modal();
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

    $('#profilePictureWidget').on('hidden.bs.modal', function () {
        // This function will call immediately after model close
        // To ensure that old croppie instance is destroyed on every model close
        setTimeout(function () {
            croppie.destroy();
        }, 100);
    });

    $("#upload").on("click", function () {
        croppie.result('base64').then(function (base64) {
            $("#profilePictureWidget").modal("hide");
            profilePictureWidgetCallback(base64);
        });
    });
});

// Helper function to get DataUrl from url
function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}