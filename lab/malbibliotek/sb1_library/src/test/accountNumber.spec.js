var AccountNumber = require('../js/domain/accountNumber');

describe('AccountNumber', function() {
    it('validates', function() {
        var test = {
            '0': false,
            '1234567890': false,
            '123456789012': false,
            '12345678901': false,
            '05391968391': true,
            '0539 19 68391': true,
            '0539 19.68391': false,
            '0539.19.68391': true
        };

        Object.keys(test).forEach(function(accountNumber) {
            expect(new AccountNumber(accountNumber).isValid())
                .toBe(test[accountNumber]);
        });
    });
});