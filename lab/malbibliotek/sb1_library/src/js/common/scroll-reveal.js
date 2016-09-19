var _ = require('lodash');

module.exports = function() {
    var w = $(window);

    var bottomOfPage = w.scrollTop() + w.height();
    $("[class*='scroll-reveal']").each(function (index, element) {
        var topOfElement = $(element).offset().top;
        if (bottomOfPage < topOfElement) {
            $(element).addClass('scroll-reveal-hidden');
        }
    });

    var onScroll = function () {
        $("[class*='scroll-reveal']").each(function (index, element) {
            var bottomOfPage = w.scrollTop() + w.height();
            var topOfElement = $(element).offset().top;
            if (bottomOfPage > topOfElement) {
                $(element).removeClass('scroll-reveal-hidden');
            }
        });
    };
    w.on('scroll', _.throttle(onScroll, 100));
    w.on('touchmove', _.throttle(onScroll, 100));
    onScroll();
};
