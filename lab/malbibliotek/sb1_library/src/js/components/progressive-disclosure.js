var scrollToFit = require('../common/scroll-to-fit');

module.exports = function() {
    $('.progressive-disclosure .content:not(.edit)').hide();
    $('.progressive-disclosure .toggle-btn:not(.edit)').click(function (e) {
        var button = $(this);
        e.preventDefault();
        button.toggleClass('open').toggleAttr('aria-expanded');
        var content = button.closest('.progressive-disclosure').find('.content');

        scrollToFit(button, content, 400);
        content.slideToggle();

    });
};