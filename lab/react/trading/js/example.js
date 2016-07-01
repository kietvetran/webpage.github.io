function debug( text, value, json ) {
    if ( json ) text = (text ? text+' ===> ' : '') + JSON.stringify(json);
    var debug = document.getElementById('debugWidget'), v = '', d = new Date();
    if ( ! debug ) {
        debug = document.createElement('div');
        debug.id    = 'debugWidget';
        debug.style = 'position:fixed;right:5px;bottom:5px;z-index:1000;'+
            'background-color:#fff;border:1px solid red;'+
            'overflow:scroll;font-size:11px;line-height:16px;width:300px;height:300px;';
        document.body.appendChild( debug );
    }

    var p = debug.innerHTML || '';
    var t = d.getMinutes() + ':' + d.getSeconds();
    if ( value !== null ) {
        if ( typeof(value) !== 'object' )
            v = value;
        else if( value instanceof Array )
            v = value.join('<br/>');
        else {
            var data = [];
            for ( var k in value ) data.push( k + ' : ' + value[k]);
            v = data.join( '<br/>' );
        }
    }
    debug.innerHTML = (t || '') + '<br/>' + (text || '') + '<br/>' + (v || '') + '<div>&nbsp;</div>' + p;
}