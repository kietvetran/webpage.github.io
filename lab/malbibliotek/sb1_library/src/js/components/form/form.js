var createView = require('./fieldFactory').createView;

var Form = function(el) {
    var $el = $(el);
    var views = [];
    $el.find('.input').each(function(index, el) {
        views.push(createView(el));
    });
    $el.on('submit', function(e) {
        e.preventDefault();
        views.forEach(function(view) {
            view.validateField();
        });
    });
};

function init() {
    $('form').each(function (index, el) {
        new Form(el);
    });

    $('.helptext-toggle-btn').click(function (e) {
        e.preventDefault();
        $(this).siblings('.helptext').toggleClass('hide');
    });
}

module.exports = init;