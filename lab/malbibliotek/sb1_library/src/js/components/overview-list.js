/****
 *
 * This is used for Category pages and Topic overview list
 */
var _ = require('lodash');
var size = require('../common/variables');

module.exports = function() {

    var viewWindow      = $(window),
        template        = $('.list-template ul'),
        target          = $('#overview-list');

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

    var checkOnResize = function () {
        generateList();
        viewWindow.resize(_.throttle(generateList, 100));
    };

    var openMenu = function () {
        var listButton      = $('#list-btn');
        var categoryList    = $('.category-list');

        listButton.click(function (event) {
            event.preventDefault();
            categoryList.slideToggle('fast');
            $(this).toggleClass('open').toggleAttr('aria-expanded');
        });
        categoryList.on('click', function() {
            categoryList.hide();
            listButton.removeClass('open');
        });
    };

    checkOnResize();
    openMenu();
};