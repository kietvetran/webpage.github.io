module.exports = function() {	
	// This directive will add target attribute to links
	// that contain 'new-window=true' as a query param
	$('a[ href *= "new-window=true" ]').each( function() {
		// set target to _blank, browser will launch link in a new window.
		$(this).attr( 'target', '_blank');
	});
};
