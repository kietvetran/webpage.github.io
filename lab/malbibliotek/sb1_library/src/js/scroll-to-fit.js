module.exports = function(topElement, bottomElement, speed) {
    bottomElement = bottomElement || topElement;
    speed = speed || 200;

    var top = topElement.offset().top;
    var bottom = bottomElement.offset().top + bottomElement.height() + 20;
    var windowHeight = window.innerHeight;
    var windowBottom = $(window).scrollTop() + windowHeight;

    if (bottom > windowBottom) {
        var target;
        if (bottom - top > windowHeight) {
            target = top;
        } else {
            target = bottom - windowHeight;
        }

        $('html, body').animate({ scrollTop: target}, speed);
    }
};