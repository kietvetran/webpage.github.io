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
;(function($) { $.fn.SB1sectionAppender = function ( config ) {
  if ( ! config ) config = {};

  /****************************************************************************
    == CONFIGURATION OPTION == 
  ****************************************************************************/
  var opt = {
    'main'    : this,
    'current' : config.current,
    'index'   : 0,
    'item'    : config.item,
    'tag'     : config.tag,
    'class'   : config.classname,
    'content' : config.content || '',
    'appender': config.appender,
    'timer'   : 0
  };

  var helper = {

    /*************************************************************************
      === Initialization ===
    **************************************************************************/
    init : function() {
      if ( ! opt.current || ! opt.current.size() ) return;

      var item = helper.getItem();
      if ( ! item.size() ) return;

      if ( ! opt.tag ) opt.tag = item.eq(0).prop('tagName');
    
      if ( opt.tag.toLowerCase() == 'a' ) opt.tag = 'div';

      var type = 'sb1_section_appender' + (opt.classname ? ' '+opt.classname : ''); 
      var style = 'width:100%;clear:both;', appender = opt.appender || $(
        '<'+opt.tag+' class="'+type+'" style="'+style+'">'+opt.content+'</'+opt.tag+'>'
      );

      opt.appenderId = helper._generateId( appender );
      opt.target = helper._getAppendingTarget( item );
      appender.insertAfter( opt.target );

      opt.main.addClass('sb1_section_appender_conatiner');
      $(window).off( 'resize', helper._resize ).on('resize', helper._resize);
    },

    /*************************************************************************
      === PUBLIC FUNCTIOn ===
    **************************************************************************/
    getAppender : function() { return $('#'+opt.appenderId); },

    getItem : function() {
      var mode = 'sectionAppenderPinTarget';
      var item = opt.main.find( opt.item || '> *').not('.sb1_section_appender').each( function(i,dom){
        var n = $(dom), w = n.prop('offsetWidth');
        if ( w ) n.addClass( mode );
      }).filter( '.'+mode );
      return item.removeClass( mode );
    },

    renewCurrentTarget: function( target ) {
      if ( ! target || ! target.size() ) return;
      var index = opt.item.index( target );
      if ( index < 0 ) return;
      opt.current = target;
    },

    /*************************************************************************
      === INTERNAL FUNCTION ===
    **************************************************************************/
    _getAppendingTarget : function( item ) {
      if ( ! item ) item = helper.getItem();
      var max  = opt.main.prop('offsetWidth'), first = opt.current, margin = [
        parseFloat(first.css('margin-left')  || '0'), 
        parseFloat(first.css('margin-right') || '0')
      ];

      var size  = first.prop('offsetWidth') + margin[0] + margin[1];
      var index = parseInt(max/size)-1, current = item.index( opt.current );
      var count = item.size(), cRow = parseInt(max/size);

      if ( index < current ) index = current;
      if ( index >= count  ) index = count-1;      
      else if ( index < 0  ) index = 0;

      var left = (index+1)%cRow;
      if ( left ) {
        index += (cRow-left);
        if ( index >= count  ) index = count-1;      
      }
 
      var target = item.eq( index );
      helper._generateId( target );
      return target;
    },

    _resize : function( e ) {
      //clearTimeout( opt.timer );
      //opt.timer = setTimeout( function() {
        var appender = helper.getAppender();
        if ( ! appender || ! appender.size() )
          return $(window).off('resize', helper._resize ); 

        var now = opt.target, target = helper._getAppendingTarget();

        if ( opt.current.prop('offsetWidth') ) 
          appender.removeClass('sb1_hide'); 
        else 
          appender.addClass('sb1_hide');

        if ( now.attr('id')==target.attr('id') ) return;
        opt.target = target;
        appender.insertAfter( opt.target );
      //}, 15 );
    },

    _generateId : function( node ) {
      var id = node ? node.attr('id') : null;
      if ( ! id ) {
        id = 'auto_'+(new Date()).getTime()+'_'+Math.floor((Math.random()*1000)+1);
        if ( node ) node.attr('id',id);
      }
      return id;
    },
    _none : function() {}
  };

  //for ( var k in helper ) {
  //  if ( ! k.match(/^(init|setup|_)/i) ) this[k] = helper[k];
  //}

  var method = {};
  for ( var k in helper ) {
    if ( ! k.match(/^(init|setup|_)/i) ) method[k] = helper[k];
  }
  
  this.SB1sectionAppender = method;
  setTimeout( helper.init, 100 );
  return this;
}; })( jQuery );

/*
function debug( text, value ) {
  var debug = $('div#debugWidget'), v = '', d = new Date();
  if ( ! debug.size() ) {
    var s = 'z-index:1000; position:fixed; bottom:5px; right:5px; width:300px; height:300px;' +
      'background-color:#FFFFFF; overflow:scroll; border:1px solid red; display:block;';
    debug = $( '<div id="debugWidget" style="'+s+'"></div>').appendTo( $('body') );
  }
  
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
  debug.html( t + '<br/>' + text + '<br/>' + v + '<div>&nbsp;</div>' + debug.html() );
}  
//*/