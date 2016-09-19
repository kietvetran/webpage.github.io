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
;(function($) { $.fn.SB1radioYesNoButton = function ( config ) {
  if ( ! config ) { config = {}; }

  /****************************************************************************
    === CONFIGURATION OPTION === 
  ****************************************************************************/
  var opt = {
    'main'          : this,
    'changeCallback': config.changeCallback
  };

  var helper = {

    /*************************************************************************
      === Initialization ===
    **************************************************************************/
    init : function() {
      opt.all   = opt.main.find('[type="radio"]');
      opt.count = opt.all.size();
      opt.all.each( function(i,dom){
        var node = $(dom).addClass('view_yes_no_btn');
        if ( typeof(opt.changeCallback)==='function' ) { 
          node.on('change', opt.changeCallback );
        }
        helper.setupRadioViewButton( node, i );
      });
    },

    setupRadioViewButton : function( node, position ) {
      if ( ! node ) { return; }

      var text  = node.next( 'label' ).html() || '', name = node.attr('name');
      var type  = 'sb1-input-radio-label', same = helper._getInputByName( name );
      var index = same.index( node ), kind  = 'position_'+index+ ' total_'+same.size();
      var btn   = $('<a href="#" class="'+type+' '+kind+'" role="radio"><div><div>'+text+'</div></div></a>')
        .insertAfter( node.attr('tabindex','-1') );
      var list  = ['aria-labelledby', 'aria-label'], rule = helper._getRule(node);

      for ( var i=0; i<list.length; i++ ) {
        var t = node.attr( list[i] );
        if ( t ) { btn.attr( list[i], t ); }
      }

      var change = function() {
       //helper._getInputByName( name ).each( function(i,dom) {
       same.each( function(i,dom) {
          var n = $(dom), a = n.next( '.'+type );
          if ( a.size() ) { a.attr('aria-checked', n.prop('checked') ); }
          helper._verifyTab( n );
        });
      }, click = function( e ) {
        e.preventDefault();
        if ( node.prop('disabled') ) { return false; }
        node.click().prop('checked', true).focus().blur();
        btn.focus();
        change();
      }, keydown = function( e ) {
        var code = e.keyCode;
        if ( e.keyCode === 32 ) {
          e.preventDefault(); 
          btn.click();
        }
        else if ( code === 37 || code === 39 ) {
          /*
          var all = helper._getInputByName( name );
          var index = all.index( node );
          var next  = index + (code===37 ? -1 : 1);
          if ( next>=0 && next < all.size() ) 
            all.eq( next ).next( '.'+type ).focus(); 
          */
          var next  = index + (code===37 ? -1 : 1);
          if ( next>=0 && next < same.size() ) { 
            same.eq( next ).next( '.'+type ).focus(); 
          }
        }
      };

      var tt = 'tabpanel_target', panel = rule[tt] ? $(rule[tt]) : null;
      if ( panel && panel.size() ) {
        setTimeout( function() { helper._verifyTab( node, true ); }, 100 );
        btn.attr('aria-controls', helper._generateId(panel) )
          .addClass('has_tabpanal_target');
      }

      btn.on('click', click ).on('keydown', keydown)
        .attr('aria-checked', node.prop('checked') );
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

    /*************************************************************************
      === INTERNAL FUNCTION ===
    **************************************************************************/
    _verifyTab : function( node, startup ) {
      var rule = node ? helper._getRule(node) || {} : {};
      var tt   = 'tabpanel_target', panel = rule[tt] ? $(rule[tt]) : null;
      if ( ! panel || ! panel.size() ) { return; }

      if ( ! node.prop('checked')  ) { 
        return panel.attr('aria-hidden', 'true').removeClass('sb1_active');
      }

      var duration = helper.getDuration( panel );
      if ( ! duration ) { 
        return panel.attr('aria-hidden', 'false').addClass('sb1_active');
      }

      var style  = 'position:absolute;visibility:hidden;top:0;max-height:none;display:block;overflow:hidden;';
      var height = panel.attr('style',style).prop('clientHeight');
      var top    = panel.attr('style', 'height:1px;position:relative;').offset().top+100;
      var width  = panel.prop('clientWidth');

      var render = function() {
        panel.attr('style','overflow:hidden;max-height:'+height+'px').
          attr('aria-hidden', 'false').addClass('sb1_active');
        setTimeout( function() { panel.removeAttr('style'); }, duration );
      };

      if ( startup || isNaN(width) || ! width ) { return render(); }
      var scrolled = helper._getScrollPosition(), size = helper._getWindowSize();
      var view = [scrolled[1], scrolled[1]+size[1]];

      if ( view[0]<top && view[1]>top ) { return setTimeout( render, 20 ); }

      var nTop = node.offset().top, distance = top-nTop;
      if ( (nTop+distance) >= (nTop+size[1]) ) { return setTimeout( render, 20 ); }

      top = scrolled[1] + (top-view[1]);
      $('html, body').animate({'scrollTop':top+'px'}, duration||300,render);
    },

    _generateId : function( node ) {
      var id = node.attr('id');
      if ( ! id ) {
        id = 'auto_'+(new Date()).getTime()+'_'+Math.floor((Math.random()*1000)+1);
        node.attr('id',id);
      }
      return id;
    },

    _trim : function( text, multipleWhiteSpace ) {
      var out = (text || '').replace(/^\s+/, '').replace(/\s+$/g, '');
      return multipleWhiteSpace ? out.replace( /\s+/g, ' ' ) : out;
    },

    _getInputByName: function( name ) {
      return opt.all.filter('[name="'+name+'"]');
    },

    _getRule : function ( input ) {
      var node = $(input), rule = {}, list = [node.attr('data-rule')];
      if ( node.attr('required')  ) { list.push('required'); }
      if ( node.attr('minlength') ) { list.push('minlength['+node.attr('minlength')+']'); }
      if ( node.attr('maxlength') ) { list.push('maxlength['+node.attr('maxlength')+']'); }

      var type = node.attr('type') || '';
      var reg  = type ? new RegExp('(^|\\s)'+type+'(\\s|$)','i') : null;
      if ( reg && opt.method && opt.method.join(' ').match(reg) ) { 
        list.push( type ); 
      }
      
      var text = helper._trim( list.join(' '), true );
      if ( ! text ) { return; }

      var render = function( v, d ) {      
        if ( ! d ) { d = rule; }
        var m = v.match( /(\w+)\[(.*)\]/ );
        if ( m ) {
          if ( m[2].match( /(.*\,|^)(\w+\[.*\])/ ) ) {
            if ( ! d[m[1]] || typeof(d[m[1]]) === 'string' ) { d[m[1]] = {}; }
            render( m[2], rule[m[1]] );
          }
          else { d[m[1]] = m[2].match(/^[\d+\.]$/) ? parseFloat(m[2]) : m[2]; }
        }
        else { d[v] = ''; }
      };

      var test = text.match( /([\w\-\_]+)(\[[\w\s\"\,\_\.\#\-]+\])?(\s+|$)/g ) || [];
      for ( var i=0; i<test.length; i++ ) { 
        render( helper._trim(test[i],true) );
      }
      return rule;
    },


    _getScrollPosition: function(){
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
    },

    _getWindowSize : function() {
      var size = [0, 0];
      if ( ! window.innerWidth ) { // IE 
        if ( ! document.documentElement.clientWidth ){
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

      if ( size[0] ) { size[0] -= 20; }
      return size;
    },

    _none : function() {}
  };

  //for ( var k in helper ) {
  //  if ( ! k.match(/^(init|setup|_)/i) ) this[k] = helper[k];
  //}

  var method = {};
  for ( var k in helper ) {
    if ( ! k.match(/^(init|setup|_)/i) ) { method[k] = helper[k]; }
  }
  
  this.SB1radioYesNoButton = method;
  setTimeout( helper.init, 100 );
  return this;
}; })( jQuery );

/*
function debug( text, value ) {
  var debug = $('div#debugWidget'), v = '', d = new Date();
  if ( ! debug.size() ) {
    var s = 'z-index:1000; position:fixed; bottom:5px; right:5px; width:300px; height:300px;' +
      'background-color:#FFFFFF; overflow:scroll; border:1px solid red; display:block;font-size:11px;line-height:15px;';
    debug = $( '<div id="debugWidget" style="'+s+'"></div>').appendTo( $('body') );
  }
  
  var t = d.getMinutes() + ':' + d.getSeconds();
  if ( value ) {
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