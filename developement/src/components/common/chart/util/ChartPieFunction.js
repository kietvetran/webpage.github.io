import {generateId} from '../../General';
import {createSymbolPath, getCirclePath, getPolarToCartesian, getChartText} from './ChartFunction';

export const initGraphPieInfo = ( state, info ) => {
  let getDash = (radius, stroke, percent) => {
    let normalized = radius - (stroke * 2);
    let delta = normalized * 2 * Math.PI;
    return delta;
  };

  let sumDegree = 0, sumPercent = 0;
  info.list.forEach( (data, index) => {
    data.type     = state.type || 'pie';
    data.duration = state.duration;
    data.percent  = data.value / info.sum;
    data.degree   = 360 * data.percent;
    data.stroke   = state.pieStroke || 50;
    data.radius   = state.pieRadius || 100;
    data.cx       = (state.axis.x.max / 2) + state.padding.left;
    data.cy       = (state.axis.y.max / 2) + state.padding.bottom;
    data.dash     = data.radius * 2 * Math.PI;     

    if ( data.type === 'pie' ) {
      let point = getPolarToCartesian({
        'x': data.cx,
        'y': data.cy,
        //'radius': data.stroke + ((data.radius - data.stroke)/2),
        'radius': data.radius,
        'angle': ((data.degree/2) + sumDegree)
      });
      data.center = [point.x, point.y];
      data.path = getCirclePath({
        'x': data.cx,
        'y': data.cy,
        'radius': data.radius,
        'startAngle': sumDegree,
        'endAngle': (data.degree + sumDegree)
      });
      if ( state.animation ) {
        data.animateFrom = data.dash;
        data.animateTo   = data.dash * data.percent;
      }
    } else {
      data.path = getCirclePath({
        'x': data.cx,
        'y': data.cy,
        'radius': data.radius,
        'startAngle': sumDegree,
        'endAngle': (data.degree + sumDegree)
      });
      if ( state.animation ) {
        data.path = getCirclePath({
          'x': data.cx, 'y': data.cy, 'radius':data.radius, 'startAngle': 0, 'endAngle': 360
        });
        data.animateFrom = data.dash;
        data.animateTo   = data.dash * (1 + data.percent);
      }
    }

    if ( data.animateFrom !== undefined && data.animateTo !== undefined ) {
      data.animation = {
        //'value': new Animated.Value(0),
        'config': {
          inputRange: [0, 1],
          outputRange: [data.animateFrom, data.animateTo],
        },
        'attributeName': 'stroke-dashoffset'
      };     
    }
    
    data.color    = data.color || state.color.list[info.color.i++];
    data.style    = {
      'fill'       : 'none',
      'stroke'     : data.color,
      'strokeWidth': data.stroke,
      'strokeDasharray': data.dash,
      'strokeLinecap' : 'butt'
    };

    sumPercent += data.percent;
    sumDegree  += data.degree;
  });

  if ( state.type === 'progress' ) {
    _initGraphPieInfoProgress(state, info );
  } else {
    _initGraphPieInfoText(state, info);
  }
};

const _initGraphPieInfoText = ( state, info ) => {
  let length = info.list.length, index = 0;
  let height = info.list[0].radius - info.list[0].stroke;
  let gap    = 20, space = (height*2) / length;

  for ( let i=0; i<length; i++ ) {
    let data = info.list[i], color = '', radius = 6, anchor = 'middle';
    if ( ! data || ! data.cx || ! data.cy ) { continue; }

    let x = data.cx, y = data.cy - (height - ((space)*index)) + gap, delta = 0;

    if ( data.symbol && data.center && data.center[0] && data.center[1] ) {
      x -= (data.radius - data.stroke)/2;
      color  = '#444';
      anchor = 'start';
      info.list.push({
        'type': 'path',
        'path': createSymbolPath({...data, 'radius': radius}),
        'style': {
          'fill'  : 'none',
          'stroke': color,
          'strokeWidth': 1 
        }
      });

      info.list.push({
        'type': 'path',
        'path': createSymbolPath({...data,'center': [x,(y-radius)], 'radius': radius}),
        'style': {
          'fill'  : 'none',
          'stroke': color,
          'strokeWidth': 1          
        }
      });

      x += radius + 5;
    } 

    info.list.push(getChartText({
      'x'    : x - delta,
      'y'    : y,
      'text' : data.text,
      'textAnchor': anchor,
      'color': color || data.color || data.style.stroke
    }));
    index++;
  }
};

const _initGraphPieInfoProgress = ( state, info ) => {
  let current = info.list[0];

  if ( (((state.previous || {}).graph || {}).list || [])[1] ) {
    let previous = state.previous.graph.list[1];
    current.animateFrom = previous.animateTo;
  }

  let cloned  = JSON.parse(JSON.stringify(current));
  cloned.id      = generateId('progress');
  cloned.value   = 100;
  cloned.degree  = 360;
  cloned.percent = 1;
  cloned.path    = getCirclePath({
    'x': cloned.cx, 'y': cloned.cy, 'radius':cloned.radius, 'startAngle': 0, 'endAngle': 360
  }); 
  
  cloned.dash    = 0;
  cloned.style.stroke = state.color.default;
  cloned.style.strokeDasharray = cloned.dash;
  cloned.animate = false;
  info.list.unshift( cloned );

  //,
  let text = getChartText({
    'x': current.cx,
    'y': current.cy + 20,
    'text': current.value + '%',
    'color': current.color,
    'size' : '500%',
    'extension': {'duration': current.duration}
  });
  
  if ( state.animation ) {
    //text.animation = {'value': new Animated.Value(0), 'attributeName': 'fill-opacity'};
  }

  info.list.push(text );
};