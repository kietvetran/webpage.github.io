/******************************************************************************
=== GENERAL GLOBAL FUCNTION ===
******************************************************************************/
/**
* The function returns the IE version. If zero returns, it simulates
* that the client's browser is not IE.
* @return {Integer}
*/
function isIE() {
	var m = null;
	if ( (navigator.appName).match('Microsoft Internet Explorer') )
		m = (navigator.appVersion).match(/MSIE\s([\d\.]+)/);
	else if ( (navigator.appName).match('Netscape') )
		m = (navigator.appVersion).match( /rv:([\d\.]+)/);
	return m && m[1] ? parseFloat( m[1] ) : 0; 
}

/**
* The function returns the Mozilla version. If zero returns, it simulates
* that the client's browser is not Mozilla.
* @return {Integer}
*/
function isMozilla() {
	if (navigator.userAgent.indexOf('Firefox') == -1 ) return 0;
	var m = (navigator.userAgent).match( /Firefox\/([\d\.]+)/);
	return m && m[1] ? parseFloat( m[1] ) : 0; 
}

/**
* The function returns the Chrome version. If zero returns, it simulates
* that the client's browser is not Chrome.
* @return {Integer}
*/
function isChrome() {
	if ( ! window.chrome || navigator.userAgent.indexOf('Chrome') == -1 ) 
		return 0;
	var m = (navigator.userAgent).match( /Chrome\/([\d\.]+)/);
	return m && m[1] ? parseFloat( m[1] ) : 0; 
}

/**
* The function returns the Chrome version. If zero returns, it simulates
* that the client's browser is not Chrome.
* @return {Integer}
*/
function isSafari() {
	if ( navigator.userAgent.indexOf('Safari/') == -1 ) return 0;
	var m = navigator.userAgent.match( /Version\/([0-9\.]+)/ );
	return m && m[1] ? parseInt( m[1] ) || 1 : 1;
}

/**
* The function detects iPad Browser.
* @return {Boolean}
*/
function isIpad() { 
  return navigator.userAgent.match(/iPad/i) != null;
}

/**
* The function detects Mobile Browser.
* @return {Boolean}
*/
function isMobile() { 
  if ( ! (navigator.appVersion.indexOf('Mobile') > -1) ) 
    return false;
  return ! ( navigator.userAgent.match(/iPad/i) != null );
}

function isAndroid() { return isMobileAndroid(); }

function isMobileAndroid() {
  if ( ! isMobile() ) return 0;
  var ua = navigator.userAgent.toLowerCase();
  var m = ua.match( /android(\s+)?([1-9\.]+)/i );
  return m ? parseFloat( m[m.length -1] ) : 0;
}

function isMobileWindow() {
  if ( ! isMobile() ) return 0;
  var ua = navigator.userAgent.toLowerCase();
  var m = ua.match( /windows(\s+)?phone(\s+)?os(\s+)?([1-9\.]+)/i );  
  return m ? parseFloat( m[m.length-1] ) : 0;
}

function isMobileIphone() {
  if ( ! isMobile() ) return 0;
  var ua = navigator.userAgent.toLowerCase();
  m = ua.match( /iphone(\s+)?os(\s+)?([1-9\.]+)/i );
  return m ? parseFloat( m[m.length-1] ) : 0;
}

function isWindowsNT() {
	if ( ! (navigator.appName).match('Microsoft Internet Explorer') ) return 0;
	var m = (navigator.appVersion).match( /Windows\s+NT\s([\d\.]+)/ );
	return m && m[1] ? parseFloat( m[1] ) : 0; 
}

function isTouchDevice(){
  var test =  !!('ontouchstart' in window) // works on most browsers 
    || !!('onmsgesturechange' in window); // works on ie10 
  
  if ( test && isIE() > 10 )
    test = !!(navigator.msMaxTouchPoints);
  return test;
}

function isMSpointerEnabled() {
	return window.navigator.msPointerEnabled && isTouchDevice();
}

function getStyle( dom, property ){
	var value = "";
	if(document.defaultView && document.defaultView.getComputedStyle){
		value = document.defaultView.getComputedStyle(dom, "").getPropertyValue(property);
	}
	else if(dom.currentStyle){
		property = property.replace(/\-(\w)/g, function (strMatch, p1){
			return p1.toUpperCase();
		});
		value = dom.currentStyle[property];
	}
	return value;
}

/**
* The function returns dom object by getting of element's id.
* Otherwise null returns;
* @return {DOM}
*/
function getElement( id ) {
	return id ? document.getElementById( id ) : null;
}

/**
 * The function returns width and height of the browser window.
 * @param e {window.event} as current event.
 * @param touch {Boolean}, true refers to touch event. Otherwice 
 *        it is a mouse event.
 * @return {Array}
 */
function getEventPosition( e, touch ){
  if ( ! e ) e = window.event;
  var target = (e.targetTouches || e.changedTouches || [])[0], pos = [
    e.clientX || e.pageX || (touch && target ? target.pageX : 0),  
    e.clientY || e.pageY || (touch && target ? target.pageY : 0)
  ];

  if ( pos[0]===0 && pos[1]===0 ) {
    try {
       pos =[e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY];
    } catch(error) { pos = [0,0]; } 
  }
  return pos;
}


/*
function getEventPosition( e, touch ){
	if ( ! e ) e = window.event;
	return [
		e.pageX || e.clientX || (touch ? e.targetTouches[0].pageX : 0),  
		e.pageY || e.clientY || (touch ? e.targetTouches[0].pageY : 0)
	];
}
*/

/**
 * The function prevents the current event. it'll check if preventDefault 
 * is defined, and if not, it will use IE’s event.returnValue instead.
 * @param e {window.event} as current event.  
 * @return {Array}
 */
function preventDefaultEvent( e ) {
	if ( e ) {
		if ( typeof(e.preventDefault)=='function' ) 
			e.preventDefault();
	  else 
	  	e.returnValue = false;
	}
}

/**
 * The function returns width and height of the browser window.
 * @return {Array}
 */
function getWindowSize(){
	var w = 0;var h = 0;
	var size = [0, 0];
	if( ! window.innerWidth ) { // IE 
    if( !(document.documentElement.clientWidth == 0) ){
      size[0] = document.documentElement.clientWidth;
      size[1] = document.documentElement.clientHeight;
    } 
    else {
      size[0] = document.body.clientWidth;
      size[1] = document.body.clientHeight;
    }
	} 
	else {
	  size[0] = window.innerWidth;
	  size[1] = window.innerHeight;
	}
	return size;
}

/**
 * The function .
 * @return {Array}
 */
function getScrollPosition(){
	if (typeof window.pageYOffset != 'undefined')
		return [ window.pageXOffset, window.pageYOffset ];

	if (
		typeof document.documentElement.scrollTop != 'undefined' && 
		document.documentElement.scrollTop > 0
	) { 
		return [ 
			document.documentElement.scrollLeft,
			document.documentElement.scrollTop
		];
	}

	return typeof document.body.scrollTop != 'undefined' ? [
		document.body.scrollLeft, document.body.scrollTop
	] : [0,0];
}

/**
 * The function returns offset size of the current dom element
 * @param dom {DOM} as current element.  
 * @return {Array}
 */
function getOffset( dom ) {
	var size = [0,0];
  do {
  	size[0] += dom.offsetLeft || 0;
	  size[1] += dom.offsetTop  || 0;
    dom = dom.offsetParent;
  } while( dom );
  return size;
};


/**
 * The function returns offset size of the current dom element
 * @param dom {DOM} as current element.  
 * @return {Array}
 */
function clearSelection() {
  if ( window.getSelection )
  	window.getSelection().removeAllRanges();
  else if ( document.selection ) 
  	document.selection.empty();
}

/**
 * The function get selected text
 * @return {String}
 */
function getSelectionText() {
  var html = "";
  if (typeof window.getSelection != "undefined") {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var container = document.createElement("div");
      for (var i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
      }
      html = container.innerHTML;
    }
  } else if (typeof document.selection != "undefined") {
    if (document.selection.type == "Text") {
        html = document.selection.createRange().htmlText;
    }
  }
  return html;
}

/**
 * The function returns dom's children of matched class type. 
 * @param dom {DOM} as current element.  
 * @param what {string} class type.  
 * @param maxCount {Integer} of element.  
 * @return {Array}
 */
function findChildren( dom, what, maxCount ) {
	var list = [], verify = function( children, type, count ) {
		for ( var i=0; i<children.length; i++ ) {
			var child = children[i];
			if (  hasClass(child,type) && (typeof(count)=='undefined' || count > list.length) ) 
				list.push( child );
			if ( child.children && (typeof(count)=='undefined' || count > list.length) ) 
				verify( child.children, type, count );
		}
	};

	if ( dom && dom.children && what ) verify( dom.children, what, maxCount );
	return list;
};

/**
 * The function returns closest dom's parent of matched class type.
 * Otherwise null returns, when there is no matched. 
 * @param dom {DOM} as current element.  
 * @param what {string} type of class or id.  
 * @param idTest {Boolean}, the true refers to test of parent's id.  
 * @return {DOM}
 */

function closestParent( dom, what, idTest ) {
	var verify = function( parent, type, specific ) {
		if ( ! parent || (parent.tagName||'').match(/^html/i) ) 
			return;
		if ( specific ) {
			var t = parent.getAttribute('id')==type;
			return t ? parent : verify( parent.parentNode, type, specific );
		}		
		return hasClass(parent,type) ? parent : 
			verify( parent.parentNode, type, specific );
	};
	return what ? verify( dom, what, idTest ) : null;
}

/*
function closestParent( dom, what, idTest ) {
	var verify = function( parent, type, specific ) {
		return ! parent || (parent.tagName||'').match(/^html/i) ? null : ( 
			( specific && typeof(parent.getAttribute)=='function' ? 
				parent.getAttribute('id')==type : hasClass(parent,type) 
			) ? parent : verify( parent.parentNode, type, specific )
		);
	};
	return what ? verify( dom, what, idTest ) : null;
}
*/

/**
* The function returns true, that referes the current target get 
* type as class value. Otherwise false returns.
* @param target {DOM} as the current target.
* @param type {String} as current type.
* @return {Boolean}
*/
function hasClass( target, type ){	
	if ( ! target ) return;
	var v = target && target.tagName ? (target.getAttribute('class') || '') : '';
	var r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
	return v.match( r ) != null;
}

/**
* The function adds type into class value of the current target.
* @param target {DOM} as the current target.
* @param type {String} as current type.
* @return {Void}
*/
function addClass( target, type ){
	if ( ! target ) return;

	var v = target.getAttribute('class');
	if ( ! v  ) return target.setAttribute('class', type); 

	var r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
	if ( ! v.match( r ) ) target.setAttribute('class',  trim(v+' '+type,true));
}

/**
* The function removes type from class value of the current target.
* @param target {DOM} as the current target.
* @param type {String} as current type.
* @return {Void}
*/
function removeClass( target, type ){	
	if ( ! target ) return;
	
	var v = target.getAttribute('class');
	if ( ! v ) return;

	var r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
	if ( v.match( r ) ) 
		target.setAttribute( 'class', trim((v.split(r)).join(' '), true) );
}

/**
* The function returns target's next element. Otherwise null returns.
* @return {Dom}
*/
function getNext( target ){	
	if ( ! target ) return null;
	var id = generateId( target ), children = target.parentNode.children;
	for ( var i=0; i<children.length; i++ ) {
		if ( id == children[i].getAttribute('id') ) 
			return children[i+1];
	}
	return null;
}

/**
* The function returns target's previous element. Otherwise null returns.
* @return {Dom}
*/
function getPrevious( target ){	
	if ( ! target ) return null;
	var id = generateId( target ), children = target.parentNode.children;
	for ( var i=0; i<children.length; i++ ) {
		if ( id == children[i].getAttribute('id') ) 
			return i==0 ? null : children[i-1];
	}
	return null;
}

/**
* The function 
* @return {Void}
*/
function removeTarget( target ){	
	if ( target && target.parentNode ) target.parentNode.removeChild( target );
}

/**
 * The function adds event listener of the current target.
 * @param callback {Function} as function to be call when the action performs.
 * @param target {DOM} as current objcet.
 * @param type {String} of action.
 * @return {Void}
 */
function addEvent( callback, target, type ) {
	if ( target ) {
		if (typeof target.addEventListener != 'undefined')
	    target.addEventListener( type, callback, false );
		else if (typeof target.attachEvent != 'undefined')
	    target.attachEvent( 'on'+type, callback );
  }
}

/**
 * The function removes event listener of the current target.
 * @param callback {Function} as function to be call when the action performs.
 * @param target {DOM} as current objcet.
 * @param type {String} of action.
 * @return {Void}
 */
function removeEvent( callback, target, type ) {
	if ( target ) {
		if (typeof target.addEventListener != 'undefined') {

		}
		else if (typeof target.attachEvent != 'undefined') {

		}
  }
}

/**
 * The function creates the cookie's information.
 * @param name {String} of cookie.
 * @param value {String} to be saved in cookie.
 * @param days {Integer} as how many days is expired day. 
 *        The default equals 100 days.
 * @return {Void}
 */
function createCookie( name, value, days ) {
  if ( ! name ) return;
  var cookie = [ name+'='+(value||'') ];
  var d = new Date(), expires = days || 100;
  d.setTime( d.getTime() + (expires*24*60*60*1000) );
  cookie.push( 'expires='+d.toGMTString() );
  cookie.push( 'path=/' );
  document.cookie = cookie.join('; ');
}

/**
 * The function returns the value of name in cookie.
 * @return {String}.
 */
function readCookie( name ) {
  var nameEQ = name + '=', ca = document.cookie.split(';');
  for ( var i=0; i<ca.length; i++ ) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return '';
}

/**
 * The function erases the cookie.
 * @return {Void}
 */
function eraseCookie( name ) { 
  return createCookie( name, '', -1 ); 
}

/**
 * The function returns hash list of storage.
 * @param wantSession {Boolen}, the true refers to sessionStorage.
 *        Otherwise localStorage returns.
 * @return {Hash}
 */
function getLocalStorage( wantSession ) {
	var storage = wantSession ? (sessionStorage || localStorage) : 
		(localStorage || sessionStorage); 		
	return storage || {'NOTSUPPERTLOCALSTORAGW': true};
}

/**
 * The function removes the localStorage's item.
 * @param item {String} as key of localStorage or sessionStorage.
 * @param storage {String} as current.
 * @return {Boolean}
 */
function removeLocalStorageItem( item, storage ) {
	var base = storage || getLocalStorage(), loop = base.length || 0;
  for (var i=0; i<loop; i++) {
    if ( base.key( i ) == item ) {
	   	base.removeItem( item );
	    return true;
	  }
  }	
  return false;
}

/**
 * The function 
 * @return {String}
 */
function callServer( callback, webservice, query, method, asText, noCache ){
	if ( ! webservice ) return;

	var ajax = null;              // The variable that makes Ajax possible!
	try {	                        // Opera 8.0+, Firefox, Safari
		ajax = new XMLHttpRequest();
	} catch ( e ){                // Internet Explorer Browsers
		try {
			ajax = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				ajax = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {             // Something went wrong
				alert("Your browser broke!");
				return null;
			}
		}
	}

	// Create a function that will receive data sent from the server
	ajax.onreadystatechange = function(){
		if ( ajax.readyState == 4 ) {
			var text = ajax.responseText;
			var data = asText ? text : (text ? JSON.parse( text ) : null);
			if ( typeof(callback) == 'function' ) callback( data );
		}
		//else if ( ajax.readyState == 3 ) {}
		//else {}
	}

	var unique = '&cache='+(Math.random()*1000000);
	var type   = method ? method.toUpperCase() : 'GET';
	var url    = webservice + (query && type=='GET' ? '?'+query+(noCache ? unique :'') : '');
	ajax.open( type, url, true ); 
	ajax.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	ajax.send( type=='GET' ? null : query ); 
	return ajax;
}

/**
 * The function return scroll's top position of document body.
 * @return {Integer}
 */
function getBodyScrollTop() {
	return document.body.scrollTop || document.documentElement.scrollTop || 0;
}

/**
 * The function scrolls vertical of document's body to the current position
 * @param where {Integer} as current position.
 * @return {Void}
 */
function scrollBodyTop( where ) {
	document.body.scrollTop = document.documentElement.scrollTop = 
		where && (! isNaN(where) ) && where > 0 ? where : 0;
}

/**
 * The function 
 * @return {String}
 */
function generateId( target ) {
	if ( ! target ) return ''; 
	var id = target.getAttribute( 'id' );
	if ( ! id ) {
		var id = 'auto_' + (new Date()).getTime()+'_'+ATTR['index']++;
		target.setAttribute('id', id);
  }
  return id;
}

function isURL( text ) { 
	var reg = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
	return (text || '').match( reg ) ? true : false;
}

/******************************************************************************
=== DATE CONVERTING FUNCTIONS ===
******************************************************************************/

/**
 * The function converts text to Date object. 
 * @param text {String} in pattern as "YYYY-MM-DD"
 * @return {Date}, Otherwise null returns.
 */
function convertText2Date( text ) {
  var m = text ? text.match( /^(\d{1,4})\-(\d{1,2})\-(\d{1,2})/ ) : null;
  if ( m ) {
	  for ( var i=1; i<m.length; i++ )
  		m[i] = parseInt( (m[i]+'').replace(/^0/, '') );
  }
 	return m ? new Date( m[1], m[2]-1, m[3], 0, 0, 0) : null;
}

/**
 * The function 
 * @return {String}
 */
function convertDate2Text( date ) {
	var m = date ? [date.getFullYear(), date.getMonth()+1, date.getDate()] : null;
	if ( m ) {
		for (var i=0; i<m.length; i++ ) 
			m[i] = m[i] < 10 ? '0'+m[i] : m[i];
	}
	return m ? m.join('-') : '';
}

/**
 * The function 
 * @return {String}
 */
function convertDate2Name( date ) {
	if ( ! date ) return '';

	var value = date.getTime(), d = new Date(), day = 60*60*24*1000, now = ( 
		new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0) 
	).getTime();

	var list = [
		{'id': -1, 'name': 'Tomorrow'  },
		{'id': 0,  'name': 'Today'     },
		{'id': 1,  'name': 'Yesterday' }
	];

	for ( var i=0; i<list.length; i++ ) {		
		var from = now-(day*list[i]['id']), to = from + day;
		if ( value >= from && value < to ) {
			return list[i]['name'];
		}
	}

	var difference = (value - now)/ day, ago = difference < 0;
	var number = parseInt( ago ? (difference-1)*-1 : difference);
	return ago ? number+'_days_ago' : 'about_'+number+'_days';
}

/******************************************************************************
=== ENCODING & DECOING FUNCTIONS ===
******************************************************************************/
/**
 * The function encodes text to UTF8.
 * @return {String}
 */
function encodeUTF8( text ) {
  return text ? unescape(encodeURIComponent(text)) : text;
}

/**
 * The function decodes the UTF8 text.
 * @return {Hash}
 */
function decodeUTF8( text ) {
  return text ? decodeURIComponent(escape(text)) : text;
}

/**
 * The function encodes the text to LZW.
 * @param text {String} as current.
 * @return {String}
 */
function encodeLZW( text ) {
	var dict = {}, data = (text + '').split(''), out = [];
	var currChar = null, phrase = data[0], code = 256;
	for (var i=1; i<data.length; i++) {
		currChar = data[i];
		if (dict[phrase + currChar] != null)
			phrase += currChar;
		else {
			out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
			dict[phrase + currChar] = code++;
			phrase = currChar;
		}
	}

	out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
	for (var i=0; i<out.length; i++) {
		out[i] = String.fromCharCode( out[i] );
	}
	return out.join('');
}

/**
 * The function decodes the LZW to text.
 * @param text {String} as current.
 * @return {String}
 */
function decodeLZW( text ) {
	var dict = {}, data = (text + '').split(''); 
	var currChar = data[0], oldPhrase = currChar;
	var out = [currChar], code = 256, phrase = null;

	for (var i=1; i<data.length; i++) {
		var currCode = data[i].charCodeAt(0);
		if (currCode < 256)
			phrase = data[i];
		else
			phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);

		out.push(phrase);
		currChar     = phrase.charAt(0);
		dict[code++] = oldPhrase + currChar;
		oldPhrase    = phrase;
	}
	return out.join('');
}

/**
 * The function 
 * @return {String}
 */
function trim( text, multipleWhiteSpace ) {
	var out = (text || '').replace( /^\s+/, '').replace( /\s+$/g, '');
	return multipleWhiteSpace ? out.replace( /\s+/g, ' ' ) : out;
}

/**
* The function
* @param text {String} as source of RegExp
* @param g {Booelan}, the true refers to perform a global match .
* @param i {Booelan}, the true refers to perform case-insensitive matching
* @param b {Booelan}, the true refers the matched shall be 
*        beginning or start with white space.
* @param f {Booelan}, the true refers the matched shall be 
*        ending or end with white space.
* @param e {Boolean}, the true refers to escape the none character of the text
* @return {RegExp}
*/
function createRegExp( text, g, i, b, f, e, r ) {
  if ( text == '*' ) { return /.*/; }
	text = e ? escapeText( text ) : text.replace( /\*/, '.*' );

	//debug( text );
  //var k = ['(',')'];
  //for ( var j=0; j<k.length; j++ )
  //  text = text.replace( new RegExp( '\\' + k[j], 'g'), '\\' + k[j] );

  //var v = text.replace( /^\+/, '\\+').replace( /\|\+/, '\|\\+');
  //var v = text.replace( /\+/g, '\\+' );
  var v = text.replace( /\+/g, '\\+' );
  if ( r ) v = v.replace( r[0], r[1] );

  var m = (g && i) ? 'gi' : ( (g || i) ? (g ? 'g' : 'i') : '' );
  //return new RegExp((b ? '(^|\\s+)' : '') +'('+v+')' + (f ? '($|\\s+)': ''),m);
  return new RegExp((b ? '(^|\/|\\s+)' : '') +'('+v+')' + (f ? '($|\/|\\s+)': ''),m);
}

/**
* The function
* @param text {String}, to be eacaped of the none character.
* @return {String}
*/
function escapeText( text ) {
	var t = text || '', a = ['\\','.','?','+','-','/','"',':','*','@'];
  for ( var j=0; j<a.length; j++ )
    t = t.replace( new RegExp( '\\' + a[j], 'g'), '\\' + a[j] );
  return t;
}

/**
* The function
* @return {Hash}
*/
function getRules( dom, tag ) {
	var data = {};
	if ( ! dom ) return data;

	var rule = dom.getAttribute( tag || 'data-rule' );
	if ( rule ) return JSON.parse( rule.replace(/\'/g, '"') );

  var name = tag || 'rule', note = dom.getAttribute('class');
  if ( ! note ) return data;

  var validate = function (v, d) {
    if ( !d ) d = data;
    var m = v.match( /(\w+)\[(.*)\]/ );
    if ( m ) {
      if ( m[2].match(/(.*\,|^)(\w+\[.*\])/) ) {
        if ( ! d[m[1]] || typeof (d[m[1]]) == 'string' ) d[m[1]] = {};
        validate(m[2], data[m[1]]);
      }
      else { d[m[1]] = m[2]; }
    }
    else { d[v] = 'true'; }
  };

  var regexp  = new RegExp( '^' + name + '\\[(.*)\\]', 'i' );
  var splited = note.split( ' ' );

  for ( var i=0; i<splited.length; i++ ) {
  	var t = splited[i], m = t ? t.match(regexp) : null;
    if ( m ) {
	    var cnt = m[1].split(',');
	    for (var j=0; j<cnt.length; j++ ) {
	      if ( cnt[j] ) validate(cnt[j]);
	    }
	  }
  }
  return data;
} 

/**
* The function
* @return {Void}
*/
function getBase64Image( dom, noReplace ) {
  var size = dom ? [dom.width || 0, dom.height || 0] : [0,0];
  if ( ! size[0] || ! size[0] ) return '';

  var canvas = document.createElement("canvas");
  canvas.width = size[0], canvas.height = size[1];

  var ctx = canvas.getContext("2d");
  ctx.drawImage(dom, 0, 0);

  var base64 = canvas.toDataURL("image/png") || '';
  return noReplace ? base64 :
    base64.replace(/^data:image\/(png|jpg);base64,/, '');
}

/**
* The function
* @return {Void}
*/
function isEncoded( text ) {
  var limit = parseInt((text||'').length/3); 
  if ( limit > 1 ) return false;
 
  var check = '[\\w\\+\\.\\-\\_\\|\\{\\}\\?\\*\\^\\¨\\\'\\"\\s]{'+limit+'}';
  return ! text.match(createRegExp(check));	
}

/**
* The function
* @return {Void}
*/
function bin2hex (code,str) {
  var out = '', note = '', text = str+'';
  for ( var i=0; i<text.length; i++ ) {
    note = text.charCodeAt(i).toString(code || 16);
    out += note.length < 2 ? '0' + note : note;
  }
  return out;
}

function hex2bin(code,str) {
  var bytes = [], text = str+'';
  for( var i=0; i<text.length-1; i+=2 )
    bytes.push(parseInt(text.substr(i, 2), code || 16));
  return String.fromCharCode.apply(String, bytes);    
}

/**
* The function
* @return {Void}
*/
function convertBitwise( code, text, force ) {
  var length = (text || '').length;
  if ( (! code || ! length) || (length<4 && force==null) ) return text; 

  //var encoded = '', test = force!=null ? force : isEncoded(text);
  var encoded = '', test = force;
  for ( var i=0; i<length; i++ ) {
    var a = text.charCodeAt(i);
    var b = test ? (a - code) : (a + code);
    encoded = encoded+String.fromCharCode(b);
  }
  return encoded;
}

/**
* The function
* @return {Void}
*/
function rc4( key, str ) {
  var s = [], i = 0, j = 0, x = 0, res = '';
  for ( i=0; i<256; i++ ) s[i] = i;

  for ( i=0; i<256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    x = s[i], s[i] = s[j], s[j] = x;
  }

  i = 0, j = 0;
  for (var y = 0; y<str.length; y++) {
    i    = (i + 1) % 256;
    j    = (j + s[i]) % 256;
    x    = s[i], s[i] = s[j], s[j] = x;
    res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
  }
  return res;
}

/**
* The function
* @return {Void}
*/
function debug( text, value ) {
  var debug = getElement('debugWidget'), v = '', d = new Date();
  if ( ! debug ) {
  	debug = document.createElement('div');
  	debug.setAttribute('id', 'debugWidget');
  	document.body.appendChild( debug );
  }
  
  var p = debug.innerHTML || '';
  var t = d.getMinutes() + ':' + d.getSeconds();
  if ( value != null ) {
    if ( typeof(value) != 'object' )
      v = value;
    else if( value instanceof Array )
      v = value.join('<br/>');
    else {
      var data = [];
      for ( var k in value ) data.push( k + ' : ' + value[k]);
      v = data.join( '<br/>' );
    }
  }
  debug.innerHTML = t + '<br/>' + text + '<br/>' + v + '<div>&nbsp;</div>' + p;
}

var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
	    var output = "";
	    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	    var i = 0;

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
	    var output = "";
	    var chr1, chr2, chr3;
	    var enc1, enc2, enc3, enc4;
	    var i = 0;

	    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

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
	    string = string.replace(/\r\n/g,"\n");
	    var utftext = "";

	    for (var n = 0; n < string.length; n++) {

	        var c = string.charCodeAt(n);

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
	    var string = "";
	    var i = 0;
	    var c = c1 = c2 = 0;

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
};