$(function() {
    $('.hamburger').click(function(event) {
        $('.top-nav').addClass('active');
        event.stopPropagation();
    });
    
    $('.top-nav').click(function(event) {
        event.stopPropagation();
    });

    $('body').click(function(event) {
        $('.top-nav').removeClass('active');
    });
});
