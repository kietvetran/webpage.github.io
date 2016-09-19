function AccountNumber(accountNumber) {
    this.accountNumber = accountNumber;
}

AccountNumber.prototype.isValidFormat = function() {
    return this.accountNumber.match(/^\d{4}([ .]?)\d{2}\1\d{5}/) !== null;
};


function getWeightedCrossSum(accountNumber) {
    return [5, 4, 3, 2, 7, 6, 5, 4, 3, 2].reduce(function(prev, curr, index) {
        return prev + curr * accountNumber[index];
    }, 0);
}

function getChecksum(accountNumber) {
    return 11 - getWeightedCrossSum(accountNumber) % 11;
}

function check97(accountNumber) {
    var checksum = getChecksum(accountNumber);
    var lastDigit = parseInt(accountNumber.slice(10));
    return checksum < 10 && lastDigit === checksum;
}

function parse(accountNumber) {
    return accountNumber.replace(/[ \\.]/g, '');
}

AccountNumber.prototype.isValidChecksum = function() {
    return check97(parse(this.accountNumber));
};

AccountNumber.prototype.isValid = function() {
    return this.isValidFormat() && this.isValidChecksum();
};

module.exports = AccountNumber;