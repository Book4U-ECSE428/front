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
                user: book.request_user,
                like:0,
                dislike:0,
                pastreviewid:[]
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
                },
                likeReview: function(e){
                    var nofound=0;
                    var reviewid= e.target.getAttribute("data-reviewid");
                    //console.log(reviewid);
                    if(this.pastreviewid.length<1)
                    {
                        this.pastreviewid.push(reviewid);            
                    }
                    for (var i=0;i<this.pastreviewid.length;i++)
                    {
                        if (this.pastreviewid[i]===reviewid)
                        {
                           if (!window.alreadyClicked) {
                            $.post(serverIP+'/api/vote_like/',
                                {
                                    'session_key': getCookie('session_key'),
                                    'id': reviewid
                                }).done(votelikeCallBack).fail(function (a) {
                                console.log("vote like error");
                                });
                            window.alreadyClicked = true;
                            this.like=1;
                            this.dislike=0;
                        }else if(window.alreadyClicked&&this.dislike===1){
                                $.post(serverIP+'/api/vote_like/',
                                    {
                                        'session_key': getCookie('session_key'),
                                        'id': reviewid
                                    }).done(votelikeCallBack).fail(function (a) {
                                    console.log("vote like error");
                                    });
                                this.like=2;
                                this.dislike=0;
                            }
                            else{
                                alert("You can only vote once.");
                            }
                           nofound=0;
                           break; 
                        }
                        else
                        {
                            nofound=1;
                        }
                    }
                    if(nofound===1)
                    {
                        this.pastreviewid.push(reviewid); 
                        window.alreadyClicked=false;
                        if (!window.alreadyClicked) {
                                $.post(serverIP+'/api/vote_like/',
                                {
                                    'session_key': getCookie('session_key'),
                                    'id': reviewid
                                }).done(votelikeCallBack).fail(function (a) {
                                console.log("vote like error");
                                });
                            window.alreadyClicked = true;
                            this.like=1;
                            this.dislike=0;
                            }
                    }
                                        
                    
                },
                dislikeReview: function(e){
                    var nofound=0;
                    var reviewid= e.target.getAttribute("data-reviewid");
                    //console.log(reviewid);
                    if(this.pastreviewid.length<1)
                    {
                        this.pastreviewid.push(reviewid);            
                    }
                    for (var i=0;i<this.pastreviewid.length;i++)
                    {
                        if (this.pastreviewid[i]===reviewid)
                        {
                           if (!window.alreadyClicked) {
                            $.post(serverIP+'/api/vote_dislike/',
                                {
                                    'session_key': getCookie('session_key'),
                                    'id': reviewid
                                }).done(votedislikeCallBack).fail(function (a) {
                                console.log("vote dislike error");
                                });
                            window.alreadyClicked = true;
                            this.like=0;
                            this.dislike=1;
                            }else if(window.alreadyClicked&&this.like===1){
                                $.post(serverIP+'/api/vote_dislike/',
                                    {
                                        'session_key': getCookie('session_key'),
                                        'id': reviewid
                                    }).done(votedislikeCallBack).fail(function (a) {
                                    console.log("vote dislike error");
                                    });
                                this.dislike=2;
                                this.like=0;
                            }else{
                                alert("You can only vote once.");
                            }
                           nofound=0;
                           break; 
                        }
                        else
                        {
                            nofound=1;
                        }
                    }
                    if(nofound===1)
                    {
                        this.pastreviewid.push(reviewid); 
                        window.alreadyClicked=false;
                        if (!window.alreadyClicked) {
                            $.post(serverIP+'/api/vote_dislike/',
                                {
                                    'session_key': getCookie('session_key'),
                                    'id': reviewid
                                }).done(votedislikeCallBack).fail(function (a) {
                                console.log("vote dislike error");
                                });
                            window.alreadyClicked = true;
                            this.like=0;
                            this.dislike=1;
                            }
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
    function votelikeCallBack(data) {
        console.log(data);
        if (data.status === "success") {
            location.reload();
        }
		else {
			alert(data.reason);
		}
    }
    function votedislikeCallBack(data) {
        console.log(data);
        if (data.status === "success") {
            location.reload();
        }
		else {
			alert(data.reason);
		}
		
    }
 
});
