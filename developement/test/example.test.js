const assert = require('assert');
const {capitalize} = require('../src/components/common/General.js');

describe('Mocha example Math Test', () => {
	it('should return 2', () => {
		assert.equal(1 + 1, 2);
  	});

	it('should return 9', () => {
		assert.equal(3 * 3, 9);
	});

	it('Capitalize', () => {
		assert.equal(capitalize('oslo'), 'Oslo');
  	});
});