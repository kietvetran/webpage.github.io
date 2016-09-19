// private scope
// used to get the index of the param in the url inside (...)
// Where is it on the list
function getParamIndex( params, paramName) {

	var index = -1;
	params.forEach( function( param, i) {
		if( param.split('=')[0] === paramName ) {
            index = i;
        }
	});

	return index;
}

// private scope
// used to get the list of params on the url
// Expects to find (param1=value1,param2=value2,...) pattern in the url
function getParams() {
	// return any params that might available on the url
	// look for abcds/sdfsdf/(param1=value1,param2=value2)/afsdfsdfsdf?asfasdfadsf
	try {
		return location.pathname
		               .match(/\(.*\)/)[0]   // get the (...) part
		               .replace('(', '')     
		               .replace(')', '')
		               .split(',');
	} catch( e) {
		return [];
	}
}
// private scope
// update url with given params
function updateUrl( params) {
	// Remove the params syntax from the url path i.e. remove (...)
	var newPath = location.pathname.replace(/\/\(.*\)/g, '');
	// Only add the params syntax if any param is available
	if( params.length > 0 ) {
		newPath += '/(' + params.join(',') + ')';
	}
	// Update url on the browser without refreshing the window
	window.history.replaceState( null, null, newPath );
}

// public scope
// Helper util to manage location parameter of the page
// uses history api
module.exports = {
	// used to set location parameters 
	setParam: function ( name, value) {

		var newParam = name + '=' + value;
		// Get params
		var params = getParams();
		var paramIndex = getParamIndex( params, name);
		// Is it existing param or new?
		if( paramIndex !== -1 ) {
			params[ paramIndex] = newParam;
		} else {
			params.push( newParam);
		}
		// 
		updateUrl( params);

	},
	// used to get a url parameter
	getParam: function ( name) {

		var value = "";
		// Get params
		var params = getParams();
		var paramIndex = getParamIndex( params, name);
		var param = params[paramIndex];

		if( param ) {
			try { value = param.split('=')[1]; } catch( e) {}
		}
		// "" or value
		return  value;
	},
	// used to delete a url parameter
	deleteParam: function ( name) {
		// Get  params
		var params = getParams();
		var paramIndex = getParamIndex( params, name);
		// delete if found
		if( paramIndex !== -1 ) {
			params.splice( paramIndex, 1);
		}
		//	
		updateUrl( params);
	}
};