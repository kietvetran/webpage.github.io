module.exports = function() {
    var overLayActivatedHash = "#show-overlay";
    var scrollPositon;

    $('.overlay-btn').on('click', function (event) {
        event.preventDefault();
        window.location.hash = overLayActivatedHash; // Set to give the user expected behaviour when using the back button in the browser

        scrollPositon = $(window).scrollTop();
        $(this).closest('.button').find('.overlay-page').show();
        $(window).scrollTop(0);
    });

    $('.overlay-close').on('click', function (event) {
        event.preventDefault();
        window.location.hash = "";
        $('.overlay-page').hide();
        $('.bank-selector').show();
        $(window).scrollTop(scrollPositon);
    });

    $('.overlay-page').on('click', '.bank-selector .bank-link', function (event) {
        event.preventDefault();
        updateUrl($(this));
        $('.bank-selector').hide();
        $('.inner-content').removeClass('hide');
    });

    $(window).on('hashchange', function() {
        if (window.location.hash !== overLayActivatedHash) {
            // Back button has been used
            $('.overlay-close').click();
        }
    });

    //Updates product link url, with the correct bank when in common pages.
    var updateUrl = function (elm) {
        var bank = elm.data('url-name');

        $('.inner-content .product-links a').each(function() {
            this.href = this.href.replace('bank/', bank + '/');
        });
    };
};
