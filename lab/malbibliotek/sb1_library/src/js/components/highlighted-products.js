var createSvg = require('../plugins/svg.js');

module.exports = function() {
    
    createSvg('.highlighted-products img.inline-svg');
    createSvg('.customer-action-list img.inline-svg');
    
    var btn = $('.highlighted-products .se-more-btn'),
        elm = $('.hidden-list');
    
    
    btn.on('click', function(e) {
        e.preventDefault();
        elm.slideToggle('fast');
        btn.toggleAttr('aria-expanded').toggleClass('open');
        
    });

};