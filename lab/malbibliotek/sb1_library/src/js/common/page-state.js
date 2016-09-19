module.exports = function() {
	pageContext.tagVariables.split(',').forEach( function( variable) { 
		localStorage.setItem( variable, true );
	});
};