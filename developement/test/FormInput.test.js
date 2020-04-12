const assert = require('assert');
const {getFormat, isValid} = require('../src/components/common/forminput/util/Function');

/******************************************************************************
******************************************************************************/
describe('FormInput - Function - getFormat', () => {
	const formatTestList = [
		{'format': 'amount',       'value': '43',               'expected': '43'       },
		{'format': 'amount',       'value': '1234',             'expected': '1 234'    },
		{'format': 'amount',       'value': '1234567',          'expected': '1 234 567'},
		{'format': 'amount',       'value': '1234567',          'expected': '1 234 567'},
		{'format': 'phone',        'value': '41474947',         'expected': '414 74 947'},
		{'format': 'person-id',    'value': '03025441523',      'expected': '030254 41523'},		
		{'format': 'bank-account', 'value': '55556677777',      'expected': '5555 66 77777'},
		{'format': 'card-number',  'value': '1111222233334444', 'expected': '1111 2222 3333 4444'},		
		{'format': 'organization', 'value': '111222333',        'expected': '111 222 333'},
	];

	formatTestList.forEach( (data, i) => {
		it( ((i+1)+': '+data.format+ ' => '+data.value), () => {
			const formated = getFormat(data.value, data.format);
			assert.equal(formated, data.expected);
	  	});
	});
});

/******************************************************************************
******************************************************************************/
describe('FormInput - Function - isValid', () => {
	const formatTestList = [
		{'format': 'amount',       'value': '43',                'expected': true },
		{'format': 'amount',       'value': '-99',               'expected': true },
		{'format': 'amount',       'value': '043',               'expected': false },
		{'format': 'amount',       'value': '0,43',              'expected': true  },
		{'format': 'amount',       'value': '-0,43',             'expected': true  },
		{'format': 'amount',       'value': '0,43,3',            'expected': false },
		{'format': 'amount',       'value': 'hei123',            'expected': false },

		{'format': 'phone',        'value': '41474947',          'expected': true  },
		{'format': 'phone',        'value': '414749474',         'expected': false },
		{'format': 'phone',        'value': '4147494',           'expected': false },

		{'format': 'person-id',    'value': '030254 41523',      'expected': true},		
		{'format': 'person-id',    'value': '070254 41523',      'expected': false},		
		{'format': 'person-id',    'value': '070254 4152',       'expected': false},

		{'format': 'bank-account', 'value': '55556677777',       'expected': true},
		{'format': 'bank-account', 'value': '55556677771',       'expected': false},
		{'format': 'bank-account', 'value': '555566777',         'expected': false},

		{'format': 'card-number',  'value': '1111222233334444',  'expected': true},
		{'format': 'card-number',  'value': '11112222333344',    'expected': false},

		{'format': 'organization', 'value': '991609407',         'expected': true},
		{'format': 'organization', 'value': '991609402',         'expected': false},
		{'format': 'organization', 'value': '99160940',          'expected': false},

		{'format': 'email',        'value': 'test.test@eika.no', 'expected': true},
		{'format': 'email',        'value': 'test@eika.io.no',   'expected': true},
		{'format': 'email',        'value': 'testeika.io.no',    'expected': false},

		{'format': 'birthday',     'value': '290200',            'expected': true },
		{'format': 'birthday',     'value': '290202',            'expected': false},
	];

	formatTestList.forEach( (data, i) => {
		it( ((i+1)+': '+data.format+ ' => '+data.value), () => {
			const formated = isValid(data.value, data.format);
			assert.equal(formated, data.expected);
	  	});
	});
});