module.exports = function() {
    
    $('.step-head').click(function(e) {
        e.preventDefault();
        var $this = $(this);
        var steps = $this.closest('.steps');

        steps.siblings().attr('aria-expanded', false).find('.step-head').removeClass('open');
        steps.siblings().find('.step-content').slideUp('fast');
        steps.toggleAttr('aria-expanded');

        $this.toggleClass('open').toggleAttr('aria-expanded');
        steps.find('.step-content').slideToggle('fast');
    });
};