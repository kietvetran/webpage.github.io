module.exports = function() {
	/*jshint camelcase: false */
	var facetTemplate = $('.hidden-templates .facet-template').html();

	var api = {

		update: function( opt) {
			// clear out existing facets
			opt.$container.children().remove();
			// generate html
			var facetsHtml = api.getFacetsHTML({
				list: opt.facets,
				count: opt.count
			});
			// add to ui
			opt.$container.append( facetsHtml );
			// first tag is not a filter i.e. Alle tag
			opt.$container.find('.tag:first').removeClass('filter-tag');
			// add click events when user click on a tag
			api.addEvents( opt.$container, opt.handler );
		},

		clear: function( $container ) {

			$container.find('li.tag')
			          .removeClass('active')
			          .first()
			          .addClass('active');

		},

		getFacetHTML: function( facet ) {

			return facetTemplate
						.replace(/{{title}}/g, facet.title || '' )
						.replace(/{{count}}/g, facet.count || 0 ).trim();
		},

		getFacetsHTML: function( facets ) {

			// Start with 'Alle' 
			var resultHTml = api.getFacetHTML({
				title: 'Alle', // TODO: i18n
				count: facets.count
			});
			
			for ( var i = 0;  i < (facets.list.length-1); i += 2 ) {

				resultHTml += api.getFacetHTML({
					title: facets.list[i],
					count: facets.list[i+1]
				});
			}

			return resultHTml;
		},

		addEvents: function ( $facetsContainer, clickHandler ) {

			$facetsContainer.find('.tag a').on( 'click', clickHandler);
		},

		toggleActiveTags: function( level, facet, $firstLevelFacets, $secondLevelFacets ) {

			api.toggleActiveTag( $firstLevelFacets, level );
			api.toggleActiveTag( $secondLevelFacets, facet );
		},

		toggleActiveTag: function( $container, tagText ) {

			$container.find('li.active').removeClass('active');

			if( tagText ) { 
				
				$container.find('li a').each( function() {
					var $this = $(this);
					
					if( $this.find('.tag-name').text().trim() === tagText ) {
						$this.parent().addClass('active');
					}
				});

			} else {
				$container.find('.tag:first').addClass('active');
			}
		}
	};

	return api;
};