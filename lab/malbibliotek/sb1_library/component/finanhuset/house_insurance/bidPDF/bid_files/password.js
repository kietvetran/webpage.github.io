//	_______________________________________________
//	password.js
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾

//	bid.Password
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.Password = function(obj){

	var _data = {

		// the length of the password
		length:0,

		type:'text',

		// string that gives clues about the format of the password (ie. '6 digits', '8 alpha numerical characters', etc.)
		label: '',
		// function that returns true (success) or string (error)
		validator: null,
		// string, the password
		value: null

	};

	return $.extend(_data, obj);
}

//	bid.password.fn
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Validator functions which test the validity of a given value.
bid.password.fn = {
	isEmpty: function(val){
		return val == '';
	},
	isNumber: function(val){
		var regex = /^\d+$/;
		return regex.test(val);
	},
	isLength: function(val, len){
		return String(val).length == len;
	},
	isMinLength: function(val, len){
		return String(val).length >= len;
	}
}
