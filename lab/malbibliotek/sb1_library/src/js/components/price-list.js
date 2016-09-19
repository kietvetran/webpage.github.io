module.exports = function() {
    $('.price-list .price-title').click(function() {
        var priceList = $(this).closest('.price-list');
        priceList.siblings().attr('aria-expanded', false).removeClass('active').find('.price-content').slideUp();
        priceList.toggleClass('active').toggleAttr('aria-expanded').find('.price-content').slideToggle();
    });
};