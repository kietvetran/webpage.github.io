module.exports = function() {
    
    var tabLinks = $('.tabs-wrap .tab-links');
    var aLinks = $('.tabs-wrap .tab-links li a');

    tabLinks.on('click', 'a:not("active")', function(e)  {
        var el = $(this);
        var currentAttrValue = $(this).attr('href');
 
        $(currentAttrValue).show().siblings().hide();
 
        el.parent('li').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();
        
        $(currentAttrValue).fadeIn(400).siblings().hide();
        tabLinks.removeClass('open');
    });
    
    tabLinks.on('click', 'li.active', function(e)  {

        tabLinks.addClass('open');
        // Set the current one to true
        $(this).find('a').attr('aria-expanded', true);

    });

    aLinks.click( function() {
        aLinks.attr( 'aria-expanded', false);
        $(this).attr( 'aria-expanded', true);
    });
    
};
