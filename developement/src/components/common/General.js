let moment = require('moment');

/******************************************************************************
******************************************************************************/
export const generateId = () => {
  return 'app-' + new Date().getTime() + '-' + Math.floor(Math.random() * 10000 + 1);
}

export const capitalize = (text) => {
  //return typeof(text) === 'string' ? (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()) : '';
  if ( typeof(text) !== 'string' ) { return ''; }
  
  let reg = /^(\s+)?([a-zæøå])/, result = text.match( reg );
  if ( result && result[2] ) {
    text = text.replace( result[2], result[2].toUpperCase() );
  }
  return text;
}

/******************************************************************************
  fire
******************************************************************************/
export const fireEvent = (node, eventName) => {
  let doc = null, event = null, eventClass = '';
  if (node.ownerDocument) {
    doc = node.ownerDocument;
  } else if (node.nodeType == 9){
    doc = node;
  } else { return; }

   if (node.dispatchEvent) {
    eventClass = eventName.match( /click|mousedown|mouseup/i ) ? 'MouseEvents' :
      (eventName.match( /focus|change|blur|select/i ) ? 'HTMLEvents' : '');
    if ( ! eventClass ) { return; }

    event = doc.createEvent(eventClass);
    event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.
    event.synthetic = true; // allow detection of synthetic events
    // The second parameter says go ahead with the default action
    node.dispatchEvent(event, true);
  } else  if (node.fireEvent) {
    // IE-old school style, you can drop this if you don't need to support IE8 and lower
    event = doc.createEventObject();
    event.synthetic = true; // allow detection of synthetic events
    node.fireEvent('on' + eventName, event);
  }
};

/******************************************************************************
  full screen
******************************************************************************/
export const isFullScreen = () => {
  return (document.fullScreenElement && document.fullScreenElement !== null) ||
    (!document.mozFullScreen && !document.webkitIsFullScreen);
}

export const toggleFullScreen = ( force ) => {
  let setFull = typeof(force) === 'boolean' ? force : isFullScreen();
  if ( setFull ) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

/******************************************************************************
******************************************************************************/
export const getFormData = ( form, includeUncheck, unTrim ) => {
  let data = {}, selector = 'input, select, textarea';
  let elements = form ? form.querySelectorAll( selector ) : [];

  for ( let i = 0; i < elements.length; ++i ) {
    let element = elements[i], type = element.type;
    let name = element.name, value = unTrim ? element.value : trim(element.value, true);

    if ( type.match( /radio|checkbox/i) && name ) {
      if ( element.checked ) {
        if ( data[name] ) {
          if ( ! (data[name] instanceof Array) ) { data[name] = [data[name]]; }
          data[name].push( (value || 1) );
        } else {
          data[name] = value || 1;
        }
      } else if ( includeUncheck || type.match(/checkbox/i) ) {
        if ( data[name] ) {
          if ( ! (data[name] instanceof Array) ) { data[name] = [data[name]]; }
          data[name].push( 0 );
        } else {
          data[name] = 0;
        }
      }
    } else if ( name ) {
      if ( data[name] ) {
        if ( ! (data[name] instanceof Array) ) { data[name] = [data[name]]; }
        data[name].push( value );
      } else {
        data[name] = value;
      }
    }
  }
  return data;
}

/******************************************************************************
******************************************************************************/
export const triggerFormInputError = ( form ) => {
  let selector = 'input, select, textarea';
  let elements = form ? form.querySelectorAll( selector ) : [];
  for ( let i = 0; i < elements.length; ++i ) {
    fireEvent( elements[i], 'blur' );
  }
}


/******************************************************************************
******************************************************************************/
export const getURLquery = ( query, wantString, ignorHref, ignorQuery ) => {
  let opt = {}, key = '', list = [];
  let url = typeof(ignorHref) === 'string' ? ignorHref : (ignorHref ? '' :  window.location.href);
  //let url = ignorHref ? (typeof(ignorHref) === 'string' ? ignorHref : '') : window.location.href;
  let matched = url.replace(/\?+/g, '?').match(/^([\w\.\-\s_#%\/:]+)\?(.*)/);

  if (matched) {
    let splited = (decodeURIComponent(matched[2]) || '')
      .replace(/#\?/g, '&').split('&');

    for (let i = 0; i < splited.length; i++) {
      let m = splited[i].match(/(\w+)=(.*)/);
      if ( ! m || ! m[1] || ! m[2] ) { continue; }

      opt[m[1]] = m[2].replace(/#$/, '');

      let n = opt[m[1]].match( /^\[(.*)\]$/ );
      if ( ! n || ! n[1] ) { continue; }

      opt[m[1]] = n[1].split(',').reduce( (p,d) => {
        if ( d ) {
          try {
            p.push(JSON.parse(d));
          } catch ( error ) {
            p.push(d);
          }
        }
        return p;
      }, []);
    }
  }

  if ( query && typeof(query) === 'object' ) {
    for ( key in query ) {
      opt[key] = query[key];
    }
  }

  if ( ignorQuery && typeof(ignorQuery) === 'object' ) {
    for ( key in ignorQuery ) {
      delete(opt[key]);
    }
  }

  if ( wantString ) {
    for ( key in opt ) { list.push(key+'='+opt[key]); }
  }

  return wantString ? list.join('&') : opt;
};

/******************************************************************************
******************************************************************************/
export const getLocation = (success, error, watch) => {
  if (! navigator.geolocation || typeof(success) !== 'function') { return; }

  let option = {'enableHighAccuracy':true, 'timeout':500, 'maximumAge':0};
  return watch ? navigator.geolocation.watchPosition(success, error, option) :
    navigator.geolocation.getCurrentPosition(success, error, option);
}

/******************************************************************************
******************************************************************************/
export const getLocalStorage = ( key, parsing, decompress ) => {
  let storage = localStorage || sessionStorage || {};
  if ( ! key ) { return storage; }

  let value = storage[key] || null;
  if ( decompress && value ) { value = lzjs.decompress(value); }
  return parsing ? (value ? JSON.parse(value) : null) : value;
};

export const setLocalStorage = ( key, value, compress ) => {
  if ( ! key || ! value ) { return false; }

  let storage = getLocalStorage();
  let text = typeof(value) === 'string' ? value : JSON.stringify(value);
  storage[key] = compress ? lzjs.compress(text) : text;
  return true;
};


/******************************************************************************
******************************************************************************/
export const getIndexedDBdata = ( callback, database, key, parsing, decompress ) => {
  if ( typeof(callback) !== 'function' ) { return; }
  if ( ! database || ! key ) { return callback(); }

  let transaction = database.transaction([key],'readwrite');
  let store = transaction ? transaction.objectStore(key) : null;
  if ( ! store ) { return callback(null); }

  let request = store.get(1);
  request.onsuccess = () => {
    let value = request.result || '';
    if ( decompress && value ) { value = lzjs.decompress(value); }
    let out = parsing ? (value ? JSON.parse(value) : null) : value;
    callback( out );
  };
  request.onerror = () => { callback( null ); };
};

export const setIndexedDBdata = ( callback, database, key, value, compress ) => {
  if ( typeof(callback) !== 'function' ) { callback = ()=> { }; }
  if ( ! database || ! key ) { return callback(); }

  let transaction = database.transaction([key],'readwrite');
  let store = transaction ? transaction.objectStore(key) : null;
  if ( ! store ) { return callback(null); }
  
  let text = typeof(value) === 'string' ? value : JSON.stringify(value);
  let data = compress ? lzjs.compress(text) : text;
 
  store.delete( 1 );
  store.add( data, 1 );
  callback( true );
};

/******************************************************************************
******************************************************************************/
export const  hasClass = ( target, type ) => {
  if ( ! target ) return;
  let v = target && target.tagName ? (target.getAttribute('class') || '') : '';
  let r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
  return v.match( r ) != null;
}

/******************************************************************************
  REG
******************************************************************************/
export const createRegexp = (text, g, i, b, f) => {
  if ( text == '*' ) { return /.*/; }
  let v = text.replace( /\*/, '.*' ).replace( /\+/g, '\\+' )
    .replace( /\(/g, '\\(' ).replace( /\)/g, '\\)' ).replace( /\?/g, '\\?' ).replace( /\-/g, '\\-' ).replace( /\$/g, '\\$' );
    
  let m = (g && i) ? 'gi' : ( (g || i) ? (g ? 'g' : 'i') : '' );
  let s = b ? (b === 2 ? '^' : (b === 3 ? '(^|\/|\\s+|\,|\\()' : '(^|\/|\\s+)')) : '';
  let e = f ? (f === 2 ? '$' : (f === 3 ? '($|\/|\\s+|\,|\\))' : '($|\/|\\s+)')) : '';
  return new RegExp( s+'('+v+')'+e, m );
}

/******************************************************************************
  style
******************************************************************************/
export const getStyle = (target, strCssRule) => {
  let strValue = '';
  if( document.defaultView && document.defaultView.getComputedStyle){
    strValue = document.defaultView.getComputedStyle(target, '')
      .getPropertyValue(strCssRule);
  }
  else if(target.currentStyle){
    strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
      return p1.toUpperCase();
    });
    strValue = target.currentStyle[strCssRule];
  }
  return strValue;
}

/******************************************************************************
  getOffset
******************************************************************************/
export const getOffset = (target) => {
  let size = [0,0];
  if ( target ) {
    do {
      size[0] += target.offsetLeft || 0;
      size[1] += target.offsetTop  || 0;
      target = target.offsetParent;
    } while( target );
  }
  return size;
};

/******************************************************************************
  Event
******************************************************************************/
export const addEvent = ( callback, target, type ) => {
  if ( target ) {
    if (typeof target.addEventListener !== 'undefined' ) {
      target.addEventListener( type, callback, false );
    }
    else if (typeof target.attachEvent !== 'undefined') {
      target.attachEvent(('on'+type), callback );
    }
  }
}

export const removeEvent = ( myFunction, target, type ) => {
  if ( target ) {
    if (typeof target.removeEventListener !== 'undefined') {
      target.removeEventListener(type, myFunction);
    }
    else if (typeof target.detachEvent !== 'undefined') {
      target.detachEvent(('on'+type), myFunction);
    }
  }
}

/******************************************************************************
  === cookie ===
******************************************************************************/
export const createCookie = ( name, value, day ) => {
  if ( ! name ) return;
  let cookie = [ name+'='+(value||'') ];
  let d = new Date(), expires = day || 1000;
  d.setTime( d.getTime() + (expires*24*60*60*1000) );
  cookie.push( 'expires='+d.toGMTString() );
  cookie.push( 'path=/' );
  document.cookie = cookie.join('; ');
}

export const readCookie = ( name ) => {
  let query = getURLquery();
  if ( query.ignorcookie ) { return ''; }

  let nameEQ = name + '=', ca = document.cookie.split(';');
  for ( let i=0; i<ca.length; i++ ) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return '';
}

export const eraseCookie = ( name ) => {
  return createCookie( name, '', -1 );
}

/******************************************************************************
  === ===
******************************************************************************/
export const getCalendarName = () => {
  return ['Januar','Februar','Mars','April','Mai','Juni','Juli','August','September','Oktober','Novmber','Desember'];
}

export const getWeekName = () => {
  return ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'];
}

/******************************************************************************
  getWindowSize
******************************************************************************/
export const getWindowSize = () => {
  let size = [0, 0];
  if( ! window.innerWidth ) { // IE
    if( !(document.documentElement.clientWidth === 0) ){
      size[0] = document.documentElement.clientWidth;
      size[1] = document.documentElement.clientHeight;
    }  else {
      size[0] = document.body.clientWidth;
      size[1] = document.body.clientHeight;
    }
  } else {
    size[0] = window.innerWidth;
    size[1] = window.innerHeight;
  }
  return size;
};

/******************************************************************************
  clear windown selection
******************************************************************************/
export const clearSelection = () => {
  if ( window.getSelection ) {
    window.getSelection().removeAllRanges();
  } else if ( document.selection ) {
    document.selection.empty();
  }
}

/******************************************************************************
******************************************************************************/
export const getCenterBetweenPoints = ( pointA, pointB ) => {
  if ( isNaN(pointA[0]) || isNaN(pointA[1]) || isNaN(pointB[0]) || isNaN(pointB[1]) ) {
    return 9999991;
  }
  return [ ((pointA[0]+pointB[0])/2), ((pointA[1]+pointB[1])/2)];
}

export const getDistanceBetweenPoints = ( pointA, pointB ) => {
  if ( isNaN(pointA[0]) || isNaN(pointA[1]) || isNaN(pointB[0]) || isNaN(pointB[1]) ) {
    return 9999991;
  }

  let difference = (a, b) => {
    return (a > b) ? (a - b) : (b - a);
  };

  let deltaX = difference(pointA[0], pointB[0]);
  let deltaY = difference(pointA[1], pointB[1]);
  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}

export const getKmDistanceBetweenPositions = (positionA, positionB) => {
  if ( ! positionA || ! positionB || isNaN(positionA.lat) || isNaN(positionA.lng) || isNaN(positionB.lat) || isNaN(positionB.lng) ) {
    return 9999992;
  }

  let deg2Rad = (deg) => { return deg * Math.PI / 180; }
  let radius  = 6371;
  let dLat    = deg2Rad(positionB.lat - positionA.lat);
  let dLon    = deg2Rad(positionB.lng - positionA.lng);

  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2Rad(positionA.lat)) * Math.cos(deg2Rad(positionB.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (radius * c); // distance in km
}

/******************************************************************************
******************************************************************************/
export const getClosestParent = ( target, what) => {
  if ( ! target || ! what ) { return; }

  let key    = what.replace( /^\#/, '');
  let check  = what.match( /^\#/ ) ? 'id' : 'class';
  let verify = ( parent, type, specific ) => {
    if ( ! parent || (parent.tagName||'').match(/^html/i) ) {return;}

    if ( specific && typeof(parent.getAttribute) === 'function' ) {
      let t = parent.getAttribute('id')==type;
      return t ? parent : verify( parent.parentNode, type, specific );
    }

    return hasClass(parent,type) ? parent :
      verify( parent.parentNode, type, specific );
  };
  return verify( target, key, (check === 'id') );
}

/******************************************************************************
******************************************************************************/
export const getParentScroll = ( target, max = 1000 ) => {
  let parent = target ? target.parentNode : null, out = [0,0];
  let done = false, scrolled = [0,0];
  while ( !! parent && (--max > 0) ) {
    done = parent.tagName.match( /^body$/i ) ? true : false;
    scrolled = done ? getDocumentScrollPosition() :
      [parent.scrollLeft || 0, parent.scrollTop  || 0];

    out[0] += scrolled[0];
    out[1] += scrolled[1];
    parent =  done ? null : parent.parentNode;
  }
  return out;
}

export const getDocumentScrollPosition = () => {
  if (typeof window.pageYOffset !== 'undefined') {
    return [ window.pageXOffset, window.pageYOffset ];
  }

  if (
    typeof document.documentElement.scrollTop !== 'undefined' &&
    document.documentElement.scrollTop > 0
  ) {
    return [
      document.documentElement.scrollLeft,
      document.documentElement.scrollTop
    ];
  }

  return typeof document.body.scrollTop !== 'undefined' ? [
    document.body.scrollLeft, document.body.scrollTop
  ] : [0,0];
}

export const scrollBodyTop = ( where ) => {
  document.body.scrollTop = document.documentElement.scrollTop =
    where && (! isNaN(where) ) && where > 0 ? where : 0;
}

/******************************************************************************
******************************************************************************/
export const trim = ( text, multipleWhiteSpace ) => {
  let out = ((text || '')+'').replace( /^\s+/, '').replace( /\s+$/g, '');
  return multipleWhiteSpace ? out.replace( /\s+/g, ' ' ) : out;
}

/******************************************************************************
******************************************************************************/
export const convertKelvinToCelsius = ( value ) =>  {
  let number = value && typeof(value) === 'number' ? (value - 273.15) : 0;
  return number ? Math.round((number-.5)) : 0;
}

/******************************************************************************
******************************************************************************/
export const convertGeometryToLatLng = (xPoint, yPoint) => {
  let mPI = Math.PI;
  let originShift = 2 * mPI * 6378137 / 2.0;

  let lon = (xPoint / originShift) * 180.0;
  let lat = (yPoint / originShift) * 180.0;

  lat = 180 / mPI * (2 * Math.atan( Math.exp( lat * mPI / 180.0)) - mPI / 2.0);

  return { 'lat' : lat, 'lng': lon };
}

export const convertCoordinateToLatLng = (easting, northing, zone=32, northernHemisphere=true) =>  {
  if (!northernHemisphere){ northing = 10000000 - northing; }

  let a = 6378137;
  let e = 0.081819191;
  let e1sq = 0.006739497;
  let k0 = 0.9996;

  let arc = northing / k0;
  let mu = arc / (a * (1 - Math.pow(e, 2) / 4.0 - 3 * Math.pow(e, 4) / 64.0 - 5 * Math.pow(e, 6) / 256.0));

  let ei = (1 - Math.pow((1 - e * e), (1 / 2.0))) / (1 + Math.pow((1 - e * e), (1 / 2.0)));

  let ca = 3 * ei / 2 - 27 * Math.pow(ei, 3) / 32.0;

  let cb = 21 * Math.pow(ei, 2) / 16 - 55 * Math.pow(ei, 4) / 32;
  let cc = 151 * Math.pow(ei, 3) / 96;
  let cd = 1097 * Math.pow(ei, 4) / 512;
  let phi1 = mu + ca * Math.sin(2 * mu) + cb * Math.sin(4 * mu) + cc * Math.sin(6 * mu) + cd * Math.sin(8 * mu);

  let n0 = a / Math.pow((1 - Math.pow((e * Math.sin(phi1)), 2)), (1 / 2.0));

  let r0 = a * (1 - e * e) / Math.pow((1 - Math.pow((e * Math.sin(phi1)), 2)), (3 / 2.0));
  let fact1 = n0 * Math.tan(phi1) / r0;

  let _a1 = 500000 - easting;
  let dd0 = _a1 / (n0 * k0);
  let fact2 = dd0 * dd0 / 2;

  let t0 = Math.pow(Math.tan(phi1), 2);
  let Q0 = e1sq * Math.pow(Math.cos(phi1), 2);
  let fact3 = (5 + 3 * t0 + 10 * Q0 - 4 * Q0 * Q0 - 9 * e1sq) * Math.pow(dd0, 4) / 24;

  let fact4 = (61 + 90 * t0 + 298 * Q0 + 45 * t0 * t0 - 252 * e1sq - 3 * Q0 * Q0) * Math.pow(dd0, 6) / 720;

  let lof1 = _a1 / (n0 * k0);
  let lof2 = (1 + 2 * t0 + Q0) * Math.pow(dd0, 3) / 6.0;
  let lof3 = (5 - 2 * Q0 + 28 * t0 - 3 * Math.pow(Q0, 2) + 8 * e1sq + 24 * Math.pow(t0, 2)) * Math.pow(dd0, 5) / 120;
  let _a2 = (lof1 - lof2 + lof3) / Math.cos(phi1);
  let _a3 = _a2 * 180 / Math.PI;

  let latitude = 180 * (phi1 - fact1 * (fact2 + fact3 + fact4)) / Math.PI;

  if (!northernHemisphere){ latitude = -latitude; }

  let longitude = ((zone > 0) && (6 * zone - 183.0) || 3.0) - _a3;
  return { lat : latitude, lng: longitude };
}

export const convertLatLngToCoordinate = (lat, lng) => {
  if ( ! lat || ! lng ) { return; }

  let zone = parseInt( (Math.floor(lng/6+31)+'') ), letter = '';
  if (lat<-72)      { letter='C'; }
  else if (lat<-64) { letter='D'; }
  else if (lat<-56) { letter='E'; }
  else if (lat<-48) { letter='F'; }
  else if (lat<-40) { letter='G'; }
  else if (lat<-32) { letter='H'; }
  else if (lat<-24) { letter='J'; }
  else if (lat<-16) { letter='K'; }
  else if (lat<-8)  { letter='L'; }
  else if (lat<0)   { letter='M'; }
  else if (lat<8)   { letter='N'; }
  else if (lat<16)  { letter='P'; }
  else if (lat<24)  { letter='Q'; }
  else if (lat<32)  { letter='R'; }
  else if (lat<40)  { letter='S'; }
  else if (lat<48)  { letter='T'; }
  else if (lat<56)  { letter='U'; }
  else if (lat<64)  { letter='V'; }
  else if (lat<72)  { letter='W'; }
  else              { letter='X'; }

  let easting = 0.5*Math.log((1+Math.cos(lat*Math.PI/180)*Math.sin(lng*Math.PI/180-(6*zone-183)*Math.PI/180))/(1-Math.cos(lat*Math.PI/180)*Math.sin(lng*Math.PI/180-(6*zone-183)*Math.PI/180)))*0.9996*6399593.62/Math.pow((1+Math.pow(0.0820944379, 2)*Math.pow(Math.cos(lat*Math.PI/180), 2)), 0.5)*(1+ Math.pow(0.0820944379,2)/2*Math.pow((0.5*Math.log((1+Math.cos(lat*Math.PI/180)*Math.sin(lng*Math.PI/180-(6*zone-183)*Math.PI/180))/(1-Math.cos(lat*Math.PI/180)*Math.sin(lng*Math.PI/180-(6*zone-183)*Math.PI/180)))),2)*Math.pow(Math.cos(lat*Math.PI/180),2)/3)+500000;
  easting = Math.round(easting*100)*0.01;

  let northing = (Math.atan(Math.tan(lat*Math.PI/180)/Math.cos((lng*Math.PI/180-(6*zone -183)*Math.PI/180)))-lat*Math.PI/180)*0.9996*6399593.625/Math.sqrt(1+0.006739496742*Math.pow(Math.cos(lat*Math.PI/180),2))*(1+0.006739496742/2*Math.pow(0.5*Math.log((1+Math.cos(lat*Math.PI/180)*Math.sin((lng*Math.PI/180-(6*zone -183)*Math.PI/180)))/(1-Math.cos(lat*Math.PI/180)*Math.sin((lng*Math.PI/180-(6*zone -183)*Math.PI/180)))),2)*Math.pow(Math.cos(lat*Math.PI/180),2))+0.9996*6399593.625*(lat*Math.PI/180-0.005054622556*(lat*Math.PI/180+Math.sin(2*lat*Math.PI/180)/2)+4.258201531e-05*(3*(lat*Math.PI/180+Math.sin(2*lat*Math.PI/180)/2)+Math.sin(2*lat*Math.PI/180)*Math.pow(Math.cos(lat*Math.PI/180),2))/4-1.674057895e-07*(5*(3*(lat*Math.PI/180+Math.sin(2*lat*Math.PI/180)/2)+Math.sin(2*lat*Math.PI/180)*Math.pow(Math.cos(lat*Math.PI/180),2))/4+Math.sin(2*lat*Math.PI/180)*Math.pow(Math.cos(lat*Math.PI/180),2)*Math.pow(Math.cos(lat*Math.PI/180),2))/3);
  if (letter<'M') {
    northing = northing + 10000000;
  }
  northing = Math.round(northing*100)*0.01;
  return {'x': parseInt((easting+'')), 'y': parseInt((northing+'')), 'zone': zone};
}

export const isPointWrappedInArea = ( area, point, enlarge ) => {
  if ( ! area || ! point ) { return false; }

  if ( ! enlarge ) {
    return point[0] >= area.left && point[0] <= area.right && point[1] >= area.top && point[1] <= area.bottom;
  }

  let half = [enlarge[0]/2, enlarge[1]/2];
  let src  = {'left': (point[0]-half[0]), 'top':(point[1]-half[1]), 'right': (point[0]+half[0]), 'bottom': (point[1]+half[1])};
  let not  = [[src.left, src.top],[src.right, src.top],[src.right, src.bottom],[src.left, src.bottom]].find( (p) => {
    return (p[0] >= area.left && p[0] <= area.right && p[1] >= area.top && p[1] <= area.bottom) ? false : true;
  });
  return not ? false : true;
}

export const checkLineIntersection = (lineA, lineB, wantObject) => {
  let result = {'x': null, 'y': null,'onLineA': false, 'onLineB': false};
  if ( ! lineA || ! lineB ) { return wantObject ? result : false; }

  for (let i=0; i<2; i++ ) {
    for (let j=0; j<2; j++ ) {
      if ( ! (lineA[i] instanceof Array) || isNaN(lineA[i][j]) || ! (lineB[i] instanceof Array) || isNaN(lineB[i][j]) ) {
        return wantObject ? result : false;
      }
    }
  }

  let denominator = ((lineB[1][1] - lineB[0][1]) * (lineA[1][0] - lineA[0][0])) - ((lineB[1][0] - lineB[0][0]) * (lineA[1][1] - lineA[0][1]));
  if (denominator == 0) { return wantObject ? result : false; }

  let a = lineA[0][1] - lineB[0][1];
  let b = lineA[0][0] - lineB[0][0];
  let numerator1 = ((lineB[1][0] - lineB[0][0]) * a) - ((lineB[1][1] - lineB[0][1]) * b);
  let numerator2 = ((lineA[1][0] - lineA[0][0]) * a) - ((lineA[1][1] - lineA[0][1]) * b);

  a = numerator1 / denominator;
  b = numerator2 / denominator;

  result.x = lineA[0][0] + (a * (lineA[1][0] - lineA[0][0]));
  result.y = lineA[0][1] + (a * (lineA[1][1] - lineA[0][1]));

  if (a > 0 && a < 1) { result.onLineA = true; }
  if (b > 0 && b < 1) { result.onLineB = true; }

  return wantObject ? result : (result.onLineA && result.onLineB ? true : false);
};

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

export const convertTextToDate = ( text, wantTimestamp ) => {
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

export const getTimeZone = ( date ) => {
  let current =  date || new Date();
  var offset = current.getTimezoneOffset(), o = Math.abs(offset);
  return (offset < 0 ? '+' : '-') + ('00' + Math.floor(o / 60)).slice(-2) + ':' + ('00' + (o % 60)).slice(-2);
};

export const getWeekOfDate = (date, asText) => {
  if ( ! date ) { date = new Date(); }

  let onejan = new Date(date.getFullYear(),0,1);
  let number = Math.ceil((((date - onejan) / 86400000) + onejan.getDay()+1)/7);
  return asText ? ((number < 10 ? ('0'+number) : number) + '') : number;
}

export const getCalendarIntervalList = (fromDate, toDate, view, monthNames ) => {
  if ( ! view ) { view === 'monthly'; }
  if ( ! monthNames ) {monthNames = getCalendarName(); }

  let fTime = fromDate ? fromDate.getTime() : null;
  let tTime = toDate   ? toDate.getTime()   : null;
  if ( fTime === null && tTime === null ) { return;}

  let interval = [new Date(fTime), new Date(tTime)];
  if ( view === 'daily' || view === 'DAYS' ) {

  } else if ( view === 'weekly' || view === 'WEEKS' ) {
    let day = interval[0].getDay() || 7;
    interval[0].setDate((interval[0].getDate() - day + 1));

    day = interval[1].getDay() || 7;
    interval[1].setDate((interval[1].getDate() - day + 1));
  } else {
    interval[0].setDate(1);
    interval[1].setDate(1);
  }

  interval[0].setHours(0);
  interval[0].setMinutes(0);
  interval[0].setSeconds(0);
  interval[1].setHours(23);
  interval[1].setMinutes(59);
  interval[1].setSeconds(59);

  let out = [], counter = 0, weekName = getWeekName();
  while ( interval[0].getTime() <= interval[1].getTime() && (counter++) < 500 ) {
    let month = monthNames[interval[0].getMonth()] || '';
    let short = month.substring(0,3);
    let year  = interval[0].getFullYear(); 
    let tmp   = new Date(interval[0].getTime());
    let index = 0, data  = {
      'name'   : trim([short, year].join(' '), true),      
      'month'  : month,
      'dayList': [],
      'stamp'  : interval[0].getTime()
    };
    if ( view === 'daily' || view === 'DAYS' ) {
      data.name = weekName[interval[0].getDay()] + ' ' + convertDateToText(interval[0]);
      interval[0].setDate((interval[0].getDate() + 1));
    } else if ( view === 'weekly' || view === 'WEEKS' ) {
      data.name = 'Uke '+getWeekOfDate(interval[0], true) + ' ' + year;
      interval[0].setDate((interval[0].getDate() + 7));
    } else {
      interval[0].setMonth((interval[0].getMonth() + 1));
    }

    data.nextStamp = interval[0].getTime();

    while( tmp.getTime() < interval[0].getTime() && index++ < 400 ) {
      let pin = convertDateToText(tmp);
      data.dayList.push( pin );
      tmp.setDate((tmp.getDate() + 1));
    }

    out.push(data);
  }
  return out;
}

/******************************************************************************
******************************************************************************/
export const convertToHumanDate = ( date, format ) => {
  if ( ! date ) { return ''; }
  moment.locale('nb');
  return moment(date).format( format || 'DD.MM.YYYY [:] HH:mm' );
}

/******************************************************************************
******************************************************************************/
export const splitText = (text, split) => {
  let i = (text || '').length % split, list = i ? [text.substr(0, i)] : [];
  for (i; i < text.length; i += split) {
    list.push(text.substr(i, split));
  }
  return list;
};

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

export const splitPhone = (text, switcher) => {
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

export const getFormat = (value, type, detail) => {
  let text = ((value || '')+'').replace(/\s+/g, ''), out = '';

  if (type === 'accountnumber') {
    out = [text.substring(0, 4), text.substring(4, 6), text.substring(6)]
      .join(' ').replace(/\s+/g, ' ').replace(/\s+$/g, '');
  } else if (type === 'personnumber') {
    out = [text.substring(0, 6), text.substring(6)]
      .join(' ').replace(/\s+/g, ' ').replace(/\s+$/g, '');
  } else if (type === 'organizationsnumber') {
    out = [text.substring(0, 3), text.substring(3, 6), text.substring(6, 9), text.substring(9, 12)]
      .join(' ').replace(/\s+/g, ' ').replace(/\s+$/g, '');
  } else if (type === 'amount') {
    out = splitText(text, 3).join(' ');
  } else if (type === 'creditcardnumber') {
    //out = splitText( text, 4 ).join(' ');
    out = [text.substring(0, 4), text.substring(4, 8), text.substring(8, 12), text.substring(12, 16)]
      .join(' ').replace(/\s+/g, ' ').replace(/\s+$/g, '');
  } else if (type === 'telephone') {
    out = splitPhone(text, [2,2]);
  } else if (type === 'mobile') {
    out = splitPhone(text, [3, 2]);
  } else if (type === 'minute2time') {
    let number = parseInt(text);
    if ( ! isNaN(number) ) {
      let hour = 0, minute = number || 0, anHour = 60;
      while (minute >= anHour) { minute-= anHour; hour++; }

      let out = (minute < 10 ? '0': '') + minute + ' minutt' + (minute>1 ? 'er': '');
      return (hour ? (hour +' time' + (hour>1 ? 'r ': ' ')) : '') + out;
    }
  } else if (type === 'second2time') {
    let number = parseInt(text);
    if ( ! isNaN(number) && number >= 1000 ) {
      let second = parseInt( number / 1000 ), anHour = 60*60, aDay = 24*anHour;
      let day = 0;
      while (second > aDay) { second-= aDay; day++; }

      let hour = 0;
      while (second >= anHour) { second-= anHour; hour++; }

      let minute = 0;
      while ( second > 59 ) { second-=60; minute++; }
      let a = day   ? (day + ' dag' + (day > 1 ? 'er': '')) : '';
      let b = hour   ? (hour + ' time' + (hour > 1 ? 'r': '')) : '';
      let c = minute ? (minute + ' min') : (detail ? '0 min' : '');
      
      //let d = second ? (second + ' sek') : (detail ? '0 sek' : '');
      let d = second ? (second + ' sek') : '';
      out = trim( [a,b,c,d].join(' '), true );
    }
  } else if (type === 'timestamp2date') {
    let number = parseInt(text);
    if ( ! isNaN(number) ) {
      let date = new Date( number );
      out = convertDateToText( date );
    }
  } else if (type === 'devi-date') {
    out = text ? moment( text, 'YYYY-MM-DDTHH:mm:ssZ' ).format('DD.MM.YYYY, HH:mm') : '-';
  } else if (type === 'comment-group-view' && text ) {

    let splited = trim(text, true).split(' ');
    if ( splited.length === 1 ) {
      out = text.substring(0,4);
    } else {
      out = splited[0].substring(0,3) + ' '+ splited[1].substring(0,1);
    }
    for (let i=out.length; i<5; i++ ) {out += ' ';}
    out = out.toUpperCase();
  }

  return out || text;
}

export const isValid = (value, type) => {
  let text = (value || '').replace(/\s+/g, ''), out = false;

  if (type === 'email') {
    out = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test( text );
  } else if (type === 'countrycode') {
    out = /^\+([0-9]{2}(\s+)?|[0-9]{3})$/i.test( text );
  } else if (type === 'mobile' || type === 'telephone' || type === 'phone') {
    out = /^[1-9][0-9]{7,}$/i.test( text );
  } else if (type === 'ratio') {
    out = /^[0-9]{1,2}\:[0-9]{1,2}$/i.test( text );
  } else if (type === 'urlStartWithHTTP') {
    out = /^http(s)?:\/\//ig.test(text);
  } else if (type === 'url') {
    out = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/ig.test(text);
  } else if ( type === 'ifDefined' ) {
    return true;
  }
  
  return out;
}

export const getDatesDifference = (dateA, dateB, abstract) => {
  if ( ! dateA || ! dateB ) { return 0; }

  let aDay = 1000*60*60*24;
  let timeDiff = abstract ? Math.abs(dateA.getTime() - dateB.getTime()) :
    (dateB.getTime() - dateA.getTime());
  return Math.round((timeDiff / aDay));
}

/******************************************************************************
  Convet all keys from data to lower case
******************************************************************************/
export const convertDataKeyToLowerCase = (source) => {
  let temp = null;
  if ( source && typeof(source) === 'object' ) {
    if ( source instanceof Array ) {
      temp = [];
      for (let i = 0; i < source.length; i++) {
        temp.push( convertDataKeyToLowerCase(source[i]));
      }
    } else {
      temp = {};
      for (let key in source) {
        temp[key.toLowerCase()] = convertDataKeyToLowerCase(source[key]);
      }
    }
  } else { temp = source; }
  return temp;
}

/******************************************************************************
******************************************************************************/
//https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_geolocation
export const updateUserLocation = (user, force, callback, error, watch) => {
  let now     = new Date(), min = 2*60*1000;
  let current = JSON.parse( JSON.stringify((user.position || {'timestamp': 0})) );
  let diff    = now.getTime() - (current.timestamp || 0);
  if ( ! force && diff < min  ) { return typeof(callback) === 'function' ? callback() : null; }

  return getLocation( (position) => {
    if ( ! user ) { user = {}; }
    //console.log('== GENERAL get location > ' + watch); console.log( position );
    //debug('lat: ' + position.coords.latitude+ ' lng: '+position.coords.longitude);

    let update = force === 2 || ! user.position || position.coords.latitude !== user.position.lat || position.coords.longitude !== user.position.lng;
    if ( update ) {
      user.position = {
        'lat' : position.coords.latitude,
        'lng': position.coords.longitude,
        'timestamp': position.timestamp
      };

      //user.position = {'lat':59.912740, 'lng':10.748238}; //Ruter kontor
      setLocalStorage('user', user );
    }
    typeof(callback) === 'function' ? callback((update ? user : null)) : null;
  }, error, watch);
};

/******************************************************************************
******************************************************************************/
export const getUserClosestPlace = ( user, areaList ) => {
  if ( ! user || ! user.position || ! (areaList || []).length ) { return; }

  let userPoint = [user.position.lat, user.position.lng];
  let closest   = null, lessDistance = -1, distance = 0;
  areaList.forEach( (data) => {
    //data.position = GPSposition[data.id];
    if ( ! data.position ) { return; }

    distance = getDistanceBetweenPoints(userPoint, [data.position.lat, data.position.lng]);
    if ( closest === null || lessDistance > distance ) {
      closest = data;
      lessDistance = distance;
    }
  });
  return closest;
}

/******************************************************************************
******************************************************************************/
export const getCalendarDayNameList = () => {
  return ['Søn','Man','Tir','Ons','Tor','Fre','Lør'];
}

/******************************************************************************
******************************************************************************/
export const sortList = (list, field, decreasing, numberTest, dateFormat) => {
  let keys = field instanceof Array ? field : [field];
  let i =0, length = keys.length;
  return list ? list.sort( (a,b) => {
    let z = 0, x = '', y = '';
    for ( i=0; i<length; i++ ) {
      x = (a[keys[i]] || '') + '';
      y = (b[keys[i]] || '') + '';
      //if ( dateFormat ) { console.log('== X =='); console.log('x value => ' +x); console.log('y value => ' +y);}

      if ( numberTest && ! x.match(/^[a-z]/i) && ! y.match(/^[a-z]/i) ) {
        x = parseFloat(x);
        y = parseFloat(y);
      } else if ( dateFormat ) {
        x = moment(x, dateFormat);
        y = moment(y, dateFormat);

        x = x.isValid() ? x.unix() : moment('9999-12-31', 'YYYY-MM-DD').unix();
        y = y.isValid() ? y.unix() : moment('9999-12-31', 'YYYY-MM-DD').unix();
      }

      z = ((x < y) ? -1 : ((x > y) ? 1 : 0));
      if ( z !== 0 ) { i = length; }
    }


    let v = z * (decreasing ? -1 : 1);
    return v;
    //return (v * (dateFormat ?  -1 : 1));
  }) : [];
};


/******************************************************************************
******************************************************************************/
export const getDegreeByPoints = (pointA, pointB) => {
  let dx = (pointA[0] - pointB[0]);
  let dy = (pointA[1] - pointB[1]);
  let angle = Math.atan2(dy, dx) * 180 / Math.PI + 180;

  if (angle < 0){ angle = 360 + angle;}
  return angle;
}

/******************************************************************************
******************************************************************************/
export const addClass = (target, type) => {
  if ( ! target ) { return; }

  let v = target.getAttribute('class');
  if ( ! v  ) { return target.setAttribute('class', type); }

  let s = trim(type, true).split(' '), n = v;
  for ( let i=0; i<s.length; i++ ) {
    if ( ! s[i] ) { continue; }
    let r = new RegExp( '(^|\\s+)'+s[i]+'($|\\s+)', 'g' );
    if ( ! n.match(r) ) {
      n = trim(n+' '+s[i],true);
    }
  }

  n = trim(n, true);
  if ( n !== v ) { target.setAttribute('class', n ); }
}

export const removeClass = (target, type) => {
  if ( ! target ) return;
  
  let v = target.getAttribute('class');
  if ( ! v ) { return; }

  let s = trim(type, true).split(' ');
  for ( let i=0; i<s.length; i++ ) {
    if ( ! s[i] ) { continue; }
    let r = new RegExp( '(^|\\s+)'+s[i]+'($|\\s+)', 'g' );
    v = v.replace( r, ' ' );
  }

  v = trim( v, true);
  v ? target.setAttribute('class', v) : target.removeAttribute('class');
  //if ( v.match( r ) ) { target.setAttribute( 'class', trim((v.split(r)).join(' '), true) );}
}

/******************************************************************************
******************************************************************************/
export const renderdDownload = ( uri, name ) => {
  if ( ! uri || ! name ) { return; }

  let link      = document.createElement('a');
  link.download = name;
  link.href     = uri;
  link.style    = 'visibility:hidden';
  link.target   = '_blank';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);    
};


/******************************************************************************
******************************************************************************/
export const encodeHTML = ( str ) => {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export const decodeHTML = ( str ) =>{
  var txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

/******************************************************************************
******************************************************************************/
export const debug = ( text, value ) => {
  let id = 'my-debuggin-widget', debug = document.getElementById(id), v = '', d = new Date();
  if ( ! debug ) {
    let style = 'position:fixed;bottom:0;right:0;z-index:1000;border:1px solid red; '+
      'overflow:scroll;font-size:10px;line-height:11px;height:150px; width:210px; background-color:#fff';
    debug = document.createElement('div');
    debug.setAttribute('id', id);
    debug.setAttribute('style', style);
    document.body.appendChild( debug );
  }
  
  let p = debug.innerHTML || '', t = d.getMinutes() + ':' + d.getSeconds();
  if ( value != null ) {
    if ( typeof(value) != 'object' )
      v = value;
    else if( value instanceof Array )
      v = value.join('<br/>');
    else {
      let data = [];
      for ( let k in value ) { data.push( k + ' : ' + value[k]); }
      v = data.join( '<br/>' );
    }
  }
  debug.innerHTML = t + '<br/>' + text + '<br/>' + v + '<div>&nbsp;</div>' + p;
}

/******************************************************************************
******************************************************************************/
export const getBase64Component = () => {
  let Base64 = {
    // private property
    '_keyStr' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    // public method for encoding
    encode : function (input) {
      let output = '';
      let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      let i = 0;

      input = Base64._utf8_encode(input);

      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

      }

      return output;
    },

    // public method for decoding
    decode : function (input) {
      let output = '';
      let chr1, chr2, chr3;
      let enc1, enc2, enc3, enc4;
      let i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

      while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }

      output = Base64._utf8_decode(output);
      return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
      string = string.replace(/\r\n/g,'\n');
      let utftext = '';

      for (let n = 0; n < string.length; n++) {
        let c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }

      return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
      let string = '';
      let i = 0, c = 0, c3 = 0, c2 = 0;

      while ( i < utftext.length ) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        }
        else if((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i+1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        }
        else {
          c2 = utftext.charCodeAt(i+1);
          c3 = utftext.charCodeAt(i+2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }

      return string;
    }
  }

  return Base64;
};