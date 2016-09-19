/****
 * 
 * The plugin allows to integrate a customizable, 
 * Browser Support Details
 *   - FireFox 5.0+
 *   - Safari 5.0+
 *   - Chrome 19.0+
 *   - Internet Explorer 7+
 *   - Android 2.3+ 
 *   - Opera 12.0+
 *   - iOS Safari 4.0+
 */
;(function($) { $.fn.SB1rememberCard = function ( config ) {
  if ( ! config ) { config = {}; }

  /****************************************************************************
    === CONFIGURATION OPTION === 
  ****************************************************************************/
  var opt = {
    'main' : this,
    'continueCallback'     : config.continueCallback,
    'discardCallback'      : config.discardCallback,
    'beforeDiscardCallback': config.beforeDiscardCallback
  };

  var helper = {

    /*************************************************************************
      === Initialization ===
    **************************************************************************/
    init : function() {
      var slc = '.toggle_expander, .sb1_continue_remember_card, .sb1_discard_remember_card';
      opt.main.find( slc ).on('click', helper._click );
    },

    /*************************************************************************
      === PUBLIC FUNCTIOn ===
    **************************************************************************/
    getDuration : function( node ) {
      var v = node && node.size() ? 
        (node.css('transition-duration') || 0) : 0;
      if ( v ) { v = parseFloat( v ) * 1000; }
      return isNaN(v) ? 0 : v;
    },

    toggleExpanding : function( e ) {
      opt.main.toggleClass('open');
    },

    continueRememberCard : function( e ) {
      if ( typeof(opt.continueCallback) !== 'function' ) { return; }
      opt.continueCallback( opt.main );
    },

    discardRememberCard : function( e ) {
      var duration = helper.getDuration( opt.main ), render = function() {
        if ( typeof(opt.discardCallback)==='function' ) { 
          opt.discardCallback( opt.main, duration );
        }
        opt.main.remove();      
      };
      if ( typeof(opt.beforeDiscardCallback)==='function' ) { 
        opt.beforeDiscardCallback( opt.main, duration );
      }
      opt.main.addClass('discard');
      if ( duration ) {
        setTimeout( render, duration ); 
      } else {
        render();
      }
    },

    /*************************************************************************
      === INTERNAL FUNCTION ===
    **************************************************************************/
    _click : function( e ) {
      var current = $(e.currentTarget);
      if ( current.hasClass('toggle_expander') ) {
        e.preventDefault();
        helper.toggleExpanding();
      }
      else if ( current.hasClass('sb1_continue_remember_card') ) {
        e.preventDefault();
        helper.continueRememberCard();
      }
      else if ( current.hasClass('sb1_discard_remember_card') ) {
        e.preventDefault();
        helper.discardRememberCard();
      }      
    },

    _none : function() {}
  };

  var method = {};
  for ( var k in helper ) {
    if ( ! k.match(/^(init|setup|_)/i) ) { method[k] = helper[k]; }
  }
  
  this.SB1rememberCard = method;
  setTimeout( helper.init, 100 );
  return this;
}; })( jQuery );

/*
function debug( text, value ) {
  var debug = $('div#debugWidget'), v = '', d = new Date();
  if ( ! debug.size() ) {
    var s = 'z-index:1000; position:fixed; bottom:5px; right:5px; width:300px; height:300px;' +
      'background-color:#FFFFFF; overflow:scroll; border:1px solid red; display:block; font-size:11px';
    debug = $( '<div id="debugWidget" style="'+s+'"></div>').appendTo( $('body') );
  }
  
  var t = d.getMinutes() + ':' + d.getSeconds();
  if ( value ) {
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
  debug.html( t + '<br/>' + text + '<br/>' + v + '<div>&nbsp;</div>' + debug.html() );
}  
//*/