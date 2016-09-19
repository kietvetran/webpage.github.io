module.exports = function() {
	// defaults
	var opt = {
		$spellchecking: null,
		$searchField: null,
		spellCheckTemplate: null
	};

	var mouseOverSpellChecking = false; 

	var spellchecking = {

		setContext: function( context) {
			opt = context;

			spellchecking.init();
		},

		init: function() {

			opt.$spellchecking.mouseenter( function() {
				mouseOverSpellChecking = true;
			});

			opt.$spellchecking.mouseleave( function() {
				mouseOverSpellChecking = false;
			});
		},

		update: function( spellCheckingList, onClickFunction ) {
			// clear current spellchecking
			spellchecking.clear();

			var resultHTml = '';

			for ( var i = 0;  i < (spellCheckingList.length-1); i += 2 ) {

				if( spellCheckingList[i] === 'collation' ) {

					var collation = spellCheckingList[i+1];
					resultHTml += spellchecking.getSpellCheckingHTML( collation[1] || '');	
				}
			}

			if( resultHTml !== '' ) {

				opt.$spellchecking.removeClass('hide');
				opt.$searchField.addClass('search-field-border');
				opt.$spellchecking.append( resultHTml);

				opt.$spellchecking.find('.spellcheck-row').each(function() {

					$(this).on( 'click', function(){
						// Pass the element the user clicked on
						onClickFunction( $(this) );
						// clear out
						spellchecking.clear( true);
					});

				});
			}		
		},

		select: function () {

			var spellcheckText = opt.$spellchecking.find('.spellcheck-row.highlighted').text().trim();
			
			if( spellcheckText !== "" ) {
				opt.$searchField.val( spellcheckText );
			}
		},

		clear: function ( forceClear ) {

			if( !mouseOverSpellChecking || forceClear === true ) {

				opt.$spellchecking.children().remove();
				opt.$spellchecking.addClass('hide');
				opt.$searchField.removeClass('search-field-border');
			}
		},

		highlight: function( direction, onChangeFunction ) {
		
			// curently highlighted spellcheck 
			var highlighted = opt.$spellchecking.find('.spellcheck-row.highlighted');

			if( highlighted.length === 1 ) { // if already highlighted

				if( direction.up ) { // move up 
		
					highlighted.removeClass('highlighted').prev().addClass('highlighted');

				} else { // move down
					
					highlighted.removeClass('highlighted').next().addClass('highlighted');
				}

			} else { // start the highlighting

				opt.$spellchecking.find('.spellcheck-row:first').addClass('highlighted');
			}

			// results preview, run this function to update search results
			onChangeFunction();
		},

		keyDownHandler: function( e, onChangeFunction) {

			if( e.keyCode === 38 ) { // Up arrow

				spellchecking.highlight({ up:true }, onChangeFunction);
				// return false as we don't want the arrow key
				// to affect the cursor on the input field
				return false;

			} else if( e.keyCode === 40) { // down arrow

				spellchecking.highlight({ down: true }, onChangeFunction);
				// return false as we don't want the arrow key
				// to affect the cursor on the input field
				return false;

			} else if( e.keyCode === 13 ) { // enter key

				spellchecking.select();
				spellchecking.clear( true);

			} else {}
		},

		getCurrent: function() {
			return opt.$spellchecking.find('.spellcheck-row.highlighted').text().trim();
		},

		getSpellCheckingHTML: function( spellcheck ) {

			if( spellcheck !== '' ) {
				
				return opt.spellCheckTemplate
						.replace(/{{spellcheck}}/g, spellcheck );	
			} else {

				return '';
			}
		}
	};

	return spellchecking;
};