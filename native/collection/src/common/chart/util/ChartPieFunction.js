import {Animated} from 'react-native';
import {generateId} from  '../../../util/Function';

export const initGraphPieInfo = ( state, info ) => {
  let polarToCartesian = (centerX, centerY, radius, angleInDegrees) =>{
    let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
      'x': centerX + (radius * Math.cos(angleInRadians)),
      'y': centerY + (radius * Math.sin(angleInRadians))
    };
  };

  let getPath = (x, y, radius, startAngle, endAngle) =>{
    let start = polarToCartesian(x, y, radius, endAngle);
    let end   = polarToCartesian(x, y, radius, startAngle);
    let arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M', start.x, start.y, 
      'A', radius, radius, 0, arcSweep, 0, end.x, end.y
    ].join(' ');
  };

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
      data.path = getPath(data.cx, data.cy, data.radius, sumDegree, (data.degree + sumDegree));
      if ( state.animation ) {
        data.animateFrom = data.dash;
        data.animateTo   = data.dash * data.percent;
      }
    } else {
      data.path = getPath(data.cx, data.cy, data.radius, sumDegree, (data.degree + sumDegree));
      if ( state.animation ) {
        data.path = getPath(data.cx, data.cy, data.radius, 0, 359.999);
        data.animateFrom = data.dash;
        data.animateTo   = data.dash * (1 + data.percent);
      }
    }

    if ( data.animateFrom !== undefined && data.animateTo !== undefined ) {
      data.animation = {
        'value': new Animated.Value(0),
        'config': {
          inputRange: [0, 1],
          outputRange: [data.animateFrom, data.animateTo],
        },
        'attributeName': 'stroke-dashoffset'
      };     
    }
    
    data.color    = data.color || state.color.list[info.color++];
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
    _initGraphPieInfoProgress(state, info, getPath);
  } else {
    _initGraphPieInfoText(state, info);
  }
};

const _initGraphPieInfoText = ( state, info ) => {
  let length = info.list.length, index = 0;
  let height = info.list[0].radius - info.list[0].stroke;
  let gap    = 20, space = (height*2) / length;

  for ( let i=0; i<length; i++ ) {
    let data = info.list[i];
    if ( ! data || ! data.cx || ! data.cy ) { continue; }

    info.list.push({
      'id'  : generateId('pie-text-'+i),
      'type': 'text',
      'x'   : data.cx,
      'y'   : data.cy - (height - ((space)*index)) + gap,
      'text': data.text,
      'style': {
        'fill'       : data.color || data.style.stroke || '#444',
        'fontFamily' : 'Arial, Helvetica, sans-serif',
        'fontSize'   : '130%' 
      }
    });
    index++;
  }
};

const _initGraphPieInfoProgress = ( state, info, getPath ) => {
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
  cloned.path    = getPath(cloned.cx, cloned.cy, cloned.radius, 0, 359.999); 
  cloned.dash    = 0;
  cloned.style.stroke = state.color.default;
  cloned.style.strokeDasharray = cloned.dash;
  cloned.animate = false;
  info.list.unshift( cloned );

  let text = {
    'id'  : generateId('progress-text'),
    'type': 'text',
    'text': current.value + '%',
    'duration': current.duration,
    'x': current.cx,
    'y': current.cy + 20,
    'style': {
      'fill'       : current.color,
      'fontFamily' : 'Arial, Helvetica, sans-serif',
      'fontSize'   : '500%'
    }
  };

  if ( state.animation ) {
    text.animation = {'value': new Animated.Value(0), 'attributeName': 'fill-opacity'};
  }

  info.list.push(text );
};