module.exports = function(topElement, bottomElement, speed) {
    bottomElement = bottomElement || topElement;
    speed = speed || 200;
    
    var headerOffset = 20;
    var top = topElement.offset().top;
    var bottom = bottomElement.offset().top + bottomElement.height() + headerOffset;
    var windowHeight = window.innerHeight;
    var windowTop = $(window).scrollTop();
    var windowBottom = windowTop + windowHeight;

    var target;
    if (bottom > windowBottom) {
        if (bottom - top > windowHeight) {
            target = top - $('.header').height() - headerOffset;
        } else {
            target = bottom - windowHeight;
        }
    } else if (top <= windowTop) {
        target = top - $('.header').height() - headerOffset;
    }
    $('html, body').animate({ scrollTop: target}, speed);
};