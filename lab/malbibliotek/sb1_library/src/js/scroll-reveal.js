var _ = require('lodash');
$("[class*='scroll-reveal']").addClass('scroll-reveal-hidden');

$(function() {
    var w = $(window);
    var onScroll = function () {
        var padding = 20;
        $("[class*='scroll-reveal']").each(function (index, element) {
            var bottomOfPage = w.scrollTop() + w.height();
            var topOfElement = $(element).offset().top + padding;
            if (bottomOfPage > topOfElement) {
                $(element).removeClass('scroll-reveal-hidden');
            }
        });
    };
    w.on('scroll', _.throttle(onScroll, 100));
    w.on('touchmove', _.throttle(onScroll, 100));
    onScroll();
});