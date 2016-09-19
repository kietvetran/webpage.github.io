/*
This code is used to add a clickable line on each of the text-tiles components when 
the text in the content container is higher than then the container itself.
A clickable line will then be added which will expand the content container 
to the same height as the text when the line is clicked.
*/
var _ = require('lodash');

module.exports = function() {
	var maxOuterHeight = 350;
	var maxInnerHeight = 290; 	//  Consider the top and bottom padding of the content container

	function compressTextTile(component, wrapper) {
		wrapper.removeAttr("style");
		wrapper.removeClass("expanded");
		component.removeClass("selected");	
		component.removeClass("icon-arrow_up");
		component.addClass("icon-arrow_down");
		component.attr("aria-pressed","false");	
	}

	function expandTextTile(component, wrapper) {
		closeAllOpenTextTiles();
		wrapper.outerHeight(wrapper.prop('scrollHeight'));
		wrapper.addClass("expanded");
		component.removeClass("icon-arrow_down");
		component.addClass("icon-arrow_up");
		component.addClass("selected");
		component.attr("aria-pressed","true");
	}

	function closeAllOpenTextTiles() {
		$('.text-tiles .selected').each(function(index) {	
			$(this).click();
		});
	}


	function clickLine(component) {	
		var wrapper = component.siblings(".text-tiles-wrapper");
		var wrapperFooterLine = wrapper.siblings(".line");
		
		if ( (wrapper.outerHeight() > maxOuterHeight && wrapper.prop('scrollHeight') > maxInnerHeight) || 
			 (wrapperFooterLine.hasClass("icon-arrow_up") && wrapperFooterLine.hasClass("selected")) ) {	
			compressTextTile(component, wrapper);

		} else if (wrapper.prop('scrollHeight') > maxInnerHeight) {
			expandTextTile(component, wrapper);	
		}
	}

	// Remove the footer line of each component that have no overflowing content
	function textTileUpdateOnResize() {
		$('.text-tiles-wrapper').each(function(index) {	
			var $this= $(this);

			if ($this.prop('scrollHeight') < (maxOuterHeight+20) ) {
				$this.siblings(".line").addClass("hidden");	
				$this.removeClass("compressed");
			}
			else {
				$this.addClass("compressed");
				$this.siblings(".line").removeClass("hidden");
			}
		});
	}

	$(".text-tiles").on('click', ".line" , function() {
		// Hide outline if mouse is used
		var $this = $(this);
		
		$this.addClass("remove-outline");
		clickLine($this);

	});

	$(".line").keyup(function(event){
		// Show outline if tab is used to navigate
	    if(event.keyCode === 13){
	    	var $this = $(this);

	        $this.removeClass("remove-outline");
	        clickLine($this);
	    }
	});
	
	$(".line").keydown(function(event){
	    if(event.keyCode === 9){
    		$(this).removeClass("remove-outline");
	    }
	});

    $( window ).resize(function() {
		_.debounce(textTileUpdateOnResize, 50);
	});
	
	// Call on load
	textTileUpdateOnResize();
};