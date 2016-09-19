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
;(function($) { $.fn.SB1formRow = function ( config ) {
  if ( ! config ) { config = {}; }

  /****************************************************************************
    === CONFIGURATION OPTION === 
  ****************************************************************************/
  var opt = {
    'main': this,
    'move': config.move || '',
    'afterShow' : config.afterShowInfoCallback,
    'beforeShow': config.beforeShowInfoCallback
  };

  var helper = {
    /*************************************************************************
      === Initialization ===
    **************************************************************************/
    init : function() {
      opt.btn     = opt.main.find('.sb1_info_btn:not(.cloned)');
      opt.wrapper = opt.main.find('.sb1_info_wrapper');
      if ( ! opt.btn.size() || ! opt.wrapper.size() ) { return; }

      opt.cloned = opt.wrapper.find('.sb1_info_btn');
      if ( ! opt.cloned.size() ) {
        var temp = $('<div class="sb1_info_btn_wrapper"></div>').append(
          opt.btn.clone().removeAttr('id').addClass('cloned')
        ).insertBefore( opt.wrapper.children().eq(0) );
        opt.cloned = temp.find('.sb1_info_btn');
      }

      helper._verifyWrapperTop();
      opt.btn.off('click', helper._click ).on('click', helper._click );
      opt.cloned.off('click', helper._click ).on('click', helper._click );
      $(window).off('resize', helper._resize ).on('resize', helper._resize);

      var has    = opt.main.hasClass( 'show_information' );
      var option = has ? [opt.btn, opt.cloned] : [opt.cloned, opt.btn];
      option[0].show().attr('tabindex','-1').css('visibility','hidden'); 
      option[1].show().removeAttr('tabindex').css('visibility','visible');
      opt.wrapper.attr('aria-expanded', has ).attr('aria-hidden', ! has );
    },

    /*************************************************************************
      === PUBLIC FUNCTIOn ===
    **************************************************************************/


    /*************************************************************************
      === INTERNAL FUNCTION ===
    **************************************************************************/
    _click : function( e ) {
      e.preventDefault();
      var mode = 'show_information', has = opt.main.hasClass( mode );
      if ( ! has ) { helper._verifyWrapperTop(); }

      if ( typeof(opt.beforeShow)==='function' ) { 
        opt.beforeShow(opt.main, has );
      }

      opt.btn.blur(); opt.cloned.blur();

      var sc = helper._getScrollPosition(), vr = null;
      var bo = opt.btn.offset(), co = opt.cloned.offset();
      var bd = [bo.left, sc[1] ? (bo.top-sc[1]) : bo.top]; 
      var cd = [co.left, sc[1] ? (co.top-sc[1]) : co.top];

      if ( opt.move==='down' && ! has ) {
        cd[0] = bd[0]; vr = 1;
      }

      var mv = has ? [cd,bd] : [bd,cd];

      var option = has ? [opt.btn, opt.cloned] : [opt.cloned, opt.btn];
      var point  = [
        'left:'+mv[0][0]+'px;top:'+mv[0][1]+'px;position:fixed;z-index:100;', 
        'left:'+mv[1][0]+'px;top:'+mv[1][1]+'px;position:fixed;z-index:100;'
      ]; 

      opt.animation = opt.cloned.clone().removeAttr('id')
        .addClass('animation').attr('style', point[0]).appendTo( opt.main );

      var holder   = opt.wrapper.find('.text_holder');
      var height   = holder.prop('offsetHeight');
      var duration = parseFloat( opt.animation.css('transition-duration') || '0')*1000;

      if ( ! duration ) {
        helper._scrollToView( has, duration );
        if ( has ) { 
          holder.removeAttr('style');
          opt.main.removeClass( mode );
        }
        else {
          holder.attr('style','max-height:'+height+'px');
          setTimeout( function() { opt.main.addClass( mode ); }, 50);
        }
        opt.wrapper.attr('aria-expanded', !has ).attr('aria-hidden', has );
        setTimeout( function() { holder.removeAttr('style'); }, 800 );
        return opt.animation.remove();          
      }

      opt.main.addClass('on_animation');
      setTimeout( function() {
        helper._scrollToView( has, duration );
        option[1].hide(); option[0].hide();
        if ( has ) { 
          holder.removeAttr('style');
          opt.main.removeClass( mode );
        }
        else {
          holder.attr('style','max-height:'+height+'px');
          setTimeout( function() { opt.main.addClass( mode ); }, 50);
        }
        opt.wrapper.attr('aria-expanded', !has ).attr('aria-hidden', has );
        setTimeout( function() { holder.removeAttr('style'); }, 800 );
        setTimeout( function() {
          if ( vr === 1 ) {
            var m = opt.main.offset().left + parseInt( opt.main.css('padding-left'));
            var p = option[0].parent(), w = p.prop('clientWidth');
            p.css({'left':(bd[0]-m)+'px','right':'auto', 'margin-left': '-'+parseInt(w/2)+'px'});   
          }
          else if ( opt.move === 'down' ) {
            option[1].parent().removeAttr('style');
          }


          option[1].show().attr('tabindex','-1').css('visibility','hidden'); 
          option[0].show().removeAttr('tabindex').css('visibility','visible').focus();
          opt.animation.remove();          
          opt.main.removeClass('on_animation');
        }, duration );
        opt.animation.attr('style',point[1]);   
        //debug( duration );
      }, 20 );  
    },

    /*
    _click : function( e ) {
      e.preventDefault();
      var mode = 'show_information', has = opt.main.hasClass( mode );
      if ( ! has ) helper._verifyWrapperTop();

      opt.btn.blur(); opt.cloned.blur();

      var main = opt.main;//opt.btn.parent(); //opt.main;
      var mo = main.offset(), bo = opt.btn.offset(), co = opt.cloned.offset();
      var bd = [bo.left-mo.left, bo.top-mo.top], cd = [co.left-mo.left,co.top-mo.top];

      var bs = 'left:'+bd[0]+'px;top:'+bd[1]+'px;', cs = 'left:'+cd[0]+'px;top:'+cd[1]+'px;';
      var point  = has ? [cs,bs] : [bs,cs];
      var option = has ? [opt.btn, opt.cloned] : [opt.cloned, opt.btn];

      opt.animation = opt.cloned.clone().removeAttr('id')
        .addClass('animation').attr('style', point[0]).appendTo( main );

      var holder   = opt.wrapper.find('.text_holder');
      var height   = holder.prop('offsetHeight');
      var duration = parseFloat( opt.animation.css('transition-duration') || '0')*1000;
      if ( ! duration ) {
        helper._scrollToView( has, duration );
        if ( has ) { 
          holder.removeAttr('style');
          opt.main.removeClass( mode );
        }
        else {
          holder.attr('style','max-height:'+height+'px');
          setTimeout( function() { opt.main.addClass( mode ); }, 50);
        }
        opt.wrapper.attr('aria-expanded', !has ).attr('aria-hidden', has );
        setTimeout( function() { holder.removeAttr('style'); }, 800 );
        return opt.animation.remove();          
      }

      opt.main.addClass('on_animation');
      setTimeout( function() {
        helper._scrollToView( has, duration );
        option[1].hide(); option[0].hide();
        if ( has ) { 
          holder.removeAttr('style');
          opt.main.removeClass( mode );
        }
        else {
          holder.attr('style','max-height:'+height+'px');
          setTimeout( function() { opt.main.addClass( mode ); }, 50);
        }
        opt.wrapper.attr('aria-expanded', !has ).attr('aria-hidden', has );
        setTimeout( function() { holder.removeAttr('style'); }, 800 );
        setTimeout( function() {
          option[1].show().attr('tabindex','-1').css('visibility','hidden'); 
          option[0].show().removeAttr('tabindex').css('visibility','visible').focus();
          opt.animation.remove();          
          opt.main.removeClass('on_animation');
        }, duration );
        opt.animation.attr('style',point[1]);   
        //debug( duration );
      }, 20 );   
    },
    */

    _resize : function( e ) {
      clearTimeout( opt.timer || 0 );
      setTimeout( helper._verifyWrapperTop, 15 );
    },

    _verifyWrapperTop : function() {
      if ( ! opt.wrapper.prop('offsetWidth') ) { return; }

      opt.wrapper.removeAttr('style');

      var bo  = opt.btn.offset();
      var wo  = opt.wrapper.offset();
      var top = bo.top - wo.top; 

      opt.wrapper.css({'margin-top': top+'px'});
    },

    _scrollToView : function( has, duration ) {
      var bo = opt.btn.offset(), co = opt.cloned.offset(), diff = co.top - bo.top;
      if ( diff < 0 ) { diff *= -1;   }
      if ( diff < 5 ) { return false; }

      if ( typeof(has) !== 'boolean' ) { 
        has = opt.main.hasClass( 'show_information' );
      }

      var scrolled = helper._getScrollPosition(), size = helper._getWindowSize();
      var view = [scrolled[1], scrolled[1]+size[1]];
      var top  = has ? bo.top - 10 : 
        co.top + opt.cloned.prop('clientHeight') + 35;

      if ( view[0]<top && view[1]>top ) { return false; }

      if ( ! has ) { top = scrolled[1] + (top-view[1]); }

      $('html, body').animate({'scrollTop':top+'px'}, duration||300, function(){});
      return true;
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

      if ( size[0] ) { size[0] -= 20; }
      return size;
    },

    _none : function() {}
  };

  var method = {};
  for ( var k in helper ) {
    if ( ! k.match(/^(init|setup|_)/i) ) { method[k] = helper[k]; }
  }
  
  this.SB1formRow = method;
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