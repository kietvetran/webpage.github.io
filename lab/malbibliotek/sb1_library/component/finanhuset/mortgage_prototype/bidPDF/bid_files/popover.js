//	_______________________________________________
//	popover.js
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾

// param obj	Object with the following properties:
// - $el 	the jQuery element that executed the popover
// - tmpl 	the id of the template to use
// - vm 	the view model for knockout
// - id 	the id of the injected template
// - css 	any css rules to be applied to the popover
bid.Popover = function(obj){

	// is the button/popover already active
	if (obj.$el.hasClass('active')){
		// remove!
		removePopover();
		obj.$el.toggleClass('active', false);
		return;
	}

	// activate the button
	obj.$el.toggleClass('active', true);

	// retrieve the template
	var $tmpl = $('#' + obj.tmpl);

	// inject it in DOM
	$('body').append($tmpl.html());

	// retreive the popover from DOM
	var $popover = $('body > #' + obj.id)

	var css = getCSS(obj.css);

	$popover.css(css);
	$popover.find('> .arrow').css(obj.cssArr);

	// apply bindings
	ko.applyBindings(obj.vm, $popover.get(0));

	// any click to the document should close the popover
	setTimeout(function(){
		$(document).bind(bid.e.INTERACTIVE_EVENT, removePopover);
	},10);

	// ...and this is how the popover is removed
	function removePopover(e){
		try {
			obj.$el.toggleClass('active', false);
			$(document).unbind(bid.e.INTERACTIVE_EVENT, removePopover);
			$popover.remove();
		} catch(err){}
	}

	function getCSS(css){
		if (!css)
			return {};

		if (css.left == 'center') {
			var elPos = obj.$el.position();
			var elWidth = obj.$el.outerWidth();
			var popWidth = $popover.outerWidth();
			css.left = ( ( elPos.left + elWidth / 2 - popWidth / 2 ) / $('body').outerWidth() * 100 ) + '%';
		}
		return css;
	}
}
