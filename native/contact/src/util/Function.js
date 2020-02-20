/******************************************************************************
******************************************************************************/
export const getShortname = (name) => {
  if (! name) { return ''; }

  let splited = name.trim().split(' '), out = '';
  if (splited.length === 1) {
    out = name.substring(0,4);
  } else {
    out = splited[0].substring(0,3) + ' '+ splited[1].substring(0,1);
  }
  for (let i=out.length; i<5; i++) {out += ' ';}
  return out.toUpperCase();
};

/******************************************************************************
******************************************************************************/
export const createRegexp = (text, g, i, b, f) => {
  if (text == '*') { return /.*/; }
  //let v = text.replace( /[&/\\#,+()$~%.'':*?<>{}]/g, '');
  let v = text.replace(/\*/, '.*').replace(/\+/g, '\\+')
    .replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\?/g, '\\?').replace(/-/g, '\\-').replace(/\$/g, '\\$');
    
  let m = (g && i) ? 'gi' : ((g || i) ? (g ? 'g' : 'i') : '');
  let s = b ? (b === 2 ? '^' : (b === 3 ? '(^|/|\\s+|,|\\()' : (b === 4 ? '(^|,\\s+)' : '(^|/|\\s+)'))) : '';
  let e = f ? (f === 2 ? '$' : (f === 3 ? '($|/|\\s+|,|\\))' : '($|/|\\s+)')) : '';
  return new RegExp(s+'('+v+')'+e, m);
};

/******************************************************************************
******************************************************************************/
export const sortList = (list, field, decreasing, numberTest) => {
  let keys = field instanceof Array ? field : [field];
  let i =0, length = keys.length;
  return list ? list.sort((a,b) => {
    let z = 0, x = '', y = '';
    for (i=0; i<length; i++) {
      x = (a[keys[i]] || (numberTest ? '0': '')) + '';
      y = (b[keys[i]] || (numberTest ? '0': '')) + '';
      //if ( dateFormat ) { console.log('== X =='); console.log('x value => ' +x); console.log('y value => ' +y);}

      if (numberTest && ! x.match(/^[a-z]/i) && ! y.match(/^[a-z]/i)) {
        x = parseFloat(x);
        y = parseFloat(y);
      }

      z = ((x < y) ? -1 : ((x > y) ? 1 : 0));
      if (z !== 0) { i = length; }
    }

    let v = z * (decreasing ? -1 : 1);
    return v;
    //return (v * (dateFormat ?  -1 : 1));
  }) : [];
};

/******************************************************************************
******************************************************************************/
export const isBirthday = (date) => {
  let note = (date || '').trim().split('-').map( (v) => parseInt(v.replace(/^0/g, '')) );
  let now = new Date(), data = [now.getFullYear(), now.getMonth()+1, now.getDate()];
  return data[1] === note[1] && data[2] === note[2] ? (data[0] - note[0]) : 0;
};

/******************************************************************************
******************************************************************************/
export const isNewEmployee = ( date, limit = (1000 * 60 * 60 * 24 * 31) ) => {
  let note = (date || '').trim().split('-').map( (v) => parseInt(v.replace(/^0/g, '')) );
  let now = new Date(), info = new Date(note[0], (note[1] - 1), note[2],0,0,0,0);
  return info.getTime() > now.getTime() - limit;
};

/******************************************************************************
******************************************************************************/
export const splitText = (text, split) => {
  let i = (text || '').length % split, list = i ? [text.substr(0, i)] : [];
  for (i; i < text.length; i += split) {
    list.push(text.substr(i, split));
  }
  return list;
};

/******************************************************************************
******************************************************************************/
export const separatePhoneCountryCode = (text) =>{
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

/******************************************************************************
******************************************************************************/
export const convertDateToText = ( date, separator, clock, americanFormat, clockSeparation ) => {
  let s = typeof(separator)==='undefined' || separator === null ? (
    americanFormat ? '-' : '.'
  ) : separator;
  let l = [date.getDate(),date.getMonth()+1,date.getFullYear()], i = 0;
  if ( americanFormat ) {
    let y = l[2];
    l[2] = l[0];
    l[0] = y;
  }

  for ( i=0; i<l.length; i++ ) {
    if ( l[i] < 10 ) { l[i] = '0'+l[i]; }
  }

  let out = l.join( s );
  if ( ! clock ) { return out; }

  l = [date.getHours(), date.getMinutes()];
  for ( i=0; i<l.length; i++ ) {
    if ( l[i] < 10 ) { l[i] = '0'+l[i]; }
  }
  return out + (clockSeparation || ' ') + l.join(':');
}

/******************************************************************************
******************************************************************************/
export const convertTextToDate = ( text ) => {
  let r = /^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.](\d{4})(\s+(([0-1]\d)|(2[0-3])):([0-5]\d):([0-5]\d))?/;
  let t = (text ||'').replace( /^\s+/,'').replace( /\s+$/,'');
  let m = t.match( r ), s = null;
  if ( m ) {
    s = [m[3], m[2], m[1], m[5], m[8], (m[9]|| '0'), '0'];
  } else {
    r = /^(\d{4})[\/\-\.](0?[1-9]|1[012])[\/\-\.]([0][1-9]|[12][0-9]|3[01])(\w+(([0-1]\d)|(2[0-3])):([0-5]\d):([0-5]\d))?/;
    m = t.match( r );
    if ( m ) {
      s = [m[1], m[2], m[3], m[5], m[8], (m[9]|| '0'), '0'];
    }
  }

  if ( ! s ) { return; }

  for ( let i=0; i<s.length; i++ ) {
    s[i] = parseInt( ((s[i] || '').replace( /^0/, '' ) || '0'), 10);
  }
  let date = new Date(s[0],s[1]-1,s[2],s[3],s[4],s[5],s[6]);
  return wantTimestamp ? date.getTime() : date;
}