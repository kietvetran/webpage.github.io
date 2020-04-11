const mod11OfNumberWithControlDigit = (text) => {
    let controlNumber = 2, sumForMod = 0, i;
    for (i = text.length - 2; i >= 0; --i) {
        sumForMod += text.charAt(i) * controlNumber;
        if (++controlNumber > 7) { controlNumber = 2; }
    }
    let result = (11 - sumForMod % 11);
    return result === 11 ? 0 : result;
};

/******************************************************************************
  Number validation
******************************************************************************/
export const validateNumber = ( value, notBeginWithZero ) =>{
    let text = ((value || '') + '').replace(/\s+/g, '');
    if ( ! text.match(/^[0-9]+$/) ) { return false; }
    if ( notBeginWithZero && text.match(/^0$/) ) { return false; }
    return true;
};

/******************************************************************************
  Birthday validation
******************************************************************************/
const _parseMatchedDate = (list) => {
    return list.map((value) => {
        return parseInt((value + '').replace(/^0/, ''), 10);
    });
};

const _controlBirthday = (date, year, month, day) => {
    let now = new Date();
    if (date.getTime() >= now.getTime()) { return false; }

    let difference = now.getFullYear() - date.getFullYear();
    if (difference >= 100) {
        let newYear = date.getFullYear() + (100 * parseInt((difference / 100), 10));
        date.setFullYear(newYear);
        date.setMonth((month - 1));
        date.setDate(day);
        if (date.getTime() >= now.getTime()) { return false; }
    }

    let converted = (date.getFullYear() + '').substring(2);
    let parsed = parseInt(converted.replace(/^0/, ''), 10);
    return day === date.getDate() && month === (date.getMonth() + 1) && year === parsed;
};

export const validateBirthday = (value) => {
    let text = ((value || '') + '').replace(/[\s\-]+/g, '');
    let matched = text ? text.match(/^(\d{2})(\d{2})(\d{2})/) : null;
    if (!matched) { return false; }

    let list = _parseMatchedDate(matched), now = new Date();
    let date = new Date(list[3], list[2] - 1, list[1], 0, 0, 0);
    let valid = _controlBirthday(date, list[3], list[2], list[1]);
    return valid;
};

/******************************************************************************
  Mobile validation
******************************************************************************/
export const separatePhoneCountryCode = (text) => {
    if (!text) { text = ''; }
    let out = ['', text];
    if (text.match(/^\+/)) {
        out[0] = '+';
        out[1] = out[1].replace(/^\+/, '');
        let splited = out[1].split('');
        if (splited.length > 2) {
            out[0] += splited.shift() + splited.shift() + ' ';
            out[1] = splited.join('');
        }
    }
    return out;
}

export const validatePhone = (value, country) => {
    let text = ((value || '') + '').replace(/\s+/g, '');
    let option = {'no': [8], 'sv': [9,11], 'da': [8]};
    let interval = option[country] || option.no;

    let separated = separatePhoneCountryCode(text);
    if (separated[0] === '+46 ') { interval = [9, 11]; }

    let length = separated[1].replace(/\s+/g, '').length;
    return interval[1] ? (
        interval[0] <= length && interval[1] > length
    ) : interval[0] === length;
};

/******************************************************************************
  Amount validation
******************************************************************************/
export const validateAmount = (value) => {
    return validateNumber(value, true);
};

/******************************************************************************
  bankAccount validation
******************************************************************************/
export const validateBankAccount = (value) => {
    let text = (value || '').replace(/[\s\-]+/g, '');
    if (text.length !== 11 || !text.match(/^[0-9]+$/)) { 
        return false
    }
    return true
};

/******************************************************************************
  peronalId validation
******************************************************************************/
export const validatePersonalId = (value, country) => {
    let text = ((value || '') + '').replace(/[\s\-]+/g, '');
    if ( ! validateNumber(text) ) { return false; }

    let option = {'no': 11, 'sv': 10, 'da': 10};
    let test = option[country] ? text.length === option[country] :
        text.length === option.no;

    return test && validateBirthday(text.substring(0, 6),country);
};

/******************************************************************************
  organization validation
******************************************************************************/
export const validateOrganization = (value, country) => {
    let text = ((value || '') + '').replace(/\s+/g, '');
    if ( ! validateNumber(text) ) { return false; }

    let option = {'no': 9, 'sv': 10, 'da': 8};
    return option[country] ? text.length === option[country] :
        text.length === option.no;
};

/******************************************************************************
  Email validation
******************************************************************************/
export const validateEmail = (value) => {
    let text = ((value || '') + '').replace(/\s+/g, '');
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test( text );
};

/******************************************************************************
  Country code validation
******************************************************************************/
export const validateCountryCode = (value) => {
    let text = ((value || '') + '').replace(/\s+/g, '');
    return /^\+([0-9]{2}(\s+)?|[0-9]{3})$/i.test( text );
};

/******************************************************************************
  URL validation
******************************************************************************/
export const validateURL = (value) => {
    let text = ((value || '') + '').replace(/\s+/g, '');
    return /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/ig.test(text);
};