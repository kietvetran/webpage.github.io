(function($) {
	// function used for toggling boolean attributes
	$.fn.toggleAttr = function( attribute) {
	    
		var el = $(this);

		if( el.attr( attribute) === "false" ) {
			el.attr( attribute, true);
		} else {
			el.attr( attribute, false);
		}

		return el;
	};
})(jQuery);