var category=false;
var cardList;

$.getScript('/js/serverIP.js', function()
{
    function logout() {
        setCookie("", "", 10);
        window.location = 'login.html';
    }
    
    function setCookie(cname, cvalue, sec) {
        var d = new Date();
        d.setTime(d.getTime() + (sec * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        //console.log("cookie", document.cookie);

    }


    $(function () {
        $(".loggedin-div").load("nav.html");
        // Toggle category mode on click
        $("#byCategory").click(function(e){
            console.log(category);
            category = !category;
            Vue.set(cardList, 'cat', category);
        });
    });

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

    $.post(serverIP+'/api/getAllBooks/',
        {
            'session_key': getCookie('session_key')
        }).done(b_cb).fail(function (a) {
        window.location = 'index.html';
    });

    function b_cb(data) {
        // console.log(data);
        if (data.status === "success") {
            $(".loggedin-div").show();
            console.log(data.user);
            $("#username").html(data.user);
            setCookie('username', data.user, 3600);
            generateAllCard(data.books);
            $(".se-pre-con").fadeOut("slow");;

        } else {
            if (data.reason === "session expired") {
                alert("login session timeout, need to login again");
                window.location = 'index.html';
            }
        }

    }

    function generateAllCard(book_list) {
        cardList = new Vue({
            el: "#card-list",
            data: {
                books: book_list,
                cat: category,
                cat_list: [],
                show_cat: -1
            },
            methods:{
                fillCategoryList(){
                    for (var i=0; i<this.books.length;i++){
                        var book_cat = this.books[i]['book_category'];
                        for (var j=0; j<book_cat.length; j++){
                            if (this.cat_list.indexOf(book_cat[j])==-1){
                                // console.log(book_cat[j]);
                                this.cat_list.push(book_cat[j]);
                            }
                        }
                    }
                },
                catCheck(cat_index, book_index){
                    if (this.show_cat>=0 && this.show_cat!=cat_index){
                        return false;
                    }
                    if (this.books[book_index]['book_category'].indexOf(this.cat_list[cat_index])>-1){
                        return true;
                    } else {
                        return false;
                    }

                },
                showCategory(cat_index){
                    this.show_cat=cat_index;
                    $(".heightlim").css({'max-height': 'none'});
                }
            },
            created(){
                this.fillCategoryList();
            }

			/*method:{
				removeElement: function(index){
					this.books.splice(index,1);
				}
			}*/
        });
    }

    var book_pic_list = [
        'https://about.canva.com/wp-content/uploads/sites/3/2015/01/creative_bookcover.png',
        'https://about.canva.com/wp-content/uploads/sites/3/2015/01/children_bookcover.png',
        'https://marketplace.canva.com/MAB___U-clw/1/0/thumbnail_large/canva-yellow-lemon-children-book-cover-MAB___U-clw.jpg',
        'https://spark.adobe.com/images/landing/examples/how-to-book-cover.jpg',
        'https://marketplace.canva.com/MACSXEOzaeQ/1/0/thumbnail_large/canva-orange-and-dark-purple-triangular-modern-architecture-book-cover-MACSXEOzaeQ.jpg',
        'http://www.creativindie.com/wp-content/uploads/2013/10/Enchantment-Book-Cover-Best-Seller1.jpg'
    ];
});
