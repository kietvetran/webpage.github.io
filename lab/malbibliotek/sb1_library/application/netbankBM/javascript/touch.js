function touchEventHandler( e, callback ) {
  var type = e.type, t = $(e.target), isMouse = type.match(/mouse/i);
  if ( ATTR.touchEvent && ATTR.touchEvent.type.match(/touch/i) && isMouse )
    return;

  var position = getEventPosition(e,true);
  if ( type.match(/(ms)?touchstart|mousedown/i) ) {
    if ( ATTR.touchEvent ) clearTimeout(ATTR.touchEvent.timer);

    ATTR.touchEvent = {
      "type"     : isMouse ? "mouse" : "touch",
      "event"    : e,
      "target"   : t,
      "direction": "",
      "distance" : 0,
      "vertical" : "",
      "height"   : 0,
      "position" : position,
      "startTime": (new Date()).getTime(),
      "memory"   : [position],
      "timer"    : 0,
    };

    if ( typeof(callback)=="function") 
      callback( ATTR.touchEvent , "start" );
  }
  else if ( ATTR.touchEvent ) {

    ATTR.touchEvent.event = e;

    if ( ! ATTR.touchEvent.moveTime )
      ATTR.touchEvent.moveTime = (new Date()).getTime();

    var started = ATTR.touchEvent.position;
    var memory  = ATTR.touchEvent.memory;

    if ( ! position[0] && ! position[1] )
      position = last = memory[memory.length-1];

    if ( started[0] < position[0] ) {
      ATTR.touchEvent.direction = "right";
      ATTR.touchEvent.distance  = position[0]-started[0];
    }
    else {
      ATTR.touchEvent.direction = "left";
      ATTR.touchEvent.distance  = started[0]-position[0];
    }
    
    if ( started[1] < position[1] ) {
      ATTR.touchEvent.vertical = "down";
      ATTR.touchEvent.height   = position[1]-started[1];
    }
    else {
      ATTR.touchEvent.vertical = "up";
      ATTR.touchEvent.height   = started[1]-position[1];
    }
 
    ATTR.touchEvent.memory.push( position );

    if ( type.match(/(ms)?touchmove|mousemove/i)  ) {
      if ( typeof(callback)=="function") 
        callback( ATTR.touchEvent , "move" );
    }
    else if ( type.match(/(ms)?touchend|mouseup/i) ) {
      if ( typeof(callback)=="function") 
        callback( ATTR.touchEvent , "end" );
  
      ATTR.touchEvent.timer = setTimeout( function() {
        ATTR.touchEvent = null;
      }, 200 );
    }
  }
}

/**
 *
 */
function touchEvent( data, mode ) {
  var order = [
    {"type":"class","what":"swipe_content", "start": _touchStartSC, "move" : _touchMoveSC, "end" : _touchEndSC },
    {"type":"class","what":"swipe_left_arrow", "end" : _touchEndArrow },
    {"type":"class","what":"swipe_right_arrow", "end" : _touchEndArrow }
  ], loop = order.length, i = 0;

  if ( mode == "start" ) {
    for ( i; i<loop; i++ ) {
      var current = null, parent = data.target.parent(), note = order[i];
      if ( note.what == "body" )
        current = $("body");
      else {
        if ( note.target=="target" ) {
          if ( note.type=="class" )
            current = data.target.hasClass( note.what ) ? data.target : null;
          else 
            current = data.target.attr("id")==note.what ? data.target : null;
        }
        else {
          current = note.type == "class" ?
            data.target.closest("."+note.what) :
            data.target.closest("#"+note.what);
        }
      }
      if ( ! current || ! current.size() ) continue;

      ATTR.touchSource = {"orderIndex":i, "current": current };
      if ( note[mode] ) {
        note[mode]( data );
      }
      i = loop;
    }
  } else if ( mode=="move" && ATTR.touchSource) {
    i = ATTR.touchSource.orderIndex;
    if ( order[i][mode] ) order[i][mode]( data );
  } else if ( mode == "end" ) {
    if ( ATTR.touchSource && data.distance >= 5 )
       ATTR.dragged = true;

    i =  ATTR.touchSource ? ATTR.touchSource.orderIndex : -1;
    if ( order[i] && order[i][mode] ) order[i][mode]( data );
    ATTR.touchSource = null;
    setTimeout( function() { ATTR.dragged = false;}, 100);
  }
}

function _getSCsource( content, wrapper ) {
  var align = content.css('float') || 'left', source = {
    'align': align,
    'base': parseFloat(content.css('margin-'+align))    || 0, 
    'size': parseFloat(content.prop('clientWidth'))     || 0,
    'viewport': parseFloat(wrapper.prop('clientWidth')) || 0,
    'id' : generateId( content ),
    'width' : 0, 
    'each' : []
  };

  content.children().each(function(i,dom) { 
    source['each'][i] = dom.clientWidth;
    source['width'] += source['each'][i];
  });
  if ( source['width'] > source['size'] ) source['size'] = source['width'];
  return source;
}

function _calculateSCleft( distance, direction, source  ) {
  if ( ! source ) source = ATTR.touchSource.source;

  var test = source['align'] == 'left' ? direction == 'left' : direction != 'left';
  var base = source.base, view = source.viewport, size = source.size*-1;
  var left = base + (distance* (test ?-1:1));

  if ( (left-view)<size ) left = size+view;

  if ( left > 0 || isNaN(left) ) left = 0;

  return left;
}


function resizeSCsize( selection ) {
  //if ( ATTR.resizeSCsizeTimer ) clearTimeout( ATTR.resizeSCsizeTimer );
  //ATTR.resizeSCsizeTimer = setTimeout( function() {
    $('.swipe_wrapper').each( function(i,dom) {
      var wrapper = $(dom), cnt = wrapper.find('.swipe_content').eq(0);
      var item    = selection ? cnt.find( '.selected' ) : null;
      
      item.size() ? _viewSCitem( cnt, wrapper, item ) :
        _adjustSCcontent( cnt, wrapper );

      //_adjustSCcontent( cnt, wrapper );

      _verifySCarrow( cnt, wrapper );
    });
  //}, 200 );
}

function _adjustSCcontent( content, wrapper ) {
  var src = _getSCsource( content, wrapper );
  if ( ! src['base'] ) return;

  var left = _calculateSCleft( 0, 'left', src );
  if ( left != src['base'] ) { 
    var margin  = 'margin-'+ATTR['touchSource']['source']['align'], css = {};
    css[margin] = left+'px';
    
    current.css(css);
    //content.css({ "margin-left":left+"px" });
  }
}

function _viewSCitem( content, wrapper, item ) {
  if ( ! content || ! content.size() ) return;

  if ( ! wrapper || ! wrapper.size() ) {
    wrapper = content.closest('.swipe_wrapper');
    if ( ! wrapper.size() ) return;
  }

  var source = _getSCsource( content, wrapper ); 
  if ( ! source ) return;

  var cl    = content.offset().left, il = item.offset().left;
  var width = item.prop('clientWidth');
  var view  = source.viewport, size = source.size;
  var half  = parseInt( view/2 );
  var left  = ((il - cl) + parseInt( width/2 )) - half;

  if ( source['align']=='right' ) {
    left = size - left - view;
    //if ( left > (size-view) ) { left = size-view;}
  }
  
  if ( (left+view)>size ) { left = size-view; }

  if ( left < 0  ) left = 0;
  else             left *= -1;

  //debug( 'L:'+left );

  var margin  = 'margin-'+source['align'], css = {};
  css[margin] = left+'px';
  content.css( css );
}

function _centerSCitem( content, wrapper, item ) {
  if ( ! content || ! content.size() ) return;

  if ( ! wrapper || ! wrapper.size() ) {
    wrapper = content.closest('.swipe_wrapper');
    if ( ! wrapper.size() ) return;
  }

  var source = _getSCsource( content, wrapper ); 
  if ( ! source ) return;

  var all = content.children();
  if ( ! item || ! item.size() ) {
    item = all.filter( '> .selected' );
    if ( ! item.size() ) return;
  }

  var index = all.index( item ), left = 0;
  for ( var i=0; i<index; i++ ) left += all.eq(i).prop('clientWidth');

  var view = parseInt( source.viewport/2 );
  left += parseInt( item.prop('clientWidth')/2 ) - view;

  return debug('left: '+ left+ ' view: '+view, source );

  if ( left > source.width-source.viewport )
    left = source.width-source.viewport;


  var margin  = 'margin-'+source['align'], css = {};
  css[margin] = left+'px';

  content.css(css);
  //content.css({'margin-left': '-'+left+'px'});
}

function _verifySCarrow( content, wrapper ) {
  if ( ! content || ! content.size() ) return;

  if ( ! wrapper || ! wrapper.size() ) {
    wrapper = content.closest('.swipe_wrapper');
    if ( ! wrapper.size() ) return;
  }

  var source = _getSCsource( content, wrapper ); 
  if ( ! source ) return;

  var left = source.base;
  var max  = source.size * -1;
  var view = source.viewport;
  var hideL = "hide-left-arrow", hideR = "hide-right-arrow";
  if ( source['align'] == 'right' ) {
    var temp = hideL;
    hideL = hideR;
    hideR = temp;
  }

  if ((max*-1) <= view )
    wrapper.addClass( hideL+" "+hideR );
  else { 
    if ( left < 0 ) wrapper.removeClass( hideL );
    else            wrapper.addClass( hideL );

    if ( (left-view)>max ) wrapper.removeClass( hideR );
    else                   wrapper.addClass( hideR );   
  }
}

function _touchStartSC( data ) {
  ATTR.touchSource.wrapper = ATTR.touchSource.current.stop()
    .closest('.swipe_wrapper');
  if ( ! ATTR.touchSource.wrapper.size() ) return;

  //clearSelection();
  ATTR.touchSource.source = _getSCsource(
    ATTR.touchSource.current, ATTR.touchSource.wrapper
  );
} 

function _touchMoveSC( data ) {
  if ( data.distance < 5 ) return;

  data.event.preventDefault();

  var current = ATTR.touchSource.current;
  var left    = _calculateSCleft(data.distance, data.direction);

  var margin  = 'margin-'+ATTR['touchSource']['source']['align'], css = {};
  css[margin] = left+'px';

  current.css(css);
  _verifySCarrow( current, ATTR.touchSource.wrapper );

  if ( left ) setTimeout( clearSelection, 100 );
}

function _touchEndSC( data ) {
  if ( data.distance < 5 ) return;

  data.view   = ATTR.touchSource.source.viewport; 
  data.offset = parseFloat(data.distance / data.view);
  data.time   = (new Date()).getTime() - (data.moveTime || data.startTime);
  data.speed  = (data.distance / data.time)*(data.type=="touch" ? 1 :data.offset);
  if ( ATTR.isAndroid ) data.speed *= 10;
  if ( data.speed < 0.5 ) return;

  //data.speed  = parseFloat((data.distance * data.time)*data.offset);
  data.move   = parseInt(data.distance * data.speed * (data.offset*3));
  if ( data.move < 150 ) return;

  data.total  = data.distance + data.move; 

  //setTimeout( function() { debug( '', data, " ---- "); }, 100 );

  var current  = ATTR['touchSource']['current'];
  var left     = _calculateSCleft( data.total, data.direction );
  var id       = ATTR['touchSource']['source']['id'];

  var margin  = 'margin-'+ATTR['touchSource']['source']['align'], css = {};
  css[margin] = left+'px';

  current.animate(css, function() {_verifySCarrow( $("#"+id) ); });
  /*
  current.animate({ "margin-left": left+"px"}, function() {
    _verifySCarrow( $("#"+id) );
  });
  */
}

function _touchEndArrow( data ) {
  var arrow     = data['target'], wrapper = arrow.closest('.swipe_wrapper');
  if ( ! wrapper.size() ) return;

  var content   = wrapper.find('.swipe_content');
  var source    = _getSCsource( content, wrapper );
  var direction = arrow.hasClass('swipe_right_arrow') ? 'left' : 'right';
  var distance  = parseInt(source['size'] / 2 );
  var left      = _calculateSCleft( distance, direction, source );
  var margin  = 'margin-'+source['align'], css = {};
  css[margin] = left+'px';
  content.animate(css, function() { _verifySCarrow( content, wrapper ); });
}
