$.getScript('/js/serverIP.js', function()
{
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

    $.post(serverIP+'/api/getProfile/',
        {
            'session_key': getCookie('session_key')
        }).done(display_info).fail(function (a) {
        alert("error occured");
        window.location = 'index.html';
    });
    $(function(){
        $(".loggedin-div").load("nav.html");
    });
});