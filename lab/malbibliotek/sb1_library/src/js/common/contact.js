var scrollToFit     = require('./scroll-to-fit');
var searchFindUs    = require('./search/search-find-us');
var validateForm    = require('../components/form/form');

module.exports = function() {

    var atachEvents = function() {

        $('.customer-action-list li').on( 'click', function(e) {

            if($(e.currentTarget).hasClass('hide-desktop')){
                return;
            }
            e.preventDefault();
            showSection(e);

            var eSection = $('.customer-action-list .appended-section');
            eSection.find('input').first().focus();
            if ( eSection.length > 0) {
                scrollToFit($(this), eSection);
            }

            if(eSection.find('form').length > 0) {
                validateForm();
                onAddTimeClick(eSection);
            }
            searchFindUs();
        });
    };

    var showSection = function (e) {

        var mode = 'active';
        var current = $(e.currentTarget);
        var wrapper = $('.customer-action-wrap');
        var container = current.closest('.customer-action-list');

        wrapper.addClass('open');
        container.find('.appended-section').remove();

        if ( current.hasClass(mode))  {
            current.removeClass( mode );
            wrapper.removeClass('open');
            return this;
        }

        container.find('.' + mode).removeClass(mode);
        current.addClass( mode );

        container.SB1sectionAppender({
            'content': $('#' + current.data('menu-section')).html(),
            'current': current.parent().hasClass('customer-action-list') ? current : current.parent(),
            'classname': 'appended-section'
        });
    };

    var onAddTimeClick = function (eSection) {
        var btn = eSection.find('.add-appointment');
        var elm = eSection.find('.appointments');
        var html = eSection.find('.appointments').html();

        btn.on('click', function (e) {
            e.preventDefault();
            elm.append(html);
            validateForm();
        });
    };

    atachEvents();

};



