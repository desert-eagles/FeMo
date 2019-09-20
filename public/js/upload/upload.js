Dropzone.autoDiscover = false;

$(function () {

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
            $("#post #save").click(function (e) {
                e.preventDefault();
                $(".dropzone .dz-preview .dz-progress").show();

                if (myDropzone.getQueuedFiles().length > 0) {
                    myDropzone.processQueue();
                } else if ($("#description").val()) {
                    $.ajax({
                        url: "/upload",
                        method: "POST",
                        data: {
                            "description": $("#description").val(),
                            "occurredAt": $("#occurredAt").val()
                        }
                    });
                } else {
                    $("#errorModal").modal('show');
                }
                return false;
            });

            this.on('sending', function (file, xhr, fd) {
                fd.append("description", $("#description").val());
                fd.append("occurredAt", $("#occurredAt").val());
            });

            this.on('addedfile', function () {
                $(".dropzone .dz-preview .dz-progress").hide();
            });
        },
    });
});
