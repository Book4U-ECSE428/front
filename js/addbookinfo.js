$.getScript('/js/serverIP.js', function()
{
    var username = getCookie('username');
    $("#username").html(username);
console.log(serverIP);
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


    function checkValid() {

        var name = document.getElementById("name").value;
        var author = document.getElementById("author").value;
        var ISBN = document.getElementById("ISBN").value;
        var publish_date = document.getElementById("publish_date").value;
        var edition = document.getElementById("edition").value;
        var category = document.getElementById("category").value;
        var publish_firm = document.getElementById("publish_firm").value;
        var cover_image = document.getElementById("cover_image").value;

        if (name == "") {
            alert("bookname must be filled");
        }
        else if (ISBN == "") {
            alert("ISBN must be filled");
        }

        else if (author == "") {
            alert("author name must be filled");
        }
        else {
            $.get(cover_image)
                .done(function () {
                    //Now you know the image exists.
                    $.post(serverIP+'/api/add_book/',
                        {
                            'session_key': getCookie('session_key'),
                            'name': name,
                            'author': author,
                            'ISBN': ISBN,
                            'publish_date': publish_date,
                            'edition': edition,
                            'category': category,
                            'publish_firm': publish_firm,
                            'cover_image': cover_image


                        }, bookinfoCallBack);
                }).fail(function () {
                // Image doesn't exist
                alert('That image does no exist!');
            })


        }
    }


    function bookinfoCallBack(data) {
        console.log(data);
        if (data.status == "success") {
            window.location = 'main.html';
        } else {
            $("text#bookname").val('');
            $("text#author").val('');
            alert(data.reason);
        }
    }


});

