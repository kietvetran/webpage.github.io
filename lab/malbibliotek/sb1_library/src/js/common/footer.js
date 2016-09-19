module.exports = function() {
	// Monitor when user focuses on a footer link.
	// If so then scroll to the bottom of the page to see the footer.
	$('.footer-bottom .links li a').on( 'focus', function() {
		window.scrollTo(0,document.body.scrollHeight);
	});

};