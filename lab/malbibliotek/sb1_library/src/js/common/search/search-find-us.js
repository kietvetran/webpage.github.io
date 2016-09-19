var solr = require('./solr')();
var util = require('./search-util')();
var spellchecking = require('./search-spellchecking')();
var facets = require('./search-facets')();

var _ = require('lodash');

module.exports = function() {
    /*jshint camelcase: false */
    var $searchButton    = $('.appended-section .sec-find-us .search-button'),
        $searchField     = $('.appended-section .sec-find-us .search-field'),
        $results         = $('.appended-section .sec-find-us .search-results'),

        $spellchecking   = $('.appended-section .sec-find-us .spellchecking'),
        $facets        = $('.appended-section .sec-find-us .tags.facets'),

        servicesTemplate    = $('.hidden-templates .services-template').html(),
        bankRowTemplate     = $('.hidden-templates .search-findus-bank-template').html(),
        adviserRowTemplate  = $('.hidden-templates .search-findus-adviser-template').html(),
        spellCheckTemplate  = $('.hidden-templates .spellcheck-template').html(),

        currentFacet = '',

        currentTerm = '',
        currentResults = 0,
        searchType = 'finn min bank',

        currentPage      = 0;


    function toggleMoreInfo (result) {
        result.siblings().attr('aria-expanded', false).removeClass('active').find('.result-description').slideUp();
        result.toggleClass('active').toggleAttr('aria-expanded').find('.result-description').slideToggle();
    }

    function searchFieldKeyUpHandler( e) {

        if( util.isNotIgnored( e.keyCode ) ) {

            search({
                term: $searchField.val(),
                updateFacet: true
            });
        }
    }


    function searchFieldKeyDownHandler( e) {

        spellchecking.keyDownHandler( e, function() {

            var currentSelection = spellchecking.getCurrent();

            if( currentSelection && currentSelection !== "") {
                // This anonymous function is called when user
                // clicks up or down arrow on the keyboard
                search({
                    term: currentSelection,
                    noSpellChecking: true,
                    updateFacet: true
                });
            }
        });
    }

    function search( query ) {

        // Add page context to the query
        query.facetFields = [ util.solr('services') ];
        query.localBank = true;

        if( query.term === "" ) { // clear search results
            clearSearch();
        } else { // update results
            solr.query( query , processResults, processError ); 
        }
    }


    function clearSearch() {
        
        spellchecking.clear();
        $facets.children().remove();
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
                $searchField.val( targetElement.text().trim() );
                $searchButton.click();
            });
        }

        // Only update if there search results
        if( util.hasSearchResults( query, res ) ) {
            // Update UI dynamically with search results
            updateSearchResult( query, res.response.docs );
        }

        // Only update facet count for full search
        if( util.isFacetable( query, res ) ) {

            if( query.updateFacet ) {
                // Update first level facets dynamically
                facets.update({
                    $container: $facets,
                    facets: res.facet_counts.facet_fields[ util.solr('services') ],
                    count: res.response.numFound,
                    handler: facetClickHandler
                });
            }
        }

        // Highlight correct tags
        facets.toggleActiveTag( $facets, currentFacet );

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
            $results.find('.result-row-find-us').remove();
            currentPage = 0;
        }

        var resultHTml = '';
        // Run through the results and accumulate html as string
        searchData.forEach( function( resultRow) {
            resultHTml += getSearchRowHTML( resultRow);
        });

        $results.append( resultHTml);

        updateMapLinks();

        util.trackLastSearchRow( getLastSearchRow() );

    }

    function updateMapLinks() {

        $results.find('.address-link').each( function() {
            var $this = $(this);
            $this.attr( 'href', $this.attr( 'href') + $this.attr( 'data-address') );
        });
    }

    function getSearchRowHTML( resultRow ) {
        
        if( resultRow[ util.solr('services') ] ) {
            return getBankRowHtml( resultRow );
        } else {
            return getAdviserRowHtml( resultRow );
        }
    }

    function getBankRowHtml( resultRow ) {

        var servicesHtml = getMoreInfo( resultRow[ util.solr('services')] || [] );

        return bankRowTemplate
            .replace(/\#{{link}}/g, resultRow.id || '' )
            .replace(/{{title}}/g, resultRow[ util.solr('title') ] || '' )
            .replace(/{{description}}/g, resultRow[ util.solr('description') ] || '' )
            .replace(/{{services}}/g, servicesHtml || '' )
            .replace(/{{officeAddress}}/g, resultRow[ util.solr( 'officeAddress')] || '' );
    }

    function getAdviserRowHtml( resultRow ) {
        
        return adviserRowTemplate
            .replace(/\#{{link}}/g, resultRow.localbanklink_t || '' )
            .replace(/{{title}}/g, resultRow[ util.solr('title') ] || '' );
    }

    function getMoreInfo ( services ) {

        var servicesHtml = '';

        services.forEach( function (val) {
            var html = servicesTemplate.replace(/{{services}}/g, val || '' );
            servicesHtml += html;
        });

        return servicesHtml;
    }

    function facetClickHandler(e) {
        e.preventDefault();
        var $this = $(this);

        // clear out any facets
        currentFacet = '';

        if ($this.parent().hasClass('filter-tag')) {
            // private or bedrift etc
            currentFacet = $this.find('.tag-name').text().trim();
            // Level search
            search({
                term: $searchField.val(),
                localBankFacet: currentFacet,
                noSpellChecking: true,
                updateFacet: false
            });

        } else {
            // clear level
            currentFacet = '';
            // Full search
            search({
                term: $searchField.val(),
                noSpellChecking: true,
                updateFacet: true
            });
        }
    }

    function getLastSearchRow() {
        return $('.appended-section .sec-find-us .search-results .result-row:last');
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
                localBankFacet: currentFacet,
                pageNumber: currentPage,
                appendResults: true
            });
        }
    }

    // Init spellchecking api with context i.e. dom elements
    spellchecking.setContext({
        $spellchecking: $spellchecking,
        $searchField: $searchField,
        $searchButton: $searchButton,
        spellCheckTemplate: spellCheckTemplate
    });

    $searchButton.on('click', function(e) {
        e.preventDefault();
        search({
            term: $searchField.val(),
            updateFacet: true
        });

        // For analytics
        util.updateDigitalData(currentTerm, currentResults, searchType);
    });

    $searchField.on( 'keyup', _.throttle( searchFieldKeyUpHandler, 700) );

    $searchField.on( 'keydown', searchFieldKeyDownHandler );

    $searchField.on( 'blur', spellchecking.clear );

    $results.on('click', '.result-row-find-us .result-title', function(e) {
        e.preventDefault();
        var result = $(this).closest('.result-row-find-us');
        toggleMoreInfo(result);
    });

};
