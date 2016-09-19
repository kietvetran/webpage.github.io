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
;(function($) { $.fn.SB1sliderButton = function ( config ) {
  if ( ! config ) config = {};

  /****************************************************************************
    == CONFIGURATION OPTION == 
  ****************************************************************************/
  var opt = {
    'main'    : this,
    'size'    : null,
    'timer'   : {'on':{}},
    'concat'  : '',
    'selector': 'input:not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="reset"])',
    'validation': typeof(config.validation) === 'undefined' ?  {} : 
      config.validation,
  };

  var helper = {
    /*************************************************************************
      === Initialization ===
    **************************************************************************/
    init : function() {
      var size = null, base = [0,100], slider = null;
      opt.input = opt.main.find( opt.selector ).each( function(i,dom){
        helper._generateId( $(dom) );
      });

      opt.btn = opt.main.find('.sb1_slider_btn').on('mousedown touchstart', function(e){ 
        slider = $(this); 
      });
      opt.btn.on('keydown', helper._keydown ).parent().on('click', helper._click );
      opt.input.on('keyup', helper._keyup).on('focus', helper._focus).on('blur', helper._blur);

      opt.tail = opt.main.find('.sb1_slider_tail');

      opt.btn.each( function(i,dom) {
        var btn = $(dom);
        var now = btn.attr('aria-valuenow') ? parseInt(btn.attr('aria-valuenow')) : 0;
        var min = btn.attr('aria-valuemin') ? parseInt(btn.attr('aria-valuemin')) : 0;
        var max = btn.attr('aria-valuemax') ? parseInt(btn.attr('aria-valuemax')) : 100;
        if ( isNaN(now) ) now = 0;

        if ( ! isNaN(min) && ! isNaN(max) ) {
          size = [isNaN(min) ? 0 : min,isNaN(max) ? 100 :max];
          if ( size[1] < size[0] ) {
            size[2] = size[0];
            size[0] = size[1];
            size[1] = size[2];
            size[2] = null;
          }

          base = size;
          if      ( now < size[0] ) now = size[0];
          else if ( now > size[1] ) now = size[1];
          size[2] = size[1]-size[0];
        }  

        opt.size = size;

        btn.attr('aria-valuemin', base[0]).attr('aria-valuemax',base[1])
          .attr('aria-valuenow',now).html( now );
        helper._render(null, btn, now);
      });

      if ( opt.input.eq(0).attr('type') != 'hidden' )
        opt.btn.attr('tabindex','-1');

      $( document ).on('mouseup mousemove touchend touchmove', function(e) {
        if  ( e.type == 'mouseup'   || e.type == 'touchend'   ) {
          slider = null;
          if ( e.type == 'touchend' ) {
            opt.touchRender = (opt.touchRender || 0)+1;
            setTimeout( function() { opt.touchRender = 0; }, 50 );
          }
        }
        else if ( e.type == 'mousemove' || e.type == 'touchmove'  ) {
          helper._render( e, slider );
          if ( e.type == 'touchmove' ) opt.touchRender = 1;
        }
      });

      if ( ! opt.validation || ! opt.input.size() ) return;
      opt.main.SB1formValidation( opt.validation );
    },

    /*************************************************************************
      === PUBLIC FUNCTIOn ===
    **************************************************************************/


    /*************************************************************************
      === INTERNAL FUNCTION ===
    **************************************************************************/
    _getTrackPercent : function( e ) {
      if ( ! e ) return 0;
      var track = opt.btn.parent(), offset = track.offset(), left = offset.left;
      var where = [left, left+track.prop('clientWidth')]; 
      var x     = helper._getEventPosition(e, e.type.match(/touch/i) )[0];
      if ( x < where[0] || x > where[1] ) return x < where[0] ? 0 : 100;
      return parseFloat( (x-where[0])/(where[1]-where[0]) )*100;
    },

    _render : function( e, current, force, changeFromInput ) {
      if ( ! current ) return;
      var percent = 0, size = opt.size;
      if ( typeof(force)=='number' ) {
        if ( ! size ) return;
        percent = parseFloat((force-size[0]) / (size[1]-size[0]))*100;
      }
      else {
        percent = helper._getTrackPercent( e );
      }

      if ( isNaN(percent) ) return;

      var value = ! size ? Math.round(percent) :
        (size[0]+Math.round(parseFloat(percent/100)*size[2]));
      current.css({'left': percent+'%'}).html( value ).attr('aria-valuenow',value)
        .attr('data-value',percent);

      if (opt.tail && opt.tail.size() ){
        if ( opt.btn.size() < 2 )
          opt.tail.css({'width': percent+'%'});
        else {
          var a = parseFloat(opt.btn.eq(0).attr('data-value'));
          var b = parseFloat(opt.btn.eq(1).attr('data-value'));
          var d = a<b ? [a,b] : [b,a];
          opt.tail.css({'left':d[0]+'%', 'right':(100-d[1])+'%'});
        }
      }

      //current.prev('input[type="hidden"]').val( value );
      //debug('V: ' +value);

      if ( window.getSelection ) window.getSelection().removeAllRanges();
      else if ( document.selection ) document.selection.empty();

      if ( changeFromInput || ! opt.input.size() ) return;
      
      if ( opt.input.size() > 1 ) {
        var temp = 0, data = [
          parseInt(opt.btn.eq(0).attr('data-value')),
          parseInt(opt.btn.eq(1).attr('data-value'))
        ];
        if ( isNaN(data[0]) || isNaN(data[1]) ) return;

        if ( data[0]>data[1] ) {
          temp = data[0];
          data[0] = data[1];
          data[1] = temp;
        }
        setTimeout( function() {       
          opt.input.eq(0).prop('value', data[0] ).trigger('validate');
          opt.input.eq(1).prop('value', data[1] ).trigger('validate');
        }, 20 );
      }
      else {
        setTimeout( function() {       
          opt.input.prop('value', value ).trigger('validate');
        }, 20 );
      }
    },

    _keyup : function( e ) {      
      var field = $(e.target), id = field.attr('id'), error = 'sb1_form_validation_has_error';
      clearTimeout( opt.timer[id] || 0 );
      clearTimeout( opt.timer.switching || 0 );

      opt.timer[id] = setTimeout( function() {
        field.trigger('validate', {'callback': function() {
          if ( field.hasClass(error) ) return;

          var index = opt.input.index( field );
          var value = parseFloat( field.prop('value').replace(/\s+/g,'') );
          if ( opt.input.size() > 1 ) {
            var data = [
              parseInt(opt.input.eq(0).prop('value').replace(/\s+/g,'')),
              parseInt(opt.input.eq(1).prop('value').replace(/\s+/g,''))
            ];
            if ( isNaN(data[0]) || isNaN(data[1]) ) return; 

            if ( data[0]>data[1] ) {
              return;
              /*
              temp = data[0];
              data[0] = data[1];
              data[1] = temp;
              opt.timer.switching = setTimeout( function() {
                opt.input.eq(0).prop('value',data[0]);
                opt.input.eq(1).prop('value',data[1]);
              }, 1000 );
              */
            } 
            helper._render( null, opt.btn.eq(0), data[0], true );
            helper._render( null, opt.btn.eq(1), data[1], true );
          }
          else {
            if ( isNaN(value) ) {
              value = index < 1 ? opt.size[0] : opt.size[1];
              field.prop('value', value );
            }
            helper._render( null, opt.btn.eq(0), value, true );
          }
        }});
      }, 200 );
    },

    _keydown : function( e ) {
      var c = e.keyCode, isA = c >= 37 && c <= 40, isD = c >= 48 && c <= 57;
      var btn = $(e.currentTarget), size = opt.size;
      if ( (! isA && ! isD) || ! btn || ! size ) return;

      if ( isD ) clearTimeout( opt.timer.keydown || 0 );
      var v = String.fromCharCode(e.charCode || e.keyCode);
      var n = btn.attr('aria-valuenow') ? parseInt(btn.attr('aria-valuenow')) : 0;
      if ( isD ) {
        opt.concat += v;
        n     = parseInt( opt.concat );
        opt.timer.keydown = setTimeout( function() { opt.concat = ''; }, 1000 );
      }
      else {
        var d = parseInt((size[1]-size[0])/10);
        n += (d * (c == 37 || c == 38 ? -1 : 1)); 
      }

      if      ( n < size[0] ) n = size[0];
      else if ( n > size[1] ) n = size[1];
      helper._render( null, btn, n );
    },

    _focus : function() {
      clearTimeout( opt.timer.verifyFieldValue || 0 );
    },

    _blur : function() {
      if ( opt.input.size() < 2 ) return;
      opt.timer.verifyFieldValue = setTimeout( function() {
        var data = [
          parseInt(opt.input.eq(0).prop('value').replace(/\s+/g,'')),
          parseInt(opt.input.eq(1).prop('value').replace(/\s+/g,''))
        ];
        if ( isNaN(data[0]) || isNaN(data[1]) || data[0]<=data[1] ) return;

        opt.input.eq(0).prop('value',data[1]);
        opt.input.eq(1).prop('value',data[0]);
        helper._render( null, opt.btn.eq(0), data[1], true );
        helper._render( null, opt.btn.eq(1), data[0], true );        
      }, 50 );
    },

    _click : function( e ) {
      if ( opt.touchRender == 2  ) return;
      if ( opt.btn.size() < 2 ) return helper._render( e, opt.btn ); 

      var percent = helper._getTrackPercent( e );
      var btn = helper._getClosestBtn( percent );
      helper._render( e, btn );
    },

    _getClosestBtn : function( percent ) {
      if ( typeof(percent) != 'number' || opt.btn.size() < 2 ) return opt.btn.eq(0);
      var data = [
        helper._getDistance( parseFloat(opt.btn.eq(0).attr('data-value')) || 0, percent ),
        helper._getDistance( parseFloat(opt.btn.eq(1).attr('data-value')) || 0, percent )
      ];
      return opt.btn.eq( data[0]<data[1] ? 0 : 1 );
    },

    _getDistance : function ( pointA, pointB ) {
      if ( typeof(pointA) != 'number' || typeof(pointB) != 'number' ) return 0;

      var data = pointA < pointB ? [pointA,pointB] : [pointB,pointA]; 

      if ( data[0]<0 && data[1]<0 ) return (data[1]*-1)-(data[0]*-1);
      if ( data[0]>=0 && data[1]>=0 ) return data[1]- data[0];
      return data[1]+(data[0]*-1);
    },

    _getEventPosition : function( e, touch ) {
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
  
  this.SB1sliderButton = method;
  setTimeout( helper.init, 100 );
  return this;
}; })( jQuery );

/*
function debug( text, value ) {
  var debug = $('div#debugWidget'), v = '', d = new Date();
  if ( ! debug.size() ) {
    var s = 'z-index:1000; position:fixed; bottom:5px; right:5px; width:300px; height:70px;' +
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