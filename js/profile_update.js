$.getScript('/js/serverIP.js', function()
{
    //vue.js
    var err_name= new Vue({
        el: "#update_err_name",
        data: {
            msg: ''
        }
    })
    var err_email= new Vue({
        el: "#update_err_email",
        data: {
            msg: ''
        }
    })
    var err_psw= new Vue({
        el: "#update_err_psw",
        data: {
            msg: ''
        }
    })

    var err_intro = new Vue({
        el: "#update_err_intro",
        data: {
            msg: ''
        }
    })

    var err_gender = new Vue({
        el: "#update_err_intro",
        data: {
            msg: ''
        }
    })

    $("#update_err_name").hide();
    $("#update_err_email").hide();
    $("#update_err_psw").hide();
    $("#update_err_intro").hide();
    $("#update_err_gender").hide();

    $("#Update").click(update);
    $("#Back").click(back);

    function back(){
        window.location = 'profile.html';
    }

    function setCookie(cname, cvalue, sec) {
        var d = new Date();
        d.setTime(d.getTime() + (sec * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        console.log("cookie", document.cookie)
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

    function update() {
        console.log("setEmail");

        if($("input#name").val().length ==0){
            err_name.msg = "Name should not be empty.";
            $("#update_err_name").show();
        }
        else if($("input#email").val().length == 0){
            err_email.msg = "Email should not be empty.";
            $("#update_err_email").show();
        }
        else if($("input#password").val().length == 0){
            err_psw.msg = "Password should not be empty.";
            $("#update_err_psw").show();
        } else {
            $.post(serverIP+'/api/setEmail/',
                {
                    'session_key': getCookie('session_key'),
                    'NewEmail': $("input#email").val(),
                    'Password': $("input#password").val()
                }, updateCallBack);
        }


    }

    function updateName(){
        console.log("setName");

        if($("input#name").val().length == 0){
            err_name.msg = "Name should not be empty"
        } else if ($("input#password").val().length == 0){
            err_psw.msg = "Password should not be empty"
        } else {
            $.post(serverIP+'/api/setName/',
                {
                    'session_key': getCookie('session_key'),

                    'NewName': $("input#name").val(),
                    'Password': $("input#password").val()
                }, updateCallBack);
        }
    }

    function updateGender(){
        console.log("setGender");

        if($("input#gender").val().length == 0){
            err_gender.msg = "Gender should not be empty"
        } else if($("input#password").val().length == 0){
            err_psw.msg = "Password should not be empty"
        }else {
            $.post(serverIP+'/api/setGender/',
                {
                    'session_key': getCookie('session_key'),
                    'NewGender': $("input#gender").val(),
                    'Password': $("input#password").val()
                }, updateCallBack);

        }
    }

    function updateIntro(){
        console.log("setIntro");

        if($("input#intro").val().length == 0){
            err_intro.msg = "Introduction should not be empty"
        }else if($("input#password").val().length == 0){
            err_psw.msg = "Password should not be empty"
        }else {
            $.post(serverIP+'/api/setIntro/',
                {
                    'session_key': getCookie('session_key'),
                    'NewIntro': $("input#intro").val(),
                    'Password': $("input#password").val()
                }, updateCallBack);
        }
    }


    function updateCallBack(data) {
        console.log(data);
        if (data.status === "success") {
            console.log(data.session_key);
            setCookie("session_key", data.session_key, 1800);
            window.location = 'profile.html';
        } else {
            if(data.reason === "authentication failed"){
                err_psw.msg = "The password is wrong.";
                $("#signup_err_psw").show();
            }
            if(data.reason === "Saving failed"){
                alert("Saving failed.");
            }
            $("input#password").val('');
        }
    }
});
