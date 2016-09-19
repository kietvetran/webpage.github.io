
module.exports = function() {
    var nonHighlighted = $('.adviser-hidden');
    var btn = $('#btn-adviser-list');

    btn.on('click', function(e){
        e.preventDefault();
        nonHighlighted.toggleClass('hide');
        btn.toggleClass('open').toggleAttr('aria-expanded');
    });
};