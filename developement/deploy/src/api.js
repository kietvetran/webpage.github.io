const path     = require('path');
const request  = require('request');
const fs       = require('fs');

function API ( app, config ) {
  var requestCallback = function(res, error, response, body, callback) {
    var result = null;

    if ( body ) {
      try {
        result = JSON.parse( body || '{}' );
      } catch( error ) {
        console.log('ERROR: Unexpected json parse');
      }
    }

    if ( ! response ) { response = {}; }

    //console.log('===> ' + error ); console.log( body );
    console.log('response status code: ' + (response.statusCode || 'none') );
    if ( response.statusCode >= 200 && response.statusCode <= 202 && result ) {
      if ( typeof(callback) === 'function' ) {
        callback( result );
      } else {
        res.send({'result': result });
      }
    } else if ( error ) {
      res.send({'error': error });
    } else {
      res.send({'error': 'BACKEND ERROR: response status code ' + (response.statusCode || 'none'), 'detail': result });
    }
  };

  var getBodyData = function (req, callback) {
    var text = '', data = {};
    req.on('data',function(chunk){ text += chunk.toString(); });
    req.on('end', function(){
      try {
        data = JSON.parse( text );
      } catch ( error ) { data = {}; }
      callback( data );
    });
  }

  var getUserFromCookie = function( req ) {
    if ( ! req || ! req.headers || ! req.headers.cookie  ) { return; }
    var nameEQ = 'psUser=', ca = req.headers.cookie.split(';');
    for ( var i=0; i<ca.length; i++ ) {
      var c = ca[i];
      while (c.charAt(0)==' ') { c = c.substring(1,c.length); }
      if (c.indexOf(nameEQ) == 0) {
        var text = c.substring(nameEQ.length,c.length);
        return text ? JSON.parse( decodeURIComponent(text) ) : null;
      }
    }
    return;
  }

  var verifyUser = function ( req, ignorIsWriter ) {
    var user = getUserFromCookie( req );
    if ( ! user ) { return 'NodeServer: missing user for getting authority.'; }
    if ( ! user.group ) { return 'NodeServer: missing user-group for getting authority.'; }

    var authority = authentication.getAuthorityByGroup( user.group, config.environment, config.appKey );
    if ( ! authority || (authority !== 'w' && ! ignorIsWriter) ) { return 'NodeServer: user permission denied.'; }
    return;
  };

  var getAPIdata = function( req, res, url) {
    var error = verifyUser(req, true);
    if ( error ) {
      requestCallback( res, error );
    } else {
      request({'url':url, 'method':'GET'}, function(error, response, body ){
        var result = null;
        try {
          result = JSON.parse(body || '{}');
        } catch (error) { result = null; }
        res.send({'result': result});
      });
    }
  };

  /******************************************************************************
  ******************************************************************************/
  app.use('/api/getEnvironment', function (req, res) {
    res.send({'result': config.environment});
  });
};

module.exports = API;