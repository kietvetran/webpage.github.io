/*
This code is used to adjust the left margin of the absolute positioned 
dynamic title element such that it is always centered. The challenge is to
make the text appear above the picture.
*/
var _ = require('lodash');

module.exports = function() {
	var dynamicTitle = $('.i-want-dynamic-title');
	var dynamicTitleUpdateOnWindowResize = _.debounce(function() {
		var leftMargin = ($(window).width()/2) - (dynamicTitle.width()/2);

		// Clear any inline css
		dynamicTitle.css({"left":leftMargin+"px"});
 
	}, 50);

    $( window ).resize(dynamicTitleUpdateOnWindowResize);
	
	// Call on load
	dynamicTitleUpdateOnWindowResize();
};