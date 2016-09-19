var scrollToFit = require('../common/scroll-to-fit');

module.exports = function() {
    function close() {
        var $self = $(this);
        var template = $self.closest('.feedback').children('.template');
        template.slideUp();

        $self.one('click', open);
        $self.css({'opacity': '0'});
        setTimeout(function() {
            $self.html($self.data('closed-text'));
            $self.removeAttr('style');
        }, 200);
        return false;
    }

    function open() {
        var $self = $(this);
        var template = $self.closest('.feedback').children('.template');
        template.slideDown();

        $self.one('click', close);
        $self.css({'border-color': '#fff', 'opacity': '0'});
        setTimeout(function() {
            $self.html($self.data('open-text'));
            $self.css({'opacity': '1'});
        }, 200);
        return false;
    }

    var init = function () {
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

        feedback.find('.cancel-btn').click(function() {
            var feedback = $(this).closest('.feedback');
            var question = feedback.children('#question');

            var template = $(this).closest('.template');
            template.removeClass('active');

            var yesNoTemplate = feedback.children('.template.yes-no');

            setTimeout(function () {
                yesNoTemplate.show();
                yesNoTemplate.addClass('active');
                question.removeAttr('style');
                template.hide();
            }, 200);
        });

        feedback.find('.send').one('click', function() {
            var template = $(this).closest('.template');
            template.find('.thanks').fadeIn(200);

            var top = template.find('.top');
            top.slideUp(200);
            top.addClass('hidden');

            template.find('.cancel-btn').hide();

            $(this).css({'width': $(this).width()+'px'});
            $(this).width();
            $(this).removeClass('action-btn').addClass('clicked').val('').removeAttr('style').after('<span class="icon-check"></span>');

            var toggle = $(this).closest('.feedback').children('.toggle-btn');
            if (toggle) {
                toggle.hide();
            }

            var message = template.find('textarea').val();
            if (message) {
                createComment(template.attr('action'), message);
            }
        });

        feedback.find('.toggle-btn').one('click', open);
    };

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
        $.post(url.replace('jcr:content', '_jcr_content'), {
            'id': 'nobot',
            ':operation': 'social:createComment',
            'message': window.pageContext.bank + ': ' + message
        });
    }
    
    init();

};
