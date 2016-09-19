module.exports = function() {
	/*jshint camelcase: false */
	var isOnScroll           = false,
		ignoreKeyCodes       = [ 9,13,16,17,18,
		                         19,20,27,33,34,
		                         35,36,37,38,39,
		                         40,45,46 ],
		$window              = $(window);

	var sUtil = {

		isLastElementVisible: false,

		isNotIgnored: function( keyCode ) {

			return ignoreKeyCodes.indexOf( keyCode ) === -1 ;
		},

		hasSearchResults: function( query, res) {

			var termCount = query.term.split(' ').length;

			return  (res.response && 
					res.response.docs &&
					res.response.docs.length > 0) ||
					query.facet ||
					query.level || 
					termCount === 1;
		},

		isFacetable: function( query, res) {

			return  (!query.facet ||
					query.facet === '') &&
					res.facet_counts && 
					res.facet_counts.facet_fields && 
					res.response &&
					res.response.numFound;
		},

		isSpellCheckable: function ( query, res) {

			return 	res.spellcheck && 
					res.spellcheck.suggestions && 
					!query.facet && 
					!query.noSpellChecking;
		},

		isElementInViewport: function ( el ) {

		    el = el[0];

		    if( !el ) { return false; }

		    var rect = el.getBoundingClientRect();

		    return (
		        rect.top >= 0 &&
		        rect.left >= 0 &&
		        rect.bottom <= (window.innerHeight || $window.height() ) && 
		        rect.right <= (window.innerWidth || $window.width() ) 
		    );
		},

		registerOnScroll: function ( onPageScrollHandler ) {

			if( !isOnScroll ) {

				$window.on( 'scroll', onPageScrollHandler);

				isOnScroll = true;
			}
		},

		trackLastSearchRow: function( lastElement ) {

			if( sUtil.isElementInViewport( lastElement ) ) {
				sUtil.isLastElementVisible = true;
			} else {
				sUtil.isLastElementVisible = false;
			}
		},

		unRegisterOnScroll: function () {

			$window.off( 'scroll');

			isOnScroll = false;
		},

		getTagText: function( $tag) {

			if( $tag ) {
				return $tag.text();
			}
			return null;
		},

		solr: function( field ) {
			return field + '_t_' + window.pageContext.language;
		},

		formatField: function ( name, value ) {
			return sUtil.solr( name ) + ':(' + value.trim() + ')';
		},

		updateDigitalData: function(term, results, type) {
			if (results > 0) {
				digitalData.search = {};
				digitalData.search.term = term;
				digitalData.search.results = results;
				digitalData.search.type = type;
			}
		}

	};

	return sUtil;
};