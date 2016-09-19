module.exports = function () {

    $('.multistep-form .form-step-head').click(function(e) {
        e.preventDefault();
        var formMultistep = $(this).closest('li');
        formMultistep.siblings().attr('aria-expanded', false).find('.multistep-content').slideUp("fast");
        formMultistep.siblings().removeClass('open');
        formMultistep.toggleClass('open').toggleAttr('aria-expanded').find('.multistep-content').slideToggle("fast");
    });
};
