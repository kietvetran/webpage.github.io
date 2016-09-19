module.exports = function() {
    $('.faq .se-more-btn').click(function (event) {
        event.preventDefault();
        $(this).toggleClass('open').toggleAttr('aria-expanded').closest('.faq').find('.question.non-highlighted').toggle();
    });
};