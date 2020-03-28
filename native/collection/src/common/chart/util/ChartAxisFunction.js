import {generateId} from  '../../../util/Function';
import {getChartText} from './ChartFunction';

export const initAxisList = (axis, state) =>{
  let list = [];
  if (! state || ! state.axis || ! state.axis[axis] ) { return list; }

  let path = '', delta = 0, count = state.axis[axis].grid || 1;
  let xMax = state.axis.x.max, yMax = state.axis.y.max;
  //let gap  = axis === 'x' ? parseInt((yMax / count)) : parseInt((xMax / count));
  let separation = count - 1, gap =  separation ? (
    axis === 'x' ? parseInt((yMax / separation )) : parseInt((xMax / separation))
  ) : 0;

  for ( let i=0; i<count; i++ ) {
    if ( axis === 'x' ) {
      delta = yMax + state.padding.top - (gap*i);
      path  = 'M '+state.padding.left+','+delta+' '+ (xMax+state.padding.left)+','+delta;
    } else {
      if ( state.axis.y.toRight ) {
        delta = xMax - (gap*i) + state.padding.left;
        path = 'M '+delta+','+state.padding.top+' '+ delta+','+(yMax + state.padding.top);        
      } else {
        delta = state.padding.left + (gap*i);
        path = 'M '+delta+','+state.padding.top+' '+ delta+','+(yMax + state.padding.top);
      }
    }

    list.push({
      'id'   : 'axis-'+axis+'-'+i,
      'type' : 'path',
      'path' : path,
      'style': {
        'stroke'      : '#444', //state.axis[axis].color || '#444',
        'strokeWidth' : '2',
        'fill'        : 'none',
        'opacity'     : i ? '.2' : '1'
      }
    });
  };

  if ( state.type.match(/^(bar|line|spline)/i) ) { 
    axis === 'x' ? _initXaxisText( state, list ) :
      _initYaxisText( state, list );
  }
  return list;
};

const _initXaxisText = ( state, list ) => {
  let bottom = state.axis.y.max + state.padding.top;
  let text   = state.axis.x.text instanceof Array ? state.axis.x.text : (
    state.axis.x.text ? [state.axis.x.text] : []
  );

  if ( state.axis.x.title ) {
    list.push(getChartText({
      'x'   : state.axis.x.max + state.padding.left,
      'y'   : bottom - 5,
      'text': state.axis.x.title,
      'textAnchor': 'end',
      'color': state.axis.x.textColor || state.axis.x.color
    }));
  }

  if ( ! text.length || ! ((state.graph || {}).list || []).length ) { return; }

  let source     = (state.data instanceof Array ? state.data : [state.data]);
  let collection = source[0] instanceof Array ? source[0] : source;
  let lineSize   = state.axis.x.lineSize, index = 0;

  state.graph.list.forEach( (data,i) => {
    if ( ! data.center || ! text[index] ) { return; }
    let x = data.center[0];
    if ( isNaN(x) ) { return; }

    list.push(getChartText({
      'x'   : x,
      'y'   : bottom + 20,
      'text': text[index++],
      'color': state.axis.x.textColor || state.axis.x.color
    }));

    list.push({
      'id'  : generateId('x-p-'+i),
      'type': 'path',
      'path': 'M ' + (x-(lineSize[0]/2))+','+(bottom-lineSize[1]) + ' L '+ (x-(lineSize[0]/2))+','+bottom,
      'style': {
        'stroke'      : state.axis.x.color || '#444',
        'strokeWidth' : '2',
        'fill'        : 'none',
      }
    });
  });
};

const _initYaxisText = ( state, list ) => {
  let highest = state.graph.highest || 0, separation = state.axis.y.separation;
  if ( state.axis.y.title ) {
    list.push(getChartText({
      'x'   : state.padding.left,
      'y'   : state.padding.top - 5,
      'text': state.axis.y.title,
      'textAnchor': 'start',
      'color': state.axis.y.textColor || state.axis.y.color
    }));    
  }

  if ( ! highest || ! separation ) { return; }   

  let lineSize = state.axis.y.lineSize, unit = state.axis.y.unit || '';
  let bottom   = state.axis.y.max + state.padding.top;
  let value    = highest / separation, height = state.axis.y.max / separation;

  for ( let i=0; i<separation; i++ ) {
    let y = bottom - (height *(i+1));
    let x = state.axis.y.toRight ?
      (state.axis.x.max + state.padding.left) : state.padding.left;

    if ( isNaN(x) || isNaN(y) ) { return; }

    list.push(getChartText({
      'x'   : x - (state.axis.y.toRight ? -10 : 5),
      'y'   : y + 5,
      'textAnchor': state.axis.y.toRight ? 'start' : 'end',
      'text': (value * (i+1)) + unit,
      'color': state.axis.y.textColor || state.axis.y.color
    }));

    let endLine = state.axis.y.separationLine ? (
      state.axis.y.toRight ? state.padding.left :
        (state.view[0] - state.padding.left)
    ) : (x+lineSize[0]);

    list.push({
      'id'  : generateId('y-p-'+i),
      'type': 'path',
      'path': 'M ' + x+','+y + ' L '+ endLine+','+y,
      'style': {
        'stroke'      : state.axis.y.color || '#444',
        'strokeWidth' : '2',
        'fill'        : 'none',
      }
    });      
  }
};