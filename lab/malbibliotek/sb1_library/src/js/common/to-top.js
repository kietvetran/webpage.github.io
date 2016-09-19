var _ = require('lodash');

module.exports = function() {
    var toTopButton = $('.to-top'),
        viewWindow = $(window),
        height = 700,
        lastScrollVerticalHeight = 0; 
    
    function displayScrollToTopButton() {
        var scrollVerticalHeight = viewWindow.scrollTop();

        if (viewWindow.scrollTop() > height){

            if (scrollVerticalHeight > lastScrollVerticalHeight) {
                toTopButton.removeClass('show');
            }
            else {
                toTopButton.addClass('show');
            }
            lastScrollVerticalHeight = scrollVerticalHeight;
        } 
        else {
            toTopButton.removeClass('show');
            lastScrollVerticalHeight = scrollVerticalHeight;
        }

    }
    
    viewWindow.scroll( _.throttle(displayScrollToTopButton, 250) );
    
    toTopButton.click(function() {
        $('html,body').animate({scrollTop:0},700);
    });
};