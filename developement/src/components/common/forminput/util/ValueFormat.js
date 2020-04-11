import { separatePhoneCountryCode } from './ValueValidation';

const _splitText = (text, split) => {
  let i = (text || '').length % split, list = i ? [text.substr(0, i)] : [];
  for (i; i < text.length; i += split) {
    list.push(text.substr(i, split));
  }
  return list;
};

export const noFormatCurrency = (value) => {
    if ( ! value ) { return value; }
    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
};

/******************************************************************************
  Mobile and phone formatter
******************************************************************************/
const _phoneSplit = (text, switcher) => {
    let separated = separatePhoneCountryCode(text);
    if (separated[0] === '+47 ') { // Norway
        switcher = [3, 2];
    } else if (separated[0] === '+45 ') { // Denmark
        switcher = [2, 2];
    } else if (separated[0] === '+46 ') { // Sweden
        switcher = null;
    }

    let a = separated[1].split(''), list = [];
    if (switcher) {
        let t = switcher[0], j = 0;
        for (let i = 0; i < a.length; i++) {
            if (!list[j]) { list[j] = ''; }

            list[j] += (a[i] + '');
            if (--t === 0) {
                t = list[j].length === switcher[0] ? switcher[1] : switcher[0];
                j = j + 1;
            }
        }
    }
    return separated[0] + (list.length ? list.join(' ') : a.join(''));
}

export const formatPhone = (value, country) => {
    if ( ! value ) { return value; }
    let text = (value+'').replace(/[\s\-]+/g, '');
    let option = {'no': [3,2], 'sv': null, 'da': null};
    let switcher = option[country] || option.no;
    return _phoneSplit(text, switcher);
};

/******************************************************************************
  Amount formatter
******************************************************************************/
export const formatAmount = (value) => {
    if ( ! value ) { return value; }
    let text = (value+'').replace(/[\s\-]+/g, '');
    return _splitText(text, 3).join(' ');
};

/******************************************************************************
  Personalid formatter
******************************************************************************/
export const formatPersonalId = (value, country) => {
    if (!value) { return value; }
    let text = (value+'').replace(/[\s\-]+/g, '');
    let option = {'no': ' ', 'sv': '-', 'da': '-'};  
    let separator = option[country] || option.no;
    return text.length <= 6 ? text :
        (text.substring(0, 6) + (separator || ' ') + text.substring(6));
};

/******************************************************************************
  Bank account formatter
******************************************************************************/
export const formatBankAccount = (value, country) => {
    if (!value) { return value; }
    let text = (value+'').replace(/[\s\-]+/g, '');
    let option = {'no': ' ', 'sv': ' ', 'da': ' '};  
    let separator = option[country] || option.no;
    return text.length <= 6 ? text :
        (text.substring(0, 4) + (separator || '') + text.substring(4,6) + (separator || '') + text.substring(6));
};

/******************************************************************************
  Card number formatter
******************************************************************************/
export const formatCardnumber = (value) => {
    if (!value) { return value; }
    let text = (value+'').replace(/[\s\-]+/g, '');
    return [text.substring(0, 4), text.substring(4, 8), text.substring(8, 12), text.substring(12, 16)]
        .join(' ').replace(/\s+/g, ' ').replace(/\s+$/g, '');
};

/******************************************************************************
  organization formatter
******************************************************************************/
export const formatOrganization = (value, country) => {
    if (!value) { return value; }
    let text = (value+'').replace(/[\s\-]+/g, '');
    let option = {'no': ' ', 'sv': '-', 'da': ''};
    let separator = option[country] || option.no;
    return text.length <= 6 ? text :
        (text.substring(0, 3) + (separator || '') + text.substring(3, 6) + (separator || '') + text.substring(6));
}

/******************************************************************************
  convertNumberToWordNo
******************************************************************************/
const _convertNumberToWord = (th, dg, tn, tw, hr, number) => {
    let s = number.toString();
    s = s.replace(/[\,\s]+/g,'');
    if (s != parseFloat(s)) return 'not a number';
    let x = s.indexOf('.');
    if (x === -1)
        x = s.length;
    if (x > 15)
        return 'too big';
    let n = s.split('');
    let str = '', sk = 0, isHr = false;

    for (let i=0; i < x;  i++) {
        if ((x-i)%3===2) {
            if (n[i] === '1') {
                str += tn[Number(n[i+1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i]!=0) {
                str += tw[n[i]-2] + ' ';
                sk = 1;
            }
        } else if (n[i]!=0) { // 0235
            isHr = (x-i)%3===0;
            str += (isHr || ( (x-i)%3===1 && ((x-i-1)/3)<2)) && n[i] === '1' ? 'ett ' : dg[n[i]] +' ';
            if ( isHr ) {
                str += hr+' ';
            }
            sk=1;
        }

        if ((x-i)%3===1) {
            if (sk) {
                str += th[(x-i-1)/3] + ' ';
            }
            sk=0;
        }
    }

    if (x != s.length) {
        let y = s.length;
        str += 'point ';
        for (let i=x+1; i<y; i++)
            str += dg[n[i]] +' ';
    }
    return str.replace(/\s+/g,' ');
};

export const convertNumberToWordNO = ( number ) => {
    let th = ['','thousand','million', 'billion','trillion'];
    let dg = ['zero','one','two','three','four', 'five','six','seven','eight','nine'];
    let tn = ['ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'];
    let tw = ['twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
    return _convertNumberToWord(th, dg, tn, tw, 'hundret', number);
};

export const convertNumberToWordSV = ( number ) => {
    let th = ['','tusen','miljon', 'miljard','biljon'];
    let dg = ['noll','en','två','tre','fyra', 'fem','sex','sju','åtta','nio'];
    let tn = ['tio','elva','tolv','tretton', 'fjorton','femton','sexton', 'sjutton','arton','nitton'];
    let tw = ['tjugo','trettio','fyrtio','femtio', 'sextio','sjuttio','åttio','nittio'];
    return _convertNumberToWord(th, dg, tn, tw,'hundra', number);
};

export const convertNumberToWordDA = ( number ) => {
    let th = ['','thousand','million', 'billion','trillion'];
    let dg = ['zero','one','two','three','four', 'five','six','seven','eight','nine'];
    let tn = ['ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'];
    let tw = ['twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
    return _convertNumberToWord(th, dg, tn, tw, 'hundret', number);
};
