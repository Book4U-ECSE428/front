$.getScript('/js/serverIP.js', function()
{
    $(function(){
        $(".loggedin-div").load("nav.html");
    });
    $.post(serverIP+'/api/getBookByID/',
        {
            'session_key': getCookie('session_key'),
            'id': id
        }).done(bookCallBack).fail(function (a) {
        alert("error occured");
        window.location = 'index.html';
    });

    function bookCallBack(data) {

        console.log(data);
        if (data.status === "success") {
            $(".loggedin-div").show();
            $("#username").html(data.request_user);
            displayBook(data);
            $(".se-pre-con").fadeOut("slow");
        } else {
            if (data.reason === "session expired") {
                alert("login session timeout, need to login again");
                window.location = 'index.html';
            }
        }

    }
    function displayBook(book) {
        //vue.js

        var book = new Vue({
            el: '#details',
            data: {
                request_user: book.request_user,
                cover_image: book.cover_image,
                name: book.book_name,
                ISBN: book.book_ISBN,
                Author: book.book_author,
                Publish_firm: book.book_publish_firm,
                Publish_date: book.book_publish_date,
                Edition: book.book_edition,
                Genre: book.book_category,
                Reviews: book.reviews,
                permission: book.permission,
                user: book.request_user
            },
            methods:{
                deletReview: function(e){
                    var reviewid= e.target.getAttribute("data-reviewid");
                    console.log(reviewid);
                    if (this.permission=="Moderator"){
                        window.location = 'mod_delete.html?id=' + reviewid;
                    } else {
                        $.post(serverIP+'/api/deleteReviewByID/',
                            {
                                'session_key': getCookie('session_key'),
                                'id': reviewid
                            }).done(deleteReviewCallBack).fail(function (a) {
                            console.log("delete review error");
                        });
                    }

                }
            }
        });
    }
    function deleteReviewCallBack(data) {
        console.log(data);
        if (data.status === "success") {
            location.reload();
        }
    }
});
