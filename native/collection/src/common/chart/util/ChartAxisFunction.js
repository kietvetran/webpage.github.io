import {generateId} from  '../../../util/Function';

export const initAxisList = (axis, state) =>{
  let list = [];
  if (! state || ! state.axis || ! state.axis[axis] ) { return list; }

  let padding = state.padding, path = '', delta = 0, count = state.axis[axis].grid || 1;
  let xMax    = state.axis.x.max, yMax = state.axis.y.max;
  let gap     = axis === 'x' ? parseInt((yMax / count)) : parseInt((xMax / count));

  for ( let i=0; i<count; i++ ) {
    if ( axis === 'x' ) {
      delta = yMax + padding - (gap*i);
      path  = 'M '+padding+','+delta+' '+ (xMax+padding)+','+delta;
    } else {
      delta = padding + (gap*i);
      path = 'M '+delta+','+padding+' '+ delta+','+(yMax+padding);
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
  let bottom = state.axis.y.max + state.padding;
  let text   = state.axis.x.text instanceof Array ? state.axis.x.text : (
    state.axis.x.text ? [state.axis.x.text] : []
  );
  if ( ! text.length || ! ((state.graph || {}).list || []).length ) { return; }

  let source     = (state.data instanceof Array ? state.data : [state.data]);
  let collection = source[0] instanceof Array ? source[0] : source;
  let lineSize   = state.axis.x.lineSize, index = 0;

  state.graph.list.forEach( (data,i) => {
    if ( ! data.center || ! text[index] ) { return; }
    let x = data.center[0];

    list.push({
      'id'  : generateId('x-text-'+i),
      'type': 'text',
      'x'   : x,
      'y'   : bottom + 20,
      'text': text[index++],
      'style': {
        'fill'       : state.axis.x.textColor || state.axis.x.color || '#444',
        'fontFamily' : 'Arial, Helvetica, sans-serif',
        'fontSize'   : '100%'          
      }
    });

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
  if ( ! highest || ! separation ) { return; }   

  let lineSize = state.axis.y.lineSize, unit = state.axis.y.unit || '';
  let bottom   = state.axis.y.max + state.padding;
  let value    = highest / separation, height = state.axis.y.max / separation;

  for ( let i=0; i<separation; i++ ) {
    let y = bottom - (height *(i+1));
    let x = state.padding;

    list.push({
      'id'  : generateId('x-text-'+i),
      'type': 'text',
      'x'   : x - 5,
      'y'   : y + 5,
      'textAnchor': 'end',
      'text': (value * (i+1)) + unit,
      'style': {
        'fill'       : state.axis.y.textColor || state.axis.y.color || '#444',
        'fontFamily' : 'Arial, Helvetica, sans-serif',
        'fontSize'   : '100%'          
      }
    });

    let endLine = state.axis.y.separationLine ?
      (state.view[0] - state.padding) : (x+lineSize[0]);

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