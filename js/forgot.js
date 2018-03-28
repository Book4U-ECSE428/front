$.getScript('/js/serverIP.js', function () {

    var err_email = new Vue({
        el: "#err_email",
        data: {
            msg: ''
        }
    });

    $("#err_email").hide();

    $("#submit").click(register);

    function register() {
        console.log("forgot password");

        // check if two password are the same
        if ($("input#email1").val() != $("input#email2").val()) {
            err_email.msg = "Email does not match.";
            $("#err_email").show();
        } else {
            $.post(serverIP + '/api/forgot/',
                {
                    'email': $("input#email1").val()
                }, regiserCallBack);
        }

    }

    function regiserCallBack(data) {
        console.log(data);
        if (data.status === "success") {
            window.location = 'index.html';
        } else {
            err_email.msg = "Email does not exists";
            $("#err_email").show();
        }
    }

});