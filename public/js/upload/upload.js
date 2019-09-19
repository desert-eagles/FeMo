Dropzone.autoDiscover = false;

$(function () {

    let myDropzone = new Dropzone('div#imageUpload', {
        url: '/upload',
        maxFilesize: 9,
        addRemoveLinks: true,
        acceptedFiles: "image/*",
        autoProcessQueue: false,
        paramName: "pic",
        uploadMultiple: true,
        parallelUploads: 9,

        init: function () {
            // Update selector to match your button
            $("#uploaderBtn").click(function (e) {
                e.preventDefault();
                $(".dropzone .dz-preview .dz-progress").show();
                // TODO validate text inputs
                myDropzone.processQueue();
                return false;
            });

            this.on('sending', function (file, xhr, formData) {
                // TODO append all form inputs to the formData Dropzone will POST
                formData.append("testname", "test");
            });

            this.on('addedfile', function () {
                $(".dropzone .dz-preview .dz-progress").hide();
            });
        },
    });
});
