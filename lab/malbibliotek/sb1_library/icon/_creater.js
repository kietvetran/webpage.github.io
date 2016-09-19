/**********************************
	=== Command ===
	Get timestamp:  date +%s
**********************************/
var FS    = require('fs');
var EXEC  = require('child_process').exec;
render( '../src/icons/', {
	'advisor': 'Rådgiver',
	'arrow_down': 'Pil ned',
	'arrow_left': 'Pil venstre',
	'arrow_right': 'Pil høyre',
	'arrow_up': 'Pil opp',
	'atv': 'atv / moped / scooter',
	'become_customer': 'Å bli kunde',
	'boat_large': 'Stor båt',
	'boat_small': 'Små båt',
	'buy': 'Kjøp / handlevogn',
	'calculator': 'Kalkulator',
	'calendar': 'Kalender',
	'car': 'Bil',
	'card': 'Kredittkort / visa',
	'cash': 'Penger',
	'chat': 'Chat',
	'check': 'Check / valg',
	'child': 'Barn',
	'close': 'Lukke',
	'construction': 'Konstruksjon',
	'consultant': 'Konsulent',
	'customer_support': 'Kundeservice',
	'cutlery': 'Bestikk',
	'damage': 'Skade',
	'family': 'Familie',
	'gift': 'Gave',
	'hourglass': 'Timeglass',
	'house': 'hus',
	'insurance': 'Forsikring',
	'information': 'Informasjon',
	'keyhole': 'Nøkkelhull',
	'laptop': 'Bærbar PC',
	'life_insurance': 'Livsforsikring',
	'log_in': 'Logg inn',
	'menu': 'Meny',
	'mobile': 'Mobil',
	'Motorcycle': 'Motorsykkel',
	'motorhome': 'Campingvogn',
	'payment': 'Betaling',
	'pension': 'Pensjon',
	'percent': 'Prosent',
	'phone': 'Telefon',
	'question': 'Spørsmål',
	'saving': 'Sparing',
	'school': 'Skole',
	'search': 'Søk',
	'service': 'Tjenester',
	'showing': 'Visning',
	'snowmobile': 'Snøscooter',
	'tenant': 'Leietaker',
	'tips': 'Råd / anbefaling / tips',
	'tractor': 'Traktor',
	'traiee': 'Opplæring / trainee',
	'transport': 'Transport',
	'travle': 'Reise',
	'truck':' Lastebil',
	'valuation': 'Verdivurdering',
	'van': 'Van',
	'Visitors': 'Besøker',
	'Watchman': 'vekteren',
	'wireless': 'Trådløs',
	'young': 'Ung',
	'': ''
});

/******************************************************************************
 == PUBLIC FUNCTION ==
******************************************************************************/
function render( path, dictionary ) {
	if ( ! path ) return;
	if ( ! dictionary ) dictionary = {};

	var list = readPath(path,true) || [], loop = list.length;
	var html = readFile('_index.html'), txt = readFile('_readme.txt');
	//for ( var i=0; i<1; i++ ) {
	for ( var i=0; i<loop; i++ ) {
		var matched = list[i].match( /\/(([\w\-\_\.]+)\.(\w+))$/i );
		if ( ! matched ) continue;
		//console.log( matched );

		var file  = matched[1], name = matched[2], type = matched[3];
		var lower = name.toLowerCase(), icon = 'icon-'+name, text = '';
		var no    = dictionary[lower] || capitaliseFirstLetter( lower );

		if ( exist(lower) ) deletePath(lower);
		createPath( lower );		

		text = html.replace( /NAME_NO/g, no ).replace( /NAME/g, name ).replace( /ICON/g, icon );
		writeFile( lower+'/index.html', text );

		text = txt.replace( /NAME_NO/g, no ).replace( /NAME/g, name ).replace( /ICON/g, icon );
		writeFile( lower+'/readme.txt', text );
	}
}



function _getRandom() {
	return Math.floor((Math.random() * 10000) + 1); 
}

/*****************************************************************************/

function isFile( what ) {
	return what ? FS.lstatSync( what ).isFile() : false;
}

function isDirectory( what ) {
	return what ? FS.lstatSync( what ).isDirectory() : false;
}

function exist( what ) {
	return what ? FS.existsSync( what ) : false; 
}

function getFileName( path ) {
	var test = path ? path.match( /(^|\/)([\w\s\d\_\-\.]+(\.\w+)?)$/) : null;
	return (test || [])[2] || '';
}

function readFile( file, type, callback ) {
	var text = '';
	try { 
		text = FS.readFileSync( file || '', type || 'utf8' ); 
	} catch ( error ) { }
	return typeof(callback) == 'function' ? callback( text ) : text;
}

function writeFile( file, text, type ) {
	var saved = false;
	try {
		var splited = file.split( /\// ), path = '';
		for ( var i=0;i<(splited.length-1); i++ ) {
			path += splited[i]+'/';
			if ( splited[i].match(/^\./) ) continue;
			var out = createPath( path );
			if ( out ) return out;
		}

		// undefined or false, never true
		saved = FS.writeFileSync( file || '', text || '', type || 'utf8' ); 
	}  catch ( error ) { 

	}
	return typeof(saved)=='boolean' ? 'Write file failed: '+(file || '') : '';
}

function trim( text, multipleWhiteSpace ) {
	var out = (text || '').replace( /^\s+/, '').replace( /\s+$/g, '');
	return multipleWhiteSpace ? out.replace( /\s+/g, ' ' ) : out;
}

function deleteFile( file ) {
	var out = '';
	if ( file == 'server.js' )
		out = 'Not allow to delete file: server.js';
	else {
		try { 
			FS.unlinkSync( file || '' ); 
		}  catch ( error ) {  
			out = 'Delete file failed: '+( file || '');
		}
	}
	return out;
}

function moveFile( oldFile, newFile, type ) {
	if ( ! oldFile || ! newFile ) return '';

	var text = readFile( oldFile, type );
	var out  = writeFile( newFile, text, type );
	if ( out ) return 'Nove file failed: '+ newFile;

	try {
		deleteFile( oldFile );
	} catch( error ) { }
	return '';
}

function createPath( path ) {
	var out = '';
  try {
    FS.mkdirSync(path);
  } catch( error ) {
    if ( error.code != 'EEXIST' ) { 
    	throw error;
    	out = path;
    }
  }
  return out ? 'Create path failed: '+out : '';
}

function deletePath( path ) {
	var out = '';
	if ( ! path || path == '.' || path.match( /^\.\.\//) )
		out = 'Not allow to delete path: '+path;
	else {
		var list = getPathFile( path );
		for ( var i=0; i<list.length; i++ ) {
			 var status = FS.statSync( list[i] );
			 if ( status.isFile() ) deleteFile( list[i] );
		}
		try {
			FS.rmdirSync( path );
		} catch( error ) {
			out = 'Delete file failed: '+path;
		}
	}
	return out;
}

function readPath( path, wantArray ) {
	var list = getPathFile( path );
	return wantArray ? list : list.join("\n");
}

function getPathFile( path ) {
	if ( ! path ) path = './';
	if ( ! path.match( /\/$/) ) path += '/';
	if ( ! exist(path) ) return [];

	var list = [], container = FS.readdirSync( path ) || [];
	for ( var i=0; i<container.length; i++ ) {
		if ( container[i].match( /^\.+/) ) continue;
		list.push( path + container[i] );
	}
	return list;
}

function createRegExp( text, g, i, b, f, e, r ) {
  if ( text == '*' ) { return /.*/; }
	text = e ? escapeText( text ) : text.replace( /\*/, '.*' );

  var v = text.replace( /\+/g, '\\+' );
  if ( r ) v = v.replace( r[0], r[1] );

  var m = (g && i) ? 'gi' : ( (g || i) ? (g ? 'g' : 'i') : '' );
  return new RegExp((b ? '(^|\\s+)' : '') +'('+v+')' + (f ? '($|\\s+)': ''),m);
}

function capitaliseFirstLetter(text){
  return text ? (text.charAt(0).toUpperCase()+text.slice(1).toLowerCase()): '';
}