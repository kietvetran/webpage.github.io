$(function () {
    
    var tabLinks = $('.tabs-wrap .tab-links');

    tabLinks.on('click', 'a:not("active")', function(e)  {
        var currentAttrValue = $(this).attr('href');
 
        $(currentAttrValue).show().siblings().hide();
 
        $(this).parent('li').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();
        
        $(currentAttrValue).fadeIn(400).siblings().hide();
        tabLinks.removeClass('open');
    });
    
    tabLinks.on('click', 'li.active', function(e)  {
        tabLinks.addClass('open');
    });
    
});
