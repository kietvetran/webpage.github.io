require('./plugins/owl.carousel');

$(document).ready(function() {

	var owl = $(".owl-carousel").owlCarousel({
		navigation : false, // Show next and prev buttons
		slideSpeed : 300,
		paginationSpeed : 400,
		singleItem:true
	}).each( function( i, owl) {

		var cWrap = $(owl).closest('.carousel-wrap');
		var iOwl = $(owl).data('owlCarousel');
		
	 	cWrap.children('.carousel-prev').on( 'click', function(e) {
            e.preventDefault();
			iOwl.prev();
		});

		cWrap.children('.carousel-next').on( 'click', function(e) {
            e.preventDefault();
			iOwl.next();
		});
 	
	});

	// Hide carousel content by default
	$('.carousel-wrap-edit .carousel-content').hide();
	$('.carousel-wrap-edit .carousel-collapse').hide();
	// If in edit mode then add collapse and expand functionality
	$('.carousel-wrap-edit .carousel-expand').each( function( idx, value) {
		// When clicking on expand
		$(value).on( 'click', function( e) {

			// Don't do what links normally do
			e.preventDefault();
			// Add expand functinoality
			var $this = $(this);
			$this.removeClass('dispNone');
			$this.closest('.carousel-wrap-edit').children('.carousel-content').show();
			$this.hide();
			$this.siblings('.carousel-collapse').show();
		});
	});

	$('.carousel-wrap-edit .carousel-collapse').each( function( idx, value) {
		// When clicking on collapse
		$(value).on( 'click', function( e) {
			// Don't do what links normally do
			e.preventDefault();
			// Add collpase functinoality
			var $this = $(this);
			$this.removeClass('dispNone');
			$this.closest('.carousel-wrap-edit').children('.carousel-content').hide();
			$this.hide();
			$this.siblings('.carousel-expand').show();
		});
	});

});	