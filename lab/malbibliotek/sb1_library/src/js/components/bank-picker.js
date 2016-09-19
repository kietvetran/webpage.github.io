var _ = require('lodash');

module.exports = function() {

    var viewWindow      = $(window),
        template        = $('.bank-list-template ul'),
        target          = $('.bank-list-wrap'),
        defaultBank     = 'sb1defaultBank',
        defaultBankUrl  = 'defaultBankUrl';

    var screen = {
        big: 1408,
        medium: 1004,
        small: 676
    };

    $('.bank-picker .se-more-btn').click(function (event) {
        event.preventDefault();
        $(this).toggleClass('open').toggleAttr('aria-expanded').closest('.bank-picker').find('.bank-list').toggle();
    });

    $('.bank-list .toggle-btn').click(function (event) {
        event.preventDefault();
        $(this).hide().toggleAttr('aria-expanded').closest('.bank-list').find('.bank-selection').toggle();
    });

    $('.bank-list input').on('change', function() {
        generateNewTemplate($(this).val());
        generateList();
    });

    $('.login-btn').click(function (event) {
        event.preventDefault();
        var url = $('.bank-nav').find('.active').attr('href');
        var bank = window.pageContext.bankTitle;
        if( typeof(Storage) !== "undefined") {
            localStorage.setItem(defaultBank, bank);
            localStorage.setItem(defaultBankUrl, url );
        }
    });

    //hides the element in the list that should not be rendered,
    //when a filter is selected
    function generateNewTemplate (value) {

        $('.bank-list-template ul li').each(function (index, element) {
            var tagString = $(element).data('tags');
            if (tagString) {
                var tags = tagString.split(',');

                if($.inArray(value, tags) < 0){
                    $(element).addClass('hide');
                }
                else{
                    $(element).removeClass('hide');
                }
            } else {
                $(element).addClass('hide');
            }
        });
    }

    //Generate a 3 column list from the HTML template
    function generateList () {

        if(viewWindow.width() < screen.big || viewWindow.width() > screen.big ) {
            template.cols(3, target);
        }
        if(viewWindow.width() < screen.medium ) {
            template.cols(2, target);
        }
        if(viewWindow.width() < screen.small ) {
            template.cols(1, target);
        }
    }

    function checkSelectedBank () {

        if(localStorage.getItem(defaultBank)) {

            var bank = localStorage.getItem(defaultBank);
            var url = localStorage.getItem(defaultBankUrl);
            $('.bank-picker-suggestion').removeClass('hide');
            $('.bank-picker-header').addClass('visited');
            $('.bank-suggested .bank-name').html(bank);
            $('.bank-suggested').attr('href', url);
        }
        else{
            $('.bank-picker-suggestion').remove();
            $('.bank-selection').show();
        }
    }

    //Triggers functions that needs to start
    function setBankPicker  () {
        generateList();
        checkSelectedBank();
        viewWindow.resize(_.throttle(generateList, 100));
    }

    setBankPicker();
};