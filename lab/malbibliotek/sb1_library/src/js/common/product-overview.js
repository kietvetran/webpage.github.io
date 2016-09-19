var _  = require('lodash');
var size = require('../common/variables');
var insertSVG = require('../plugins/svg');

module.exports = function() {
    var viewWindow = $(window);
    var template;
    var target;
    var element;

    $('.product-overview-list li').on( 'click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var mode = 'active';

        // Replace icon with inline svg
        insertSVG($this.find('picture img'));

        $('.appended-section').remove();

        $this.toggleClass(mode).siblings().removeClass(mode);
        setListTargetAndTemplate($this);
        generateList();
        viewWindow.resize(_.throttle(generateList, 100));

        if($this.hasClass(mode)){
            addSection($this);
        }
    });

    var setListTargetAndTemplate = function ($this) {
        element  = $('.product-overview-wrap').find('#' + $this.data('template'));
        template = $(element).find('.list-templates ul');
        target   = $(element).find('.list-wrap');
    };

    var addSection = function (current) {
        $('.product-overview-list').SB1sectionAppender({
            'content': $('#' + current.data('template')).html(),
            'current': current.parent().hasClass('product-overview-list') ? current : current.parent(), //customer-action-list
            'classname': 'appended-section'
        });
        target = $('.appended-section').find('.list-wrap');
    };

    var generateList = function () {
        if(viewWindow.width() > size.screenBig ) {
            template.cols(4, target);
        }
        if(viewWindow.width() < size.screenBig ) {
            template.cols(3, target);
        }
        if(viewWindow.width() < size.screenMedium ) {
            template.cols(2, target);
        }
        if(viewWindow.width() < size.screenSmall ) {
            template.cols(1, target);
        }
    };
};