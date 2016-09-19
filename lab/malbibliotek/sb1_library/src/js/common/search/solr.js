/* global pageContext: true */

var util = require('./search-util')();

module.exports = function() {

	function getQuery( searchData) {

		var query = [];

		if ( searchData.term &&  searchData.term !== '' ) {
			query.push( util.formatField( 'index', searchData.term ) );
		}

		if( searchData.level && searchData.level !== '' ) {
			query.push( util.formatField( 'level', searchData.level ) );
		}

		if ( searchData.facet && searchData.facet !== '' ) {
			query.push( util.formatField( 'category', searchData.facet ) );
		}

		if ( searchData.localBankFacet && searchData.localBankFacet !== '' ) {
			query.push( util.formatField( 'services', searchData.localBankFacet ) );
		}

		if ( searchData.localBank  ) {
			query.push( '(template_t:localbankpage OR template_t:adviserpage)' );
			query.push( 'localbanklink_t:[* TO *]' ); // localbanklink_t not null

		}

		query.push( util.formatField( 'bank', pageContext.bank) );

		return query.join(' AND ');
	}

	

	function getData( searchData) {

		return { 
			wt:'json', 
			q: getQuery( searchData),
			'spellcheck.q': searchData.term, 
			suggest: true,
			'suggest.q': searchData.term,
			facet: true,
			'facet.field': searchData.facetFields,
			start: (searchData.pageNumber || 0) * (searchData.rows || 10),
			rows: searchData.rows || 10,
			fl: getResponseFields()
		};
	}

	function getResponseFields() {

		return  'id' + ' ' +
				'localbanklink_t' + ' ' + 
				util.solr('title') + ' ' + 
				util.solr('description') + ' ' + 
				util.solr('category') + ' ' + 
				util.solr('level') + ' ' + 
				util.solr('officeAddress') + ' ' + 
				util.solr('services');
	}

	function getUrl( searchData ) {

		return	'/solr/nettsider_' + 
				pageContext.language + 
				'/select';
	} 
	
	return {

		query: function( searchData, callback, errorback) {

			$.ajax({
				
				url: getUrl( searchData),
				data: getData( searchData),
				dataType: 'json',
				traditional: true,

				success: function(data) { 
					callback( searchData, data);
				},

				error: function(data) { 
					errorback( searchData, data);
				}
			});
		}
	};
};