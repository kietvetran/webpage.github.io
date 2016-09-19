var createSvg = require('./plugins/svg.js');

$(function () {
    
    createSvg('.highlighted-products img.inline-svg');
    createSvg('.product-card img.inline-svg');
    
    var btn = $('.highlighted-products .se-more-btn'),
        elm = $('.hidden-list'),
        btnCloseText = 'Lukk',
        btnOpenText = 'Se alle produkter'
    
    
    btn.on('click', function(e) {
        e.preventDefault();
        elm.slideToggle('fast');
        if(btn.html() === btnCloseText){
            btn.html(btnOpenText)
        }
        else{
            btn.html(btnCloseText);
        }
        
    });

});