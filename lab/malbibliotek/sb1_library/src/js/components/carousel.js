require('../plugins/owl.carousel');

module.exports = function() {
	$(".owl-carousel").owlCarousel({
		navigation : false, // Show next and prev buttons
		slideSpeed : 300,
		paginationSpeed : 400,
		singleItem:true
	}).each( function( i, owl) {

		var cWrap = $(owl).closest('.carousel-wrap');
		var iOwl = $(owl).data('owlCarousel');
		
	 	cWrap.children('.carousel-prev').on( 'click', function(event) {
            event.preventDefault();
			iOwl.prev();
		});

		cWrap.children('.carousel-next').on( 'click', function(event) {
            event.preventDefault();
			iOwl.next();
		});
 	
	});

	// Hide carousel content by default
	$('.carousel-wrap-edit .carousel-content').hide();
	$('.carousel-wrap-edit .carousel-collapse').hide();
	// If in edit mode then add collapse and expand functionality
	$('.carousel-wrap-edit .carousel-expand').each( function( idx, value) {
		// When clicking on expand
		$(value).on( 'click', function( event) {

			event.preventDefault();
			
			// Add expand functionality
			var $this = $(this);
			$this.removeClass('dispNone');
			$this.closest('.carousel-wrap-edit').children('.carousel-content').show();
			$this.hide();
			$this.siblings('.carousel-collapse').show();
		});
	});

	$('.carousel-wrap-edit .carousel-collapse').each( function( idx, value) {
		// When clicking on collapse
		$(value).on( 'click', function( event) {
			event.preventDefault();
			
			// Add collapse functionality
			var $this = $(this);
			$this.removeClass('dispNone');
			$this.closest('.carousel-wrap-edit').children('.carousel-content').hide();
			$this.hide();
			$this.siblings('.carousel-expand').show();
		});
	});
};	