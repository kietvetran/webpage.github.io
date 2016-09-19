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
;(function($) { $.fn.SB1accordionMenu = function ( config ) {
  if ( ! config ) config = {};

  /****************************************************************************
    == CONFIGURATION OPTION == 
  ****************************************************************************/
  var opt = {
    'main'    : this,
    'list'    : [],
    'language' : config.language || 'nb',
    'single'  : config.wizard ? true : config.single,
    'summary' : config.wizard ? true : config.summary,
    'wizard'  : config.wizard,
    'form_node': config.form_node,
    'next_Click_callback' : config.next_Click_callback,
    'validation' : config.validtion || {
      'language' : config.language || 'nb'
    },
    'mode' : {
      'active'   : 'accordion_active',
      'inactive' : 'accordion_inactive',
      'off'      : 'accordion_disabled', 
      'wait'     : 'accordion_wait', 
      'view'     : 'on_view',
      'passed'   : 'accordion_passed_step',
      'warning'  : 'accordion_warning',   
      'error'    : 'accordion_error'   
    }
  };

  var helper = {
    /*************************************************************************
      === Initialization ===
    **************************************************************************/
    init : function() {
      opt.tab     = opt.main.find('.sb1_accordion_tab');
      opt.panel   = opt.main.find('.sb1_accordion_panel');
      opt.nextBtn = opt.main.find('.sb1_accordion_next_btn');
      opt.tab.each(function(i,dom) {
        var t = $(dom), p = opt.panel.eq(i);
        t.attr('aria-controls',helper._generateId(p));
        opt.list.push({'tab':t,'panel':p,'nextBtn':p.find('.sb1_accordion_next_btn')});
      });

      opt.tab.off( 'click', helper._click ).on( 'click', helper._click );
      opt.nextBtn.off( 'click', helper._click ).on( 'click', helper._click );

      if ( opt.wizard ) opt.main.addClass('accordion_wizard');

      if ( ! opt.single ) return;
     
      var active = opt.mode.active, current = opt.tab.filter('.'+active);
      if ( current.size() ) {
        if ( current.size() > 1 ) 
          current.removeClass( active ).addClass( active );
      } 
      else if ( opt.wizard ) {
        opt.tab.eq(0).addClass( active );
        opt.form_node = opt.form_node === null || typeof(opt.form_node)=='undefined' ? 
          opt.main.closest('form') : (typeof(opt.form_node)=='string' ?
            opt.main.closest( opt.form_node ) : null
          );
        if ( opt.form_node && opt.form_node.size() ) {
          try {
            opt.form_node.SB1formValidation( opt.validation );
          } catch( error ) { 
            opt.form_node = null;
          }
        }
      }
      var duration = helper.getDuration( opt.panel.eq(0) );
      helper.updateTabPanelMode(null, (duration*-1)+20, null, null, true );
    },

    /*************************************************************************
      === PUBLIC FUNCTIOn ===
    **************************************************************************/
    updateTabPanelMode : function( callback, delay, fStep, lStep, startup ) {
      clearTimeout( opt.timer || 0 );
      opt.timer = setTimeout( function() {
        helper._renderUpdateTabPanelMode( callback, delay, fStep, lStep, startup );
      }, 20 );
    },

    updateSummary : function( data ) {
      if ( ! data || ! data.tab || ! data.panel ) return;

      setTimeout( function() {
        var type ='accordion_summary', holder = data.tab.find('> .'+type);
        if ( ! holder.size() ) {
          if ( ! opt.summary ) return;
          holder = $('<div class="'+type+'"></div>').appendTo( data.tab );
        }

        var check = ['sb1_form_validation_has_error', 'sb1_value_comfirm'];
        var out   = [], input = data.panel.find('.display_accordion_summary');
        var loop  = input.size(), i = 0, pin = {};
        for ( i; i<loop; i++ ) {
          var node = input.eq(i), value = helper._trim( node.prop('value') );
          if ( ! value ) continue;

          var id = node.attr('id');
          if ( pin[id] ) continue;
          pin[id] = true;

          var unit = node.attr('data-unit') || '';
          if ( unit ) unit = ' '+unit;

          var kind = ['text_item'], lead = '', label = id ? 
            data.panel.find('label[for="'+id+'"]') : null;
          if ( label && label.size() ) {
            lead = label.attr('data-shortname');
            if ( lead === null ) lead = label.text() || '';
            if ( lead ) lead = helper._capitaliseFirstLetter( lead ) + ': ';
          }

          if ( node.hasClass(check[0]) ) kind.push( chekc[0] );
          if ( node.hasClass(check[1]) ) kind.push( chekc[1] );
          out.push('<span class="'+kind.join(' ')+'">'+lead+value+unit+'</span>');
        }
        holder.html( out.length ? out.join(', ') : '&nbsp;' );
      }, 100);
    },

    getDuration : function( node ) {
      var v = node && node.size() ? 
        (node.css('transition-duration') || 0) : 0;
      if ( v ) v = parseFloat( v ) * 1000;
      return isNaN(v) ? 0 : v;
    },

    getIndexLastNotDisabled : function() {
      var off = opt.tab.filter('.'+opt.mode.off);
      return (off.size() ? opt.tab.index( off.eq(0) ) : opt.tab.size()) - 1;
    },

    getIndexLastPassedTab : function() {
      var passed = opt.tab.filter('.'+opt.mode.passed);
      return opt.tab.index( passed.last() );      
    },

    getPanel : function() { return opt.panel; },
    getTab   : function() { return opt.tab;   },

    /*************************************************************************
      === INTERNAL FUNCTION ===
    **************************************************************************/
    _renderUpdateTabPanelMode : function( callback, delay, fStep, lStep, startup ) {
      var list = opt.list, loop = list.length, mode = opt.mode, step = opt.wizard ? (
        typeof(fStep)=='number' ? fStep : (helper.getIndexLastPassedTab()+1)
      ) : -1;

      var counter = [0,0], duration = ! opt.single ? 0 : helper.getDuration( list[0].panel );
      var cPane   = opt.panel.filter('.'+mode.active).addClass( mode.view );  
      var cTab    = opt.tab.filter('.'+mode.active), isActive = false;  

      for ( i=0; i<loop; i++ ) {
        if ( duration ) { 
          list[i].panel.addClass( mode.wait );
          list[i].tab.addClass( mode.wait );
        }
        helper.updateSummary( list[i] );
        isActive = list[i].tab.hasClass(mode.active);

        if ( (step<0 && isActive) || (step>=0 && step==i) ) {
          list[i].panel.removeClass(mode.inactive).addClass(mode.active)
            .attr('aria-hidden','false');
          list[i].tab.addClass(mode.active);
          counter[0]++;
        }
        else {
          list[i].panel.removeClass(mode.active).addClass(mode.inactive)
            .attr('aria-hidden','true'); 
          list[i].tab.removeClass(mode.active);
          counter[1]++;
        }
        if ( ! opt.wizard ) continue;

        if ( i<=step || (typeof(lStep)=='number' && i<=lStep) ) {
          list[i].tab.removeClass( mode.off ).attr('aria-disabled','false');
          list[i].panel.removeClass( mode.off ).attr('aria-disabled','false');
        }
        else {
          list[i].tab.addClass( mode.off ).attr('aria-disabled','true');
          list[i].panel.addClass( mode.off ).attr('aria-disabled','true');
        }
      }

      if ( ! duration || (!counter[0] && !counter[1]) ) 
        return typeof(callback) == 'function' ? callback() : null;

      var wSize  = helper._getWindowSize(), scrolled = helper._getScrollPosition();
      var action = function() {
        var current = opt.tab.filter('.'+mode.active);
        var top = opt.wizard && ! startup && current.size() ? current.offset().top-10 : -1;        

        if ( top>0 && (top<scrolled[1] || top>scrolled[1]+wSize[1]) ) {
          $('html, body').animate({'scrollTop': top+'px' }, 500, function() {
            current.removeClass( mode.wait );
            opt.panel.filter( '.'+mode.active ).each( function(i,dom){
              var node = $(dom), height = wSize[1];
              node.find('.error_summary_holder.on_hidden').remove();
              node.removeClass(mode.wait).attr('style','max-height:'+height+'px');
              setTimeout( function() { node.removeAttr('style'); }, duration );
            });
           if ( typeof(callback) == 'function' ) callback({'duration':duration}); 
          });
        }
        else {
          current.removeClass( mode.wait );
          opt.panel.filter( '.'+mode.active ).each( function(i,dom){
            var node  = $(dom), height = wSize[1];
            node.find('.error_summary_holder.on_hidden').remove();
            node.removeClass(mode.wait).attr('style','max-height:'+height+'px');
            setTimeout( function() { node.removeAttr('style'); }, duration );
          });
          if ( typeof(callback) == 'function' ) callback({'duration':duration}); 
        }
      };

      var verify = function() {
        var s = 'max-height:'+wSize[1]+'px;', a = opt.panel.filter( '.'+mode.inactive );
        var w = a.filter('.'+mode.view), top = w.size() ? w.offset().top : 0;
        if ( top && (top>(scrolled[1]+wSize[1]) || top<scrolled[1]) ) {
          s = 'max-height:0;';
          duration = -1;
        }

        w.attr('style',s);
        setTimeout( function() {
          a.removeClass( mode.wait ).removeClass( mode.view );
          //a.removeAttr('style').filter('.'+mode.off).size() == a.size() || duration <= 0 ? 
          //  action() : setTimeout( action, duration + (delay || 0) );
          var os = a.removeAttr('style').filter('.'+mode.off).size();
          if ( os == a.size() || duration <= 0 )  
            action(); 
          else
            setTimeout( action, duration + (delay || 0) );
        }, 20 );
      };

      if ( counter[0] && ! counter[1] ) {
        opt.tab.filter( '.'+mode.active ).removeClass( mode.wait );
        opt.panel.filter( '.'+mode.active ).removeClass( mode.wait );
      }
      else if ( ! counter[0] && counter[1] ) {
        opt.tab.filter( '.'+mode.inactive ).removeClass( mode.wait );
        opt.panel.filter( '.'+mode.inactive ).removeClass( mode.wait );
      }
      else { verify(); }
    },

    _click : function( e ) {
      e.preventDefault();
      var node  = $(e.currentTarget), off = opt.mode.off;
      if ( node.hasClass(off) ) return;

      var isBtn = node.hasClass('sb1_accordion_next_btn');
      var index = isBtn ? opt.nextBtn.index( node ) : opt.tab.index( node );
      if ( index < 0 ) return;

      if ( isBtn ) {
        helper._clickOnFormNode( node, index );
        if ( typeof(opt.next_Click_callback)=='function')
          opt.next_Click_callback( e );
      }
      else {
        helper._clickOnTab( node, index );        
      }
    },

    _clickOnTab : function ( node, index ) {
      var recall = null, delay = 0, force = null, last = null; 
      var mode = opt.mode, duration = helper.getDuration( opt.panel.eq(0) );
      
      if ( opt.wizard  ) {
        if ( node.hasClass(mode.active) ) return;
        var current = opt.tab.filter('.accordion_active');
        if ( ! current.size() ) current = opt.tab.eq(0);

        var loop = opt.list.length;
        force = index; delay = 100;
        last  = helper.getIndexLastNotDisabled();
        var cIndex  = opt.tab.index( current );
        if ( cIndex != last ) {
          if ( helper._validatePanelInput( cIndex ) ) return;
        }

        for ( var i=cIndex+1; i<last; i++ ) {
          if ( helper._validatePanelInput(i,true) ) {
            force = i;
            i = last;
          }
        }

        var top = current.offset().top - 10;
        return $('html, body').animate({ 'scrollTop': top+'px' }, duration || 500, function(){
          helper.updateTabPanelMode(recall, delay, force, last );
        });
      }
      else if ( opt.single  ) {
        opt.tab.removeClass( mode.active );
        node.addClass( mode.active );
        delay = 100;
      }       
      else { 
        delay = (duration*-1) + 20;
        node.toggleClass( mode.active ); 
      }

      helper.updateTabPanelMode(recall, delay, force, last );
    },

    _clickOnFormNode : function ( node, index ) {
      var error = isNaN(index) ? 0 : helper._validatePanelInput( index );
      if ( error || ! opt.wizard ) return;

      var list = opt.list, data = list[index], loop = list.length;
      var last = helper.getIndexLastNotDisabled();

      for ( var i=0; i<loop; i++ ) { 
        if ( i<=index ) 
          list[i].tab.addClass( opt.mode.passed );
        else
          list[i].tab.removeClass( opt.mode.passed );
      }

      var top =  data.tab.offset().top-10;
      $('html, body').animate({ 'scrollTop': top+'px' }, 500, function(){
        helper.updateTabPanelMode(null,null,null,last);
      });
    },

    _validatePanelInput : function ( index, ignorFocus ) {
      var data = opt.list[index], error = 0; 
      var type = 'error_summary_holder', sum = '<div class="'+type+'"></div>';

      if ( opt.form_node && data && data.panel ) {
        var input = data.panel.find('input:not([type="submit"]):not([type="reset"])');
        try {
          opt.form_node.SB1formValidation.validate( input );
          error = input.filter('.sb1_form_validation_has_error').size();
          if ( error ) {
            data.panel.find('.error_summary_holder').remove();
            var row = data.panel.find('.sb1_form_row');
            if ( row.size() ) row = row.eq(0).find('.sb1_row_content').eq(0);
     
            $( sum ).insertBefore( (row.size() ? row : data.panel).children().first() );
            $( sum ).insertBefore( data.nextBtn.first() );
            opt.form_node.SB1formValidation.showSummary( data.panel.find('.'+type), ignorFocus );
          }
        } catch( failed ) {}
      }
      return error;
    },


    /*
    _clickOnFormNode : function ( node, index ) {
      var list  = opt.list, data = list[index], loop = list.length, i = 0; 
      var type  = 'error_summary_holder', sum = '<div class="'+type+'"></div>';
      var error = 0, passed = 'accordion_passed_step';
      if ( opt.form_node ) {
        var input = data.panel.find('input:not([type="submit"]):not([type="reset"])');
        try {
          opt.form_node.SB1formValidation.validate( input );
          error = input.filter('.sb1_form_validation_has_error').size();
          if ( error ) {
            data.panel.find('.error_summary_holder').remove();
            var row = data.panel.find('.sb1_form_row');
            if ( row.size() ) row = row.eq(0).find('.sb1_row_content').eq(0);
     
            $( sum ).insertBefore( (row.size() ? row : data.panel).children().first() );
            $( sum ).insertBefore( data.nextBtn.first() );
            opt.form_node.SB1formValidation.showSummary( data.panel.find('.'+type) );
          }
        } catch( error ) {}
      }

      if ( ! opt.wizard ) return;

      for ( i=0; i<loop; i++ ) { 
        if ( i<=index ) 
          list[i].tab.addClass( passed );
        else
          list[i].tab.removeClass( passed );
      }

      if ( error ) return;
      var top = data.tab.offset().top-10;
      $('html, body').animate({ 'scrollTop': top+'px' }, 500, function(){
        helper.updateTabPanelMode();
      });
    },
    */

    _getScrollPosition: function(){
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
    },

    _getWindowSize : function() {
      var w = 0, h = 0, size = [0, 0];
      if ( ! window.innerWidth ) { // IE 
        //if ( !(document.documentElement.clientWidth === 0) ){
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

      if ( size[0] ) size[0] -= 20;
      return size;
    },

    _generateId : function( node ) {
      var id = node.attr('id');
      if ( ! id ) {
        id = 'auto_'+(new Date()).getTime()+'_'+Math.floor((Math.random()*1000)+1);
        node.attr('id',id);
      }
      return id;
    },

    _capitaliseFirstLetter : function(text){
      return text ? (text.charAt(0).toUpperCase()+text.slice(1).toLowerCase()): '';
    },

    _trim : function( text, multipleWhiteSpace ) {
      var out = (text || '').replace(/^\s+/, '').replace(/\s+$/g, '');
      return multipleWhiteSpace ? out.replace( /\s+/g, ' ' ) : out;
    },

    _none : function() {}
  };


  var method = {};
  for ( var k in helper ) {
    if ( ! k.match(/^(init|setup|_)/i) ) method[k] = helper[k];
  }

  this.SB1accordionMenu = method;
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