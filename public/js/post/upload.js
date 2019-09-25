/**
 * Frontend functions for creating post and uploading photo(s)
 */


Dropzone.autoDiscover = false;

$(function () {

    // Initialise a dropzone
    let myDropzone = new Dropzone('div#media', {
        url: '/upload',
        maxFiles: 9,
        addRemoveLinks: true,
        acceptedFiles: "image/*",
        autoProcessQueue: false,
        paramName: "pic",
        uploadMultiple: true,
        parallelUploads: 9,

        init: function () {
            // Update selector to match your button
            $("#post #save").click(function () {
                let occurredAt = $("#occurredAt");
                if (occurredAt.val() && isInvalidDate(occurredAt)) {
                    return;
                }

                $(".dropzone .dz-preview .dz-progress").show();

                if (myDropzone.getQueuedFiles().length > 0) {
                    // At least 1 photo to upload
                    myDropzone.processQueue();
                } else if ($("#description").val()) {
                    // No photo, only description, send request to save
                    $.ajax({
                        url: "/upload",
                        method: "POST",
                        data: {
                            "description": $("#description").val(),
                            "occurredAt": occurredAt.val()
                        }
                    }).done(res => {
                        if (!res.errMsg) {
                            // Description successfully saved
                            window.location.href = "/user";
                        }
                    });
                } else {
                    $("#errorModal").modal('show');
                }
                return false;
            });

            // Called when the media is sent one by one
            this.on('sending', function (file, xhr, fd) {
                // Append description and date in FormData
                if (!fd.has("description")) {
                    fd.append("description", $("#description").val());
                }
                if (!fd.has("occurredAt")) {
                    fd.append("occurredAt", $("#occurredAt").val());
                }
            });

            // When a file is added to queue
            this.on('addedfile', function () {
                $(".dropzone .dz-preview .dz-progress").hide();
            });

            // When processQueue() returns successfully
            this.on("success", function (file, res) {
                if (!res.errMsg) {
                    // Photo(s) and description uploaded
                    window.location.href = "/user";
                }
            });
        },
    });
});
