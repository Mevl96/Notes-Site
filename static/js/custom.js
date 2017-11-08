$(function() {

    $("#js-register-form").validate({

        rules: {
            form_name: {
                required: true,
                minlength: 4,
                maxlength: 16
            },
            form_email: {
                required: true,
                email: true
            },
            form_pswd1: {
                required: true,
                minlength: 6,
                maxlength: 18
            },
            form_pswd2: {
                required: true,
                minlength: 6,
                maxlength: 18,
                equalTo: "#form_pswd1"
            }
        },
        messages: {
            form_name: {
                required: "Поле User Name обязательное для заполнения",
                minlength: "Логин должен быть минимум 4 символа",
                maxlength: "Максимальное число символо - 16",
            },
            form_email: {
                required: "Поле E-mail обязательное для заполнения",
                email: "Введите пожалуйста корректный e-mail"
            },
            form_pswd1: {
                required: "Поле Password обязательно для заполнения",
                minlength: "Пароль должен быть минимум 6 символа",
                maxlength: "Пароль должен быть максимум 16 символов",
            },
			form_pswd2: {
                required: "Поле Confirm Password обязательно для заполнения",
                minlength: "Пароль должен быть минимум 6 символа",
                maxlength: "Пароль должен быть максимум 16 символов",
            },
        },
    });

});
