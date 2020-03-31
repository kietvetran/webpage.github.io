import {Animated} from 'react-native';
import {generateId} from  '../../../util/Function';
import {createSymbolPath, getCirclePath, getPolarToCartesian, getChartText} from './ChartFunction';

export const initGraphPieInfo = ( state, info ) => {
  let getDash = (radius, stroke, percent) => {
    let normalized = radius - (stroke * 2);
    let delta = normalized * 2 * Math.PI;
    return delta;
  };

  let sumDegree = 0, sumPercent = 0, shadowList = [];
  info.list.forEach( (data, index) => {
    data.type     = state.type || 'pie';
    data.duration = state.duration;
    data.percent  = data.value / info.sum;
    data.degree   = 360 * data.percent;
    data.stroke   = state.pieStroke || 50;
    data.radius   = state.pieRadius || 100;
    data.x        = state.centerPoint[0];
    data.y        = state.centerPoint[1];
    data.dash     = data.radius * 2 * Math.PI;
    data.startAngle = sumDegree;
    data.endAngle = data.degree + sumDegree;

    let point = getPolarToCartesian({
      ...data, 'angle': ((data.degree/2) + sumDegree)
    });

    data.center = [point.x, point.y];
    data.path = state.shadow ? getCirclePath({
      ...data,
      'startAngle': (data.startAngle + .5),
      'endAngle': (data.endAngle - .5)
    }): getCirclePath( data );

    if ( state.animation ) {
      if ( data.type === 'pie' ) {
        data.animateFrom = data.dash;
        data.animateTo   = data.dash * data.percent;
      } else {
        data.animateFrom = data.dash * -1;
        data.animateTo   = 0;
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
    
    data.color    = data.color || state.color.list[info.color.i++];
    data.style    = {
      'fill'       : 'none',
      'stroke'     : data.color,
      'strokeWidth': data.stroke,
      'strokeDasharray': data.dash,
      'strokeLinecap' : 'butt'
    };

    if ( state.shadow ) {
      shadowList.push(JSON.parse(JSON.stringify(data)));
    }

    sumPercent += data.percent;
    sumDegree  += data.degree;
  });

  if ( state.type === 'progress' ) {
    _initGraphPieShadow( state, info, shadowList );
    _initGraphPieInfoProgress(state, info );
  } else {
    _initGraphPieInfoText(state, info);
    _initGraphPieShadow( state, info, shadowList );
  }
};

const _initGraphPieShadow = ( state, info, list ) => {
  list.forEach( (data) => {
    data.id  += '-shadow';
    data.path = getCirclePath( data );
    data.style.stroke = '#fff';
    //data.style.strokeWidth += 2;
    data.isShadow = true; 
  });

  info.list = list.concat( info.list );
};


const _initGraphPieInfoText = ( state, info ) => {
  //if ( (state.legend || []).length ) { return; }

  let length = info.list.length, index = 0;
  let height = info.list[0].radius - info.list[0].stroke;
  let gap    = 20, space = (height*2) / length;

  for ( let i=0; i<length; i++ ) {
    let data = info.list[i], color = '', radius = 6, anchor = 'middle';
    if ( ! data || ! data.x || ! data.y || ! data.text || data.symbol === false ) { continue; }

    let x = data.x, y = data.y - (height - ((space)*index)) + gap, delta = 0;
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

    if ( state.textPath ) {
      info.list.push(getChartText({
        'x'    : ((data.dash * data.percent) / 2),
        'text' : data.text,
        'color': '#000',
        'textPath': '#'+data.id
      }));
    } else {
      info.list.push(getChartText({
        'x'    : x - delta,
        'y'    : y,
        'text' : data.text,
        'textAnchor': anchor,
        'color': color || data.color || data.style.stroke
      }));
    }
    index++;
  }
};

const _initGraphPieInfoProgress = ( state, info ) => {
  let current = info.list[0], fontSize = 5;

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
    ...cloned, 'startAngle': 0, 'endAngle': 360
  }); 
  
  cloned.dash    = 0;
  cloned.style.stroke = state.color.default;
  cloned.style.strokeDasharray = cloned.dash;
  cloned.animate = false;
  info.list.unshift( cloned );

  //,
  let text = getChartText({
    'x': current.x,
    'y': current.y + ((fontSize*16) /4),
    'text': current.value + '%',
    'color': current.color,
    'size' : (fontSize+'em'),
    'extension': {'duration': current.duration}
  });
  
  if ( state.animation ) {
    text.animation = {'value': new Animated.Value(0), 'attributeName': 'fill-opacity'};
  }

  info.list.push(text );
};