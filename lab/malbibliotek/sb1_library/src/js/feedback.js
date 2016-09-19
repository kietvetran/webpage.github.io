var scrollToFit = require('./scroll-to-fit');

$(function() {

    var feedback = $('.feedback');
    feedback.find('form').submit(function() {
        return false;
    });

    feedback.find('.yes').click(function() {
        var feedback = $(this).closest('.feedback');
        var template = feedback.children('.template.on-yes');

        hideQuestionAndShowTemplate(feedback, template);

        createComment(feedback.children('.template.yes-no').attr('action'), 'yes');
    });

    feedback.find('.no').click(function() {
        var feedback = $(this).closest('.feedback');
        var template = feedback.children('.template.on-no');

        hideQuestionAndShowTemplate(feedback, template);

        createComment(feedback.children('.template.yes-no').attr('action'), 'no');
    });

    feedback.find('.send').one('click', function() {
        var template = $(this).closest('.template');
        template.find('.thanks').fadeIn(200);

        var top = template.find('.top');
        top.slideUp(200);
        top.addClass('hidden');

        $(this).removeClass('action-btn').addClass('clicked').val('').removeAttr('style').after('<span class="icon-check"></span>');

        var message = template.find('textarea').val();
        if (message) {
            createComment(template.attr('action'), message);
        }
    });
});

function hideQuestionAndShowTemplate(feedback, template) {
    var question = feedback.children('#question');
    var yesNoTemplate = feedback.children('.template.yes-no');
    question.css({'opacity': '0'});
    yesNoTemplate.removeClass('active');

    setTimeout(function () {
        question.hide();
        yesNoTemplate.hide();

        template.show();
        template.addClass('active');
        scrollToFit(template);
    }, 200);
}

function createComment(url, message) {
    $.post(url, {
        'id': 'nobot',
        ':operation': 'social:createComment',
        'message': message
    });
}