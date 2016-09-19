var solr = require('./solr')();
var util = require('./search-util')(); 
var spellchecking = require('./search-spellchecking')();
var facets = require('./search-facets')();
var _ = require('lodash');

module.exports = function() {
	/*jshint camelcase: false */
	var $searchOverlay    = $('.search-overlay'),
	    $header           = $('.header'),
		
		$closeSearch   = $('.search-overlay .inner-wrap .close-wrap a .icon-close'),
	    $searchButton  = $('.search-overlay .inner-wrap .search-button'),
	    $searchField   = $('.search-overlay .inner-wrap .search-field'),
	    $results       = $('.search-overlay .inner-wrap .search-results'),
	  
	    $spellchecking       = $('.search-overlay .inner-wrap .spellchecking'),
	    $firstLevelFacets  = $('.search-overlay .inner-wrap .tags.first-level-facets'),
	    $secondLevelFacets = $('.search-overlay .inner-wrap .tags.second-level-facets'),

	    rowTemplate         = $('.hidden-templates .search-template').html(),
	    spellCheckTemplate  = $('.hidden-templates .spellcheck-template').html(),

	    currentLevel = '',
	    currentFacet = '',

	    currentTerm = '',
	    currentResults = 0,
	    searchType = 'global',

	    currentPage      = 0;

	// Init spellchecking api with context i.e. dom elements
	spellchecking.setContext({
		$spellchecking: $spellchecking,
		$searchField: $searchField,
		$searchButton: $searchButton,
		spellCheckTemplate: spellCheckTemplate
	});

	$closeSearch.on( 'click', function( e) {

		e.preventDefault();
		// Hide overlay
		$searchOverlay.addClass('hide');
		// Remove position 'static' from header
		// otherwise sticks to the top
		$header.removeClass('active');
		$('body').removeClass('menu-active');

	});

	$searchButton.on('click', function(e) {	
		e.preventDefault();

		search({
			term: $searchField.val(),
			updateCategory: true,
			updateLevels: true,
			clearFaceting: true
		});

		// For analytics
		util.updateDigitalData(currentTerm, currentResults, searchType);

	});

	function searchFieldKeyUpHandler( e) {

		if( util.isNotIgnored( e.keyCode ) ) {

			search({
				term: $searchField.val(),
				updateCategory: true,
				updateLevels: true,
				clearFaceting: true
			});
		}
	}

	$searchField.on( 'keyup', _.throttle( searchFieldKeyUpHandler, 700) );

	function searchFieldKeyDownHandler( e) {

		spellchecking.keyDownHandler( e, function() {

			var currentSelection = spellchecking.getCurrent();

			if( currentSelection && currentSelection !== "") {
				// This anonymous function is called when user
				// clicks up or down arrow on the keyboard
				search({
					term: currentSelection,
					noSpellChecking: true,
					updateCategory: true,
					updateLevels: true,
					clearFaceting: true
				});
			}
		});
	}

	$searchField.on( 'keydown', searchFieldKeyDownHandler );

	
	$searchField.on( 'blur', spellchecking.clear );

	function search( query ) {

		if( query.clearFaceting ) {
			currentLevel = '';
			currentFacet = '';
		}

		// Add page context to the query
		query.facetFields = [ util.solr('category'), util.solr('level') ];

		if( query.term === '' ) { // clear search results

			clearSearch();

		} else { // update results

			solr.query( query , processResults, processError );	
		}
	}

	function clearSearch() {
		
		spellchecking.clear( true);
		$firstLevelFacets.children().remove();
		$secondLevelFacets.children().remove();
		$results.children().remove();
	}

	function processResults( query, res ) {

		// for scroll paging
		util.registerOnScroll( _.throttle( onPageScrollHandler, 300 ) );

		// Don't update if user filtered on a facet
		if( util.isSpellCheckable( query, res ) ) {
			// Update UI dynamically with spellchecking from the search
			spellchecking.update( res.spellcheck.suggestions, function( targetElement ) {
				// this anonymous function is called when user clicks on a spellcheck
				$searchField.val( targetElement.text().trim() ).focus();
				$searchButton.click();	
			});
		}
		
		// Only update if there search results
		if( util.hasSearchResults( query, res ) ) {
			// Update UI dynamically with search results
			updateSearchResult( query, res.response.docs );
		}
		
		if( query.updateLevels ) {
			// Update first level facets dynamically
			facets.update({
	    		$container: $firstLevelFacets,
	    		facets: res.facet_counts.facet_fields[ util.solr( 'level') ],
	    		count: res.response.numFound,
	    		handler: firstLevelFacetHandler
	    	});
	    }

	    if( query.updateCategory ) {
	    	// Update second level facets dynamically
			facets.update({
	    		$container: $secondLevelFacets,
	    		facets: res.facet_counts.facet_fields[ util.solr( 'category') ],
	    		count: res.response.numFound,
	    		handler: secondLevelFacetHandler
	    	});
	    }

		// Highlight correct tags
		facets.toggleActiveTags( currentLevel, 
			                     currentFacet, 
			                     $firstLevelFacets, 
			                     $secondLevelFacets );

		// For Analytics
		currentTerm = query.term;
	    currentResults = res.response.numFound;
	}

	function processError( err) {
		// TODO: report error to UI
	}
 
	function updateSearchResult( query, searchData ) {
		
		// Only clear out previous data if new search
		// otherwise add results onscroll
		if( !query.appendResults ) {
			$results.find('.result-row').remove();
			currentPage = 0;
		}
		
		var resultHTml = '';
		// Run through the results and accumulate html as string
		searchData.forEach( function( resultRow) {
			resultHTml += getSearchRowHTML( resultRow);
		});
		
		$results.append( resultHTml);

		util.trackLastSearchRow( getLastSearchRow() ); 
	}

	function getSearchRowHTML( resultRow ) {

		return rowTemplate
					.replace(/\#{{link}}/g,      resultRow.id || '' )
					.replace(/{{title}}/g,       resultRow[ util.solr( 'title') ] || '' )
					.replace(/{{description}}/g, resultRow[ util.solr( 'description') ] || '' )
					.replace(/{{facet}}/g,       resultRow[ util.solr( 'category') ] || 'hide' )
					.replace(/{{level}}/g,       resultRow[ util.solr( 'level') ] || '' );
	}

	function firstLevelFacetHandler() {

		var $this = $(this);
		// clear out any facets
		currentFacet = '';
		
		if( $this.parent().hasClass('filter-tag') ) {
			// private or bedrift etc
			currentLevel = $this.find('.tag-name').text().trim();
			// Level search
			search({
				term: $searchField.val(),
				level: currentLevel,
				noSpellChecking: true,
				updateCategory: true
			});
		
		} else {
			// clear level
			currentLevel = '';
			// Full search
			search({
				term: $searchField.val(),
				noSpellChecking: true,
				updateLevels: true,
				updateCategory:true
			});
		}
	}

	function secondLevelFacetHandler() {
		
		var $this = $(this);
		
		if( $this.parent().hasClass('filter-tag') ) {
			// product or tema etc
			currentFacet = $this.find('.tag-name').text().trim();
			// Level and Facet search
			search({
				term: $searchField.val(),
				level: currentLevel,
				facet: currentFacet,
				noSpellChecking: true
			});
		
		} else {
			// clear facets
			currentFacet = '';
			// Full search
			search({
				term: $searchField.val(),
				level: currentLevel,
				noSpellChecking: true,
				updateCategory: true
			});
		}
	}

	function getLastSearchRow() {
		return $('.search-overlay .inner-wrap .search-results .result-row:last');
	}

	function onPageScrollHandler() {
		// If the last element was previously out of view port
		// AND has now come into view, then get the next page
		if( util.isLastElementVisible === false &&
			util.isElementInViewport( getLastSearchRow() ) ) {
			
			// Move one page ahead					
			currentPage += 1;

			search({
				term: $searchField.val(),
				level: currentLevel,
				facet: currentFacet,
				pageNumber: currentPage,
				appendResults: true
			});
		}
	}

	return {
		init: function() {
			// Set to empty and focus
        	$searchField.val("").focus();
        	// clear out existing data
        	clearSearch();
		}
	};
};