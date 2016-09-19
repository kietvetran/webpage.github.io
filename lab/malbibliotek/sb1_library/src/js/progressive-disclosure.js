var scrollToFit = require('./scroll-to-fit');

$(function() {
    $('.progressive-disclosure .content:not(.edit)').hide();
    $('.progressive-disclosure .toggle:not(.edit)').click(function () {
        var button = $(this);
        var content = button.closest('.progressive-disclosure').find('.content');

        if (isOpen()) {
            close();
        } else {
            open();
        }

        function isOpen() {
            return button.html() === button.data('open-text');
        }

        function close() {
            button.html(button.data('closed-text'));
            content.slideToggle();
        }

        function open() {
            button.html(button.data('open-text'));

            content.show();
            scrollToFit(button, content, 400);
            content.hide();

            content.slideToggle();
        }

        return false;
    });
});