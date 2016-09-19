var setHeight = require('../common/calculate-height.js');

module.exports = function() {
    var nonHighlighted = $('.non-highlighted');
    var btn = $('#btn-card-list');
    
    setHeight();
    
    btn.on('click', function(e){
        e.preventDefault();
        nonHighlighted.toggleClass('hide');
        btn.toggleClass('open').toggleAttr('aria-expanded');
        setHeight();
    });
    
    
};
