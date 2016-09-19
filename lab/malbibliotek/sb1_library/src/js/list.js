/****
 * 
 * This is used for Category pages and Topicoverview list
 */

$(function () {

    var w           = $(window),
        btn         = $('.se-more-btn'),
        list        = $('.category-list'),
        template    = $('.list-template ul')

    var screen = {
        big: 1408,
        medium: 1004,
        small: 676    
    }

    var init = {

        generateTopicList: function () {

            if(w.width() > screen.big )
                template.cols(4, '.list-wrap');

            if(w.width() < screen.big )
                template.cols(3, '.list-wrap');

            if(w.width() < screen.medium )
                template.cols(2, '.list-wrap');

            if(w.width() < screen.small )
                template.cols(1, '.list-wrap');
        },

        checkOnResize: function () {
            var id;
            w.resize(function () {
                clearTimeout(id);
                id = setTimeout(init.generateTopicList, 1);          
            });
        },

        setFixedButton: function(){
            var elm = $('.category-list');
            w.scroll(function () {
                if(w.scrollTop() > elm.offset().top){
                    btn.addClass('fixed');
                }
                else{
                    btn.removeClass('fixed');
                }
            })
        },

        openMenu: function () {
            btn.click(function (e) {
                e.preventDefault();
                list.slideToggle('fast');
                btn.toggleClass('open');
                init.setFixedButton();
            }); 

        }
    }

    init.generateTopicList();
    init.checkOnResize();
    init.openMenu();

})