$.getScript('/js/serverIP.js', function()
{

    $(function(){
        $(".loggedin-div").load("nav.html");
    });
    $('.edit').click(function () {
        $(this).hide();
        $('.box').addClass('editable');
        $('.text').attr('contenteditable', 'true');
        $('.save').show();
    });
    $('.save').click(function () {
        $(this).hide();
        $('.box').removeClass('editable');
        $('.text').removeAttr('contenteditable');
        $('.edit').show();
    });
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    console.log(id);


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

    $.post(serverIP+'/api/getReviewByID/',
        {
            'session_key': getCookie('session_key'),
            'id': id
        }).done(ReviewCallBack).fail(function (a) {
        alert("error occured");
        window.location = 'index.html';
    });

    function ReviewCallBack(data) {
        console.log(data);
        if (data.status === "success") {
            $(".loggedin-div").show();
            console.log(data.user);
            $("#username").html(data.request_user);
            displayReview(data);
            $(".se-pre-con").fadeOut("slow");
        } else {
            if (data.reason === "session expired") {
                alert("login session timeout, need to login again");
                window.location = 'index.html';
            }
        }
    }
});