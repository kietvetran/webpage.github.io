/*
 * jquery.MWimageSwipe 1.0
 * 
 * The plugin allows to integrate a customizable, cross-browser content slider 
 * into your web presence and it is responsive support. Designed for use as a 
 * content slider, carousel, scrolling website banner, or image gallery.
 * 
 * Browser Support Details
 *   - FireFox 5.0+
 *   - Safari 5.0+
 *   - Chrome 19.0+
 *   - Internet Explorer 9+
 *   - Android 2.3+ 
 *   - Opera 12.0+
 *   - iOS Safari 4.0+
 */
;(function($) { $.fn.SB1carouselAndProduct = function ( config ) {
  if ( ! config ) config = {};

  /****************************************************************************
    == CONFIGURATION OPTION == 
  ****************************************************************************/
  var opt = {
    'main'    : this,
    'carousel': config.carousel || [],
    'product' : config.product  || [],
    'map'     : {'storage':[]},
    'cookie'  : 'SB1_C_N_P',
    'pCount'  : config.productViewCount,
    'pHolder' : config.productHolder  || this.find('.sb1_product_placeholder'),
    'cHolder' : config.carouselHolder || this.find('.sb1_carousel_placeholder')
  };

  var helper = {
    /*************************************************************************
      === Initialization ===
    **************************************************************************/
    init : function() {
      opt.original = {
        'carousel': JSON.parse( JSON.stringify(opt.carousel) ),
        'product' : JSON.parse( JSON.stringify(opt.product) )
      };

      var storage = helper._readCookie( opt.cookie );
      if ( storage ) {
        opt.map.storage = JSON.parse( storage );
      }

      helper.setupCarousel();
      setTimeout( helper.setupProduct, 300 );
    },

    setupCarousel : function() {
      var list = opt.carousel, loop = list.length, out = [], pin = {};
      if ( ! loop ) {
        opt.cHolder = null;
      } else {
        if ( ! opt.pHolder.size() ) { 
          opt.cHolder = $('<div></div>').appendTo( opt.main );  
        }
        opt.cHolder.addClass('sb1_carousel_and_p_placeholder');
      }

      if ( ! opt.cHolder ) { return; }

      var i = 0, storage = opt.map.storage || [], before = null, start = 0;
      for ( i=0; i<storage.length; i++ ) {
        pin[storage[i].id] = storage[i];
      }

      for ( i=0; i<loop; i++ ) {
        var data = list[i], id = data.id, answer = data.answer || [], temp = [];
        if ( ! id ) { continue; }

        var note = pin[id], reg = note && note.t ? 
          helper._createRegExp( note.t, true, true, true ) : '';

        for ( var j=0; j<answer.length; j++ ) {
          var t = answer[j].t || '' 
          var w = 'sb1_cap_answer' +(reg && t.match(reg) ? ' active' : '');
          var r = '{\'id\':\''+id+'\',\'v\':\''+(answer[j].v||'0')+'\',\'t\':\''+t+'\'}';
          temp.push('<a href="#" class="'+w+'" data-rule="'+r+'">'+t+'</a>');
        } 

        var mode = i==0 || note || before ? '' : 'inactive';
        out.push({
          'mode' : mode,
          'text': '<div class="sb1_cap id_'+id+'">'+
            '<div class="sb1_cap_question_wrapper">'+data.text+'</div>'+
            '<div class="sb1_cap_answer_wrapper">'+temp.join('')+'</div>'+
          '</div>'
        });

        if ( before ) { start = i; }
        before = note;
      }
      opt.cNode = $('<div></div>').appendTo( opt.cHolder ).SB1carousel( {
        'startIndexImage' : start,
        'carousel'        : false,
        'autoSwipe'       : false, //true,
        'reverse'         : true,
        'incremental'     : false,
        'data'            : out
      }).on('click', helper._click );
    },

    setupProduct : function() {
      if ( ! opt.product.length )
        opt.pHolder = null;
      else {
        if ( ! opt.pHolder.size() )
          opt.pHolder = $('<div></div>').appendTo( opt.main );  
        opt.pHolder.addClass('sb1_c_and_product_placeholder');

        for (var i=0; i<opt.product.length; i++) {
          var data = opt.product[i], link = data.link || [];
          for ( var j=0; j<link.length; j++ ) {
            if ( ! opt.map[link[j]] ) opt.map[link[j]] = [];
            opt.map[link[j]].push( data );
          }
          if ( typeof(data.point) !== 'number' ) { data.point = 0; }
          data.base = data.point;
        }

        if ( opt.map.storage.length ) { helper._updateMapPoint(); }
        helper.displayProduct();
      }
    },

    /*************************************************************************
      === PUBLIC METHOD ===
    **************************************************************************/
    displayProduct : function() {
      if ( ! opt.pHolder ) return;

      var ul  = opt.pHolder.find('> .product_list');     
      var out = helper._getProductionOutput();
      if ( ! out.list.length ) return;

      var item  = null, duration = 0, loop = 0, hide = 'shy', i = 0; 
      var timer = 0, delay = 100;

      if ( ! ul.size() ) {
        ul = $('<ul class="product_list"></ul>').appendTo( opt.pHolder )
          .html( out.list.join('') );
        item  = ul.find('.product_item').addClass( hide );
        loop  = item.size(); 
        timer = setInterval( function() {
          item.eq( i++ ).removeClass( hide );
          if ( i >= loop ) clearInterval( timer );
        }, delay );
        //setTimeout( function() { item.removeClass(hide); }, 200);
      }
      else {
        item = ul.find('.product_item');
        loop = item.size();
        if ( loop < out.list.length ) loop = out.list.length;

        duration = helper.getDuration( item.eq(0) );
        timer = setInterval( function() {
          var j = i, n = item.eq( i++ );
          if ( ! n.size() && out.list[j] ) {
            n = $(out.list[j]).appendTo( ul );
          }
          if ( i >= loop ) { clearInterval( timer ); }
          if ( ! n.size() ) { return; } 

          n.addClass( hide );
          setTimeout( function() {
            if ( out.list[j] ) {
              n.html( out.item[j].content );
              for ( var k in out.item[j].attr ) { 
                n.attr( k, out.item[j].attr[k] );
              }
            } 
            else { n.remove(); }
          }, (duration+50) );
        }, delay );
      }
    },

    getDuration : function( node ) {
      var v = node && node.size() ? 
        (node.css('transition-duration') || 0) : 0;
      if ( v ) { v = parseFloat( v ) * 1000; }
      return isNaN(v) ? 0 : v;
    },

    /*************************************************************************
      === INTERNAL METHOD ===
    **************************************************************************/
    /**
     */
    _click : function( e ) {
      e.preventDefault();
      var target = $(e.target), what = 'sb1_cap_answer';
      if ( ! target.hasClass( what ) ) { return; }

      var rule = JSON.parse( target.attr('data-rule').replace(/\'/g,'"') || '{}');
      if ( ! rule.id || ! rule.v ) { return; }

      target.parent().find('> a').removeClass('active');
      target.addClass('active');

      var changed = helper._updateMapPoint([rule]);
      if ( changed ) { helper.displayProduct(); }

      var atIndex = opt.cNode.SB1carousel.getAtIndex();
      var images  = opt.cNode.SB1carousel.getImages();

      var next = images.eq( atIndex+1 ), mode = 'inactive';
      if ( next.hasClass( mode ) ) {
        next.removeClass( mode );
        opt.cNode.SB1carousel.verifyImagesLeft();
        setTimeout( function() {
          opt.cNode.SB1carousel.navigateImage( true, true );
        }, 300 );        
      }
    },

    /**
     */
    _updateMapPoint : function( updating ) {
      var storage = opt.map.storage || [], loop = (updating|| []).length;
      var pin = {}, i = 0, text = JSON.stringify( opt.product );
      if ( loop ) {
        for ( i=0; i<storage.length; i++ ) {
          pin[storage[i].id] = i;
        }

        for ( i=0; i<loop; i++ ) {
          var index = pin[updating[i].id];
          if ( typeof(index)==='number') {
            storage[index] = updating[i];
          } else {
            storage.push( updating[i] );
            pin[updating[i].id] = storage.length-1;
          }
        }
        opt.map.storage = storage;
        helper._createCookie( opt.cookie, JSON.stringify(storage), 1000 );
      }

      for ( i=0; i<storage.length; i++ ) { 
        var rule  = storage[i], id = rule.id;
        var list  = id ? (opt.map[id] || []) : []; 
        var point = parseInt( rule.v || '0') || 0;
        for ( var j=0; j<list.length; j++ ) {
          if ( ! pin[list[j].id] ) { 
            list[j].point   = list[j].base || 0; 
            pin[list[j].id] = 1;
          }
          list[j].point += point;
        }        
      }
      return text != JSON.stringify( opt.product );
    },   

    /**
     */
    _getProductionOutput : function() {
      var list = helper._sortList( 
        JSON.parse(JSON.stringify(opt.product)), 'point', true 
      ), out  = {'list':[],'item':[]};
      //debug( list[0]['name'] ); 

      var loop = opt.pCount && opt.pCount<list.length ? opt.pCount : list.length;
      for (var i=0; i<loop; i++) {
        var data = list[i];
        //if ( ! data.url || ! data.name ) continue;
        if ( ! data.name ) continue;

        var href  = data.url || '#', rule = '{\'id\':\''+(data.id || '')+'\'}';
        var image = data.image ? '<img src="'+data.image+'">' : '';
        var type  = 'product_item' + (data.type ? ' '+data.type : '') + 
          (image ? '' : ' no_image'); 
        var price = data.price ? 
          helper._splitText( (data.price+''), 3 ).join('&nbsp;')+',-' : '';

        var item = {
          'attr'   : { /*'href':href,*/ 'data-rule':rule, 'class':type},
          'content': '<div class="item_point">'+(data.point||'0')+'</div>'+
            image+'<a href="#" class="item_name"><span>'+(data.name || '')+'</span></a>'+
            (data.desc ? '<div class="item_description">'+data.desc+'</div>': '') +
            (price ? '<a href="" class="item_price">'+price+'</a>' : '')
        };

        //item.html = '<div class="'+type+'" href="'+href+'" data-rule="'+rule+'">'+
        //  item.content +'</div>';
        item.html = '<div class="'+type+'" data-rule="'+rule+'">'+
          item.content +'</div>';

        out.item.push( item );
        out.list.push( '<li class="product_wrapper">'+item.html+'</li>' );
      }
      return out;
    },

    /**
     */
    _sortList : function( list, key, decreasing ) {
      return (list || []).sort( function(a,b) {
        var x = a[key] || 0, y = b[key] || 0;
        var r = ((x < y) ? -1 : ((x > y) ? 1 : 0));
        return decreasing ? (r*-1) : r;
      });
    },

    /**
     */
    _splitText : function( text, split ) {
      var i = (text||'').length % split, list = i ? [text.substr(0,i)] : [];
      for ( i; i<text.length; i += split ) { 
        list.push(text.substr(i,split)); 
      }
      return list;
    },

    /**
     */
    _createCookie : function( name, value, days ) {
      if ( ! name ) return;
      var cookie = [ name+'='+(value||'') ];
      var d = new Date(), expires = days || 100;
      d.setTime( d.getTime() + (expires*24*60*60*1000) );
      cookie.push( 'expires='+d.toGMTString() );
      cookie.push( 'path=/' );
      document.cookie = cookie.join('; ');
    },

    /**
     */
    _readCookie : function( name ) {
      var nameEQ = name + '=', ca = document.cookie.split(';');
      for ( var i=0; i<ca.length; i++ ) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return '';
    },

    /**
     */
    _eraseCookie : function ( name ) { 
      return createCookie( name, '', -1 ); 
    },

    /**
     */
    _createRegExp : function ( text, g, i, b, f, e, r ) {
      if ( text === '*' ) { return /.*/; }
      text = e ? helper._escapeText( text ) : text.replace( /\*/, '.*' );

      var v = text.replace( /\+/g, '\\+' );
      if ( r ) { v = v.replace( r[0], r[1] ); }

      var m = (g && i) ? 'gi' : ( (g || i) ? (g ? 'g' : 'i') : '' );
      return new RegExp((b ? '(^|\\s+)' : '') +'('+v+')' + (f ? '($|\\s+)': ''),m);
    },

    /**
     */
    _generateId : function( node ) {
      var id = node.attr('id');
      if ( ! id ) {
        id = 'auto_'+(new Date()).getTime()+'_'+Math.floor((Math.random()*1000)+1);
        node.attr('id',id);
      }
      return id;
    }
  };

  var method = {};
  for ( var k in helper ) {
    if ( ! k.match(/^(init|setup|_)/i) ) method[k] = helper[k];
  }
  
  this.SB1carouselAndProduct = method;
  setTimeout( helper.init, 100 );
  return this;
}; })( jQuery );


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