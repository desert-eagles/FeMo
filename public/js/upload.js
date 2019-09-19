
Dropzone.autoDiscover = false;

jQuery.validator.setDefaults({
    errorPlacement: function (error, element) {
        $(element).closest('div.form-group').find('.form-text').html(error.html());
    },
    highlight: function (element) {
        $(element).closest('div.form-group').removeClass('has-success').addClass('has-error');
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).closest('div.form-group').removeClass('has-error').addClass('has-success');
        $(element).closest('div.form-group').find('.form-text').html('');
    }
});

var Uploader = (function (window, document, Uploader) {

    var $form, obj, MSG, $btn, $modal, myDropzone;
    $form = $("#imageUploadForm");
    $btn = $("#uploaderBtn");
    $modal = $("#successModal");
    obj = {};

    MSG = {
        name: "Please enter name",
        email: "Please enter email",
        mobile: "Please enter mobile number"
    };


    function validate() {
        $form.validate({
            submitHandler: function (form) {
                return false;
            },
            rules: {
                name: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                mobile: {
                    required: true,
                    minlength: 7
                },
            },
            messages: {
                name: {
                    required: MSG.name
                },
                email: {
                    required: MSG.email
                },
                mobile: {
                    required: MSG.mobile
                },
            }
        });
    }

    function initializeDropZone() {
        console.log("initializeDropZone");
    
        myDropzone = new Dropzone('div#imageUpload', {
            addRemoveLinks: true,

            url: 'ajax.php',

        });
    }

    function registerEvents(){
        $modal.on('hide.bs.modal', function () {
            $form[0].reset();
            myDropzone.emit("reset");

            $("#imageUpload>.dz-message").show();
        });
    }
    
    obj.init = function() {
        validate();
        initializeDropZone();
        registerEvents();
    };
    Uploader = obj;
    //
    return Uploader;
})(window, document, Uploader);







$(function(){
    Uploader.init();
});

