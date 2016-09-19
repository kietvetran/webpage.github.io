var scrollToFit = require('./scroll-to-fit');

var allAnswers = $('.faq .answer').hide();
var allQuestions = $('.faq .question');
var speed = 200;

allQuestions.click( function() {
    allQuestions.removeClass('active');
    allAnswers.slideUp(speed);

    var question = $(this);
    var answer = question.siblings('.answer');
    
    if (!answer.is(':visible')) {        
        question.addClass('active');

        answer.show();
        scrollToFit(question, answer, speed);
        answer.hide();
        
        answer.slideDown(speed);

    }
    return false;
});