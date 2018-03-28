$.getScript('/js/serverIP.js', function()
{
    //vue.js
    var err_name= new Vue({
        el: "#signup_err_name",
        data: {
            msg: ''
        }
    })
    var err_email= new Vue({
        el: "#signup_err_email",
        data: {
            msg: ''
        }
    })
    var err_psw= new Vue({
        el: "#signup_err_psw",
        data: {
            msg: ''
        }
    })
    var err_psw2= new Vue({
        el: "#signup_err_psw2",
        data: {
            msg: ''
        }
    })

    $("#signup_err_name").hide();
    $("#signup_err_email").hide();
    $("#signup_err_psw").hide();
    $("#signup_err_psw2").hide();

    $('#password').on('keyup', function () {
        var password = $(this).val();
        var count = $(this).val().length;
        if (count == 0) {
            $('.bar').css('width', '0%');
        }
        else {
            if (count < 8) {
                $('.bar').css('width', '33%');
            }
            if (count >= 8 && ((password != password.toLowerCase()) || password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/))) {
                $('.bar').css('width', '66%');
            }
            if (count >= 8 && (password != password.toLowerCase()) && password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) {
                $('.bar').css('width', '100%');
            }
        }
    });
    $("#register").click(register);

    function register() {
        console.log("register");

        // check if two password are the same
        if ($("input#password").val() != $("input#password-confirm").val()) {
            err_psw2.msg = "Password does not match.";
            $("#signup_err_psw2").show();
        }
        else if($("input#name").val().length ==0){
            err_name.msg = "Name should not be empty.";
            $("#signup_err_name").show();
        }
        else if($("input#email").val().length == 0){
            err_email.msg = "Email should not be empty.";
            $("#signup_err_email").show();
        }
        else if($("input#password").val().length < 8){
            err_psw.msg = "Password too short.";
            $("#signup_err_psw").show();
        } else {
            $.post(serverIP+'/api/createAccount/',
                {
                    'e_mail': $("input#email").val(),
                    'password': $("input#password").val(),
                    'name': $("input#name").val(),
                    'personal_intro': $("textarea#intro").val(),
                    'gender': $("select#position").val()
                }, regiserCallBack);
        }


    }

    function regiserCallBack(data) {
        console.log(data);
        if (data.status === "success") {
            window.location = 'index.html';
        } else {
            if(data.reason == "pwd_filter_failure"){
                err_psw.msg = "The password should at least have 1 capital letter and numbers.";
                $("#signup_err_psw").show();
            }
            if(data.reason == "existing_email"){
                err_email.msg = "Email already been registered by another user.";
                $("#signup_err_email").show();
            }
            if (data.reason == "existing_username") {
                err_name.msg = "This user name has already been used by another user.";
                $("#signup_err_name").show();
            }
            $("input#password").val('');
            $("input#password-confirm").val('');
            $("select#intro").val('');
            $("textarea#position").val('');
        }
    }

});