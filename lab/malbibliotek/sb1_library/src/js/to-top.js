$(function() {

    var elm = $('.to-top'),
        w = $(window),
        height = 700,
        lastScroll = 0; 

    var init = function () {

        w.scroll(function () {
            var st = $(this).scrollTop();

            if(w.scrollTop() > height){
                if (st > lastScroll) {
                    elm.removeClass('show');
                } else {
                    elm.addClass('show');
                }
                lastScroll = st;
            }else{
                elm.removeClass('show');
            }

        });

        elm.click(function(){
            $('html,body').animate({scrollTop:0},700);
        });

    };

    init();

});