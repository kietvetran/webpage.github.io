var globalSearch = require('./search/search-global')();

module.exports = function() {

    var menu             = $('.hamburger-wrapper'),
        hamburger        = $('.hamburger'),
        header           = $('.header'),
        $window          = $(window),
        $body            = $('body'),
        globalMessage    = $('.global-message'),
        nav              = $('.top-nav'),
        $searchButton    = $('.small-search'),
        $searchOverlay   = $('.search-overlay'),
        navOffset        = 70,
        position         = 0;

    menu.click(function(event) {
        event.preventDefault();
        $body.toggleClass('menu-active');

        if (nav.hasClass('active')) {
            $window.scrollTop(position);
        }
        else {
            position = $window.scrollTop();
            $window.scrollTop(0);
        }
        hamburger.toggleClass('open');
        nav.toggleClass('active');
        header.toggleClass('active');

    });

    nav.on('click', 'a', function(event) {
        nav.removeClass('active');
        hamburger.removeClass('open');
    });

    $searchButton.on('click', function( event) {

        event.preventDefault();
        // Show overlay and make it as tall as the body
        $searchOverlay.removeClass('hide').css( 'height', $body.innerHeight() + navOffset );
        // Set header to active which will position it as 'static'
        header.addClass('active');
        // start global search
        globalSearch.init();
    });

    function checkPageType () {
        if(!header.hasClass('front-page')){
            setFixedMenu();
        }
    }

    function setFixedMenu() {

        var navOffset = nav.offset().top;

        if($window.scrollTop() > navOffset) {
            globalMessage.addClass('hide');
            header.addClass('scroll');
            $body.addClass('scroll');
        }

        $window.scroll(function() {
            if($window.scrollTop() > navOffset) {
                globalMessage.addClass('hide');
                header.addClass('scroll');
                $body.addClass('scroll');
            }
            else{
                globalMessage.removeClass('hide');
                header.removeClass('scroll');
                $body.removeClass('scroll');
            }

        });
    }

    checkPageType();
};
