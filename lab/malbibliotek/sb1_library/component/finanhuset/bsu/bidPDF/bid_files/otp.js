//	_______________________________________________
//	otp.js
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾

//	bid.OTP
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.OTP = function(obj){

	var _data = {

			// string
			name: '',

			// string, bid.otp.device object
			device: '',

			// bid.Password object
			password: null
		}
		;


	set(obj);

	function set(obj){

		// TODO: REMOVE
		try {
			// internal verification of the OTP device
			if (! _.contains(bid.otp.device, obj.device) )
				throw 'Error: no such device: ' + obj.device;

			// internal verification of password (is set)
			if (! obj.password )
				throw 'Error: no OTP password set.';			
		} catch(err){}

		$.extend(_data, obj);
	}

	return _data;

}

// 	OTP device constants (css class names)
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.otp.device = {
	//CALCULATOR: 	'otp-calculator',
	//CARD: 			'otp-card',
	MOBILE: 		'otp-bim'
}
