var _ = require('lodash');
var vars = require('../common/variables');

module.exports = function() {

	var $window = null,
		$header = null,
		$stickyHeader = null,
		$tables = null,
        $currentHeaderTableWrap = null,
        $currentScrollableHeaderTableWrap = null,
        $currentPinnedHeaderTableWrap = null,
		$frozenTables = null;
    
    // This function is called on load and on every resize.
    // It will work out if tables remain normal or become frozen.
    // A frozen table has it's first column frozen, for better ux in mobile
    function onResize() {

        removeStickyHeader();

        $frozenTables.each( function() {

        	var $table = $(this);

        	if( isSmallDevice() ) {

        		if( !$table.hasClass( 'split' ) ) {

        			frozenTable( $table );
        		}

        	} else {

        		if( $table.hasClass( 'split' ) ) {
        			
        			originalTable( $table );
        		}

        	}

        });
    }

    // This function freezes the first column of a given table.
    // It will clone the first column of the table and float it on top
    // of the original table i.e. the pinned table (only 1 column) will float above
    // the scrollable table.
    function frozenTable( $table ) 
    {
    	// Mark table as split
    	$table.addClass( 'split' );
    	// Switch to frozen wrapper
        $table.closest( '.table-wrapper' )
              .removeClass( 'table-wrapper' )
              .addClass( 'frozen-wrapper' );

        // Add original table to a scrollable container
        $table.wrap( '<div class="scrollable" />' );
		// Add pinned table        
        addPinnedTable( $table );
        // Add side shadow if scrolled left
        var $scrollable = $table.closest('.scrollable');
        $scrollable.on( 'scroll', _.throttle( addShadowOnScroll, 300) );
        // Add a faster scroll handler for keeping the header table synced with 
        // the body table
        $scrollable.on( 'scroll', updateScrollableHeaderOnScroll );
        $scrollable.siblings('.pinned').on( 'scroll', updatePinnedHeaderOnScroll );
    }

    // Add a shadow to the pinned table if the scrollable table has moved
    // Also update the 'sticky' header with the same shadow
    function addShadowOnScroll() {

        var scrollableDiv = $(this);

        if( scrollableDiv.scrollLeft() === 0 ) { 

            scrollableDiv.siblings( '.pinned' )
                         .removeClass( 'side-shadow' );

            // Update header too if there is one available
            $stickyHeader.find('.pinned').removeClass( 'side-shadow' );

        } else { 

            scrollableDiv.siblings( '.pinned' )
                         .addClass( 'side-shadow' );

            // Update header too if there is one available
            $stickyHeader.find('.pinned').addClass( 'side-shadow' );
        }
    }

    // Remove the pinned table i.e. return to original table
    function originalTable( $table ) {
    	
    	$table.removeClass( 'split' );
        // Switch to table wrapper and remove 'pinned' table
        $table.closest( '.frozen-wrapper' )
        	  .removeClass( 'frozen-wrapper' )
        	  .addClass( 'table-wrapper' )
        	  .find( '.pinned' ).remove();
        // remove 'scrollable'
        $table.unwrap();
    }

    // Add a pinned table on top of scrollable table
    function addPinnedTable( $table ) {

    	// Clone given table
        var $pinnedTable = $table.clone();
        // Remove caption
        $pinnedTable.find( 'caption' ).remove();
        // Strip out all children except first th/td
        $pinnedTable.find( 'td:not(:first-child), th:not(:first-child)' ).remove();
        // Update parent
        $table.closest( '.frozen-wrapper' ).append( $pinnedTable );
		// Put it on a container
        $pinnedTable.wrap( '<div class="pinned" aria-hidden="true" />' );
    }

    // Goes through each table and configures it as desired by editor.
    // CAnnot do this in Sightly due to the AEM built in 'Table dialog',
    // as it generates the html, so we have to dhtml some features in.
    function configureTables() {

    	$tables.each( function() {
    		
    		var $table = $(this);
    		var $tableBody = $table.find( 'tbody' );
    		var $config = $table.parent().siblings( '.table-config' );

            addCaption( $tableBody, $config );
    		
    		addTableHead( $table, $tableBody );

    		processConfiguration( $table, $config ); 

    		// Store 'frozen' tables in a separate variable
    		$frozenTables = $( '.table table.frozen' );

            $table.closest('.table-wrapper').on( 'scroll', updateHeaderOnScroll );
    	});
    }

    // Wrap first tr in a thead for compliance
    function addTableHead( $table, $tableBody ) {

        var $firstTrClone = $table.find('tr:first').clone();
        $( $firstTrClone ).insertBefore( $tableBody );
        $firstTrClone.wrap('<thead></thead>');
        $table.find('tbody tr:first').remove();
    }

    // Add caption for UU, but hide it visually
    function addCaption( $tableBody, $config ) {
        
        var captionHtml = '<caption class="visually-hidden" >' + 
                          $config.attr( 'data-caption' ) +  
                          '</caption>';
        $( captionHtml ).insertBefore( $tableBody );
    }

    function processConfiguration( $table, $config ) {
        // If editor wants to lock first column
        if( $config.attr( 'data-freeze' ) ) {
            $table.addClass( 'frozen' );
        } 
        // If editor wants to wrap text in data cells
        if( $config.attr( 'data-wrap-td' ) ) {
            $table.addClass( 'wrap-td' );
        }
        // If editor wants to wrap text in header cells
        if( $config.attr( 'data-wrap-th' ) ) {
            $table.addClass( 'wrap-th' );
        }
        // If editor wants sticky header
        if( $config.attr( 'data-sticky-header' ) ) {
            $table.addClass( 'sticky-header' );
        }
    }

    
    // Returns the current table that is closest to the top
    // This table will be next to have a sticky header
    // Also returns list of tables that are currenly in view
	function getCurrentTableInView() {
		
		var minTop = 10000000;
		var $topTable = null;
        var tablesInView = [];
        var quarterScreen = $window.height() / 4;

		$tables.each( function() {

			var $table = $(this);
			var rect = $table[0].getBoundingClientRect();

			if( $table.hasClass('sticky-header') && 
                rect.top < minTop && 
                rect.bottom > 0 ) {

				minTop = rect.top;
				$topTable = $table;
			}

            if ( rect.top >= 0 &&
                 rect.top <= quarterScreen ) {

                tablesInView.push( $table); 
            }
		});

		return {
            $topTable: $topTable,
            tablesInView: tablesInView
        };
	}

    function renderStickyHeader( $currentTable ) {

        // If there is a current table in view, then try to add a 
        // sticky header, otherwise clear it.
        if( $currentTable ) {

            var rect = $currentTable[0].getBoundingClientRect() || {};
            // If the top of the table has gone under the header
            // and the bottom of the table has not gone under the header,
            // then add sticky header, otherwise remove it
            if( rect.top < vars.headerHeight && 
                rect.bottom > vars.headerHeight ) {

                addStickyHeader( $currentTable );

            } else {
                removeStickyHeader();
            }

        } else {
            removeStickyHeader();
        }
    }

    // The sticky header is created by cloning the original table
    // and creating a view port only around the header part. 
    // This way the sticky header will have the same dimensions as the table
    // The sticky header is also bound to the table's scroll events, such that
    // it follows the table as the user scrolls horisontally
	function addStickyHeader( $table ) {

		if( !hasHeader() ) {
		
			var $clone = $table.closest('.table').clone();

            // Remove unneccessary elements from original table
	    	$clone.find('.title').remove();
	    	$clone.find('.table-config').remove();
	    	$clone.addClass( 'sticky-header-on');

            // Append cloned table to header
	 		$stickyHeader.parent().removeClass('hide');
            $stickyHeader.append( $clone );
            
            adjustDimensions( $table, $clone );
            
            updateOnScrollVars( $stickyHeader );
	 	}
	}

    // Make clones widths same as original table
    function adjustDimensions( $original, $clone ) {
        
        $clone.width( $original.width() );
        $clone.height( $original.find('thead').height() );
        // if pinned table
        var $bodyScrollable = $original.closest('.scrollable');
        var $bodyPinned = $bodyScrollable.siblings('.pinned');
        var $headerScrollable = $clone.find('.scrollable');
        var $headerPinned = $clone.find('.pinned');
        // Update dimensions
        $headerScrollable.width( $bodyScrollable.width() );
        $headerPinned.width( $bodyPinned.width() );
        // if normal table
        var $bodyTableWrap = $original.closest('.table-wrapper');
        var $headerTableWrap = $clone.find('.table-wrapper');
        $headerTableWrap.width( $bodyTableWrap.width() );
    }

    // Update these scope variables, they will be used by 
    // onscroll functions (for performance)
    function updateOnScrollVars( $stickyHeader ) {

        $currentHeaderTableWrap = $stickyHeader.find('.table-wrapper');
        $currentScrollableHeaderTableWrap = $stickyHeader.find('.scrollable');
        $currentPinnedHeaderTableWrap = $stickyHeader.find('.pinned');

    }

    function removeStickyHeader() {

        $stickyHeader.parent().addClass('hide');
        $stickyHeader.find('.sticky-header-on').remove();
    }

    function hasHeader() {
        return $header.find( '.sticky-header-on' ).length > 0;
    }

    // This function is called a lot in order to maintain
    // the header table with the body table in sync when scrolling.
    // Avoid doing DOM manipulation here as it will make the ux jerky.
    // Keep it very simple
    function updateHeaderOnScroll() {

        if ( $currentHeaderTableWrap ) {
            $currentHeaderTableWrap.scrollLeft( this.scrollLeft );
        }
    }

    // This function is called a lot in order to maintain
    // the header table with the body table in sync when scrolling.
    // Avoid doing DOM manipulation here as it will make the ux jerky.
    // Keep it very simple
    function updateScrollableHeaderOnScroll() {

        if ( $currentScrollableHeaderTableWrap ) {
            $currentScrollableHeaderTableWrap.scrollLeft( this.scrollLeft );
        }
    }

    // This function is called a lot in order to maintain
    // the header table with the body table in sync when scrolling.
    // Avoid doing DOM manipulation here as it will make the ux jerky.
    // Keep it very simple
    function updatePinnedHeaderOnScroll() {

        if ( $currentPinnedHeaderTableWrap ) {
            $currentPinnedHeaderTableWrap.scrollLeft( this.scrollLeft );
        }
    }

    function renderScrollIndicator( tablesInView ) {

        tablesInView.forEach( function( $table ) {
            // Try normal table
            var $parentScrollable = $table.closest('.table-wrapper');
            // If not normal table, try locked or frozen table
            if( $parentScrollable.length === 0) {
                $parentScrollable = $table.closest('.scrollable');
            }
            // If table is bigger then viewport, then show
            // scolling indicator effect.
            if ( $parentScrollable.length > 0 &&
                 !$parentScrollable.attr('data-scrolled') &&
                 $parentScrollable.hasHorizontalScrollBar() ) {

                $parentScrollable.animate({
                    scrollLeft: "120"
                }, 400, function() {
                    
                    $parentScrollable.animate({
                        scrollLeft: "0"
                    }, 400);
                });

                $parentScrollable.attr('data-scrolled', true);
            }
        });

    }

    function isSmallDevice() {
        return $window.width() < vars.smallSize;
    }

    // Determine when to show the sticky header
	function render( e) {

		var current = getCurrentTableInView();

		renderStickyHeader( current.$topTable );

        if( isSmallDevice() ) {
            renderScrollIndicator( current.tablesInView );
        }
	}

    function init() {

        $window = $(window);
        // Init some required scope variables
        $header = $('.header');
        $stickyHeader = $('.header .sticky-table-header .sticky-inner');
    
        configureTables(); 
    
        onResize();
    
        $window.on( 'resize' , _.throttle( onResize, 700 ) );
    
        $window.on( 'scroll', _.throttle( render, 200 ) );
    }

    $tables = $('.table table');

    // tables present on the page?
    if( $tables.length > 0 ) {

        init();
    }
};