module.exports = function() {
    $('.question-list .question .question-text').click(function() {
        var question = $(this).closest('.question');
        question.siblings().attr('aria-expanded', false).removeClass('active').find('.answer').slideUp();
        question.toggleClass('active').toggleAttr('aria-expanded').find('.answer').slideToggle();
    });
};