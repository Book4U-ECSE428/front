$.getScript('/js/serverIP.js', function()
{
    $("button.signin").click(login);

    function login() {
        if($("input#email").val().length == 0 || $("input#password").val().length == 0)
        {
            alert("Missing Field");
        }
        else
        {
            console.log("login");
            $.post(serverIP+'/api/login/',
                {
                    'e_mail': $("#email").val(),
                    'password': $("#password").val()
                }
                , loginCallBack);
        }

    }

    function loginCallBack(data) {
        console.log(data);
        if (data.status === "success") {
            console.log(data.session_key);
            setCookie("session_key", data.session_key, 1800);
            window.location = 'main.html';
        } else {
            if(data.reason==="no such user")
            {

                $('.error_msg').hide();
                var error1= new Vue({
                    el: "#error_email",
                    data: {
                        message1: 'The e-mail address does not match credential'
                    }
                })

                var error3= new Vue({
                    el: '#error_pwd',
                    data: {
                        message2: 'The password does not match credential'
                    }
                })

                $('#error_email').show();
                $('#error_pwd').show();
                $("#email").val('');
                $("#password").val('');
            }
            else if(data.reason==="permission denied")
            {

                $('.error_msg').hide();
                var error2= new Vue({
                    el: '#error_ban',
                    data: {
                        message3: 'The e-mail address was banned'
                    }
                })

                $('#error_ban').show();
                $("#email").val('');
                $("#password").val('');
            }

        }
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function setCookie(cname, cvalue, sec) {
        var d = new Date();
        d.setTime(d.getTime() + (sec * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        console.log("cookie", document.cookie)
    }

});
