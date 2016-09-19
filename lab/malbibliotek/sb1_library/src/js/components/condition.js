module.exports = function() {
	var $conditions = $('.condition .condition-container');

	$conditions.each( function() {
		var $condition = $(this);
		var tags = $condition.attr('data-tag-variables').split(',');

		tags.forEach( function( tag ) {
			if( localStorage.getItem( tag ) ) {
				$condition.removeClass('hide');
			}
		});
	});
};