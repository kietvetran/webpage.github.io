(function($) {
    
    $.fn.hasVerticalScrollBar = function() {
        return this.get(0).scrollHeight > this.get(0).clientHeight;
    };

    $.fn.hasHorizontalScrollBar = function() {
        return this.get(0).scrollWidth > this.get(0).clientWidth;
    };

})(jQuery);