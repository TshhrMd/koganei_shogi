$(function() {
    $('#contact').validate({
        rules : {
            1: {
                required: true
            },
            7: {
                required: true,
                email: true
            },
            9: {
                required: true
            }
        },
        messages : {
            1: {
               required: "お名前をご入力ください。"
            },
            7: {
               required: "Emailアドレスをご入力ください。",
               email: "Emailアドレスの形式でご入力ください。(例: abc@def.xyz)"
            },
            9: {
               required: "質問内容をご自由にご記入ください。"
            }
        },
        submitHandler: function(form) {
            $('#modal-content-01').modal('show');
            form.submit();
        }
    }
    );
});

function close(modal){
    if (window!=parent){
        window.parent.jQuery(modal).modal('hide');
    }
};
