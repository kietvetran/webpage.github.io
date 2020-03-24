import {Animated} from 'react-native';
import {generateId} from  '../../../util/Function';
import {createSymbolPath} from './ChartFunction';

export const initGraphLineInfo = ( state, info ) => {
  info.width = (state.axis.x.max - (state.lineSpace * 2)) / (info.list.length - 1);
  info.linePath = {'pointList': [], 'pointDataList': [],  'prePoint': null, 'dash': 0, 'duration':state.duration};
  info.list.forEach( (data, i) => {
    data.type      = 'path';
    data.percent   = data.value / info.highest;
    data.width     = info.width - (state.lineSpace * 2);
    data.height    = state.axis.y.max * data.percent;
    data.cx        = (info.width * i) + state.lineSpace + state.padding.left;
    data.cy        = state.axis.y.max - data.height + state.padding.top;
    data.center    = [data.cx, data.cy];
    data.radius    = state.lineRadius;
    data.duration  = info.linePath.duration;
    data.color     = data.color || state.color.background;
    data.path      = createSymbolPath( data );
    data.style     = {
      'fill'  : data.color,
      'stroke': state.color.default,
      'strokeWidth': 2
    };

    if ( data.point === false ) {
      data.type = 'none';
    }

    info.linePath.pointDataList.push([data.cx, data.cy]);
    info.linePath.pointList.push([data.cx, data.cy].join(','));
    if ( info.linePath.prePoint ) {
      let x = data.cx - info.linePath.prePoint.cx;
      let y = data.cy - info.linePath.prePoint.cy;
      if ( x < 0 ) { x *= -1; }
      if ( y < 0 ) { y *= -1; }
      info.linePath.dash += Math.sqrt(((x*x) + (y*y)));
    }

    info.linePath.prePoint = data;
  });

  if ( info.list.length > 1 ) {
    _initGraphLinePath( state, info );
  }
};

const _initGraphLinePath = ( state, info ) => {
  let color = info.list[0].color || state.color.default;
  let dash  = parseInt(info.linePath.dash) * (state.type === 'spline' ? 1.5 : 1);
  let pointList = info.linePath.pointList, data = {
    'type'       : 'path',
    'path'       : 'M '+ pointList.join(' L '),
    'style'      : {
      'fill': 'none',
      'stroke': color,
      'strokeWidth': 4,
      'strokeDasharray': dash,
    }
  };

  if ( state.type === 'spline' ) {
    let catmull = _catmullRom2bezier( info.linePath.pointDataList );
    data.path = 'M' + info.linePath.pointList[0];
    for ( let i=0; i < catmull.length; i++) {      
      data.path += ' C' + catmull[i][0][0] + ',' + catmull[i][0][1] + ' ' +
        catmull[i][1][0] + ',' + catmull[i][1][1] + ' ' +
        catmull[i][2][0] + ',' + catmull[i][2][1];
    }
  }

  if ( state.animation ) {
    data.duration    = info.linePath.duration;
    data.animateFrom = dash;
    data.animateTo   = 0;
    data.animation   = {
      'value': new Animated.Value(0),
      'config': {
        inputRange: [0, 1],
        outputRange: [data.animateFrom, data.animateTo],
      },
      'attributeName': 'stroke-dashoffset'
    };
  }

  let list = [data];

  if ( state.fill && state.type !== 'spline' ) {
    let first  = info.list[0];
    let last   = info.list[(info.list.length - 1)];
    let bottom = state.axis.y.max + state.padding.top;

    pointList  = pointList.concat([
      [last.cx,  bottom].join(','),
      [first.cx, bottom].join(',')
    ]);

    let fill = {
      'id'         : generateId('line-polygon'),
      'type'       : 'line-polygon',
      'points'     : pointList.join(' '),
      //'delay'      : info.linePath.duration,
      'duration'   : info.linePath.duration,
      'style'      : {
        'fill'       : color,
        'opacity'    : .4,
        'stroke'     : 'transparent',
        'strokeWidth': 0,
       }
    };

    if ( state.animation ) {
      fill.animation = {'value': new Animated.Value(0), 'attributeName': 'fill-opacity'};
    }

    info.list.unshift( fill );
  }

  info.list = list.concat( info.list );    
};

const _catmullRom2bezier = ( pointList, cubicSize ) => {
  let result = [], cubic = cubicSize || 6;
  for (let i = 0; i < pointList.length - 1; i++) {
    let p = [[
      pointList[Math.max(i - 1, 0)][0],
      pointList[Math.max(i - 1, 0)][1]
    ]];

    p.push([pointList[i][0], pointList[i][1]]);
    p.push([pointList[i + 1][0],pointList[i + 1][1]]);
    p.push([
      pointList[Math.min(i + 2, pointList.length - 1)][0],
      pointList[Math.min(i + 2, pointList.length - 1)][1]
    ]);

    // Catmull-Rom to Cubic Bezier conversion matrix
    //    0         1         0        0
    //  -1/cubic    1      1/cubic     0
    //    0      1/cubic      1     -1/cubic
    //    0         0         1        0

    let bp = [[
      ((-p[0][0] + cubic * p[1][0] + p[2][0]) / cubic),
      ((-p[0][1] + cubic * p[1][1] + p[2][1]) / cubic)
    ]];
    bp.push([
      ((p[1][0] + cubic * p[2][0] - p[3][0]) / cubic),
      ((p[1][1] + cubic * p[2][1] - p[3][1]) / cubic)
    ]);
    bp.push([p[2][0], p[2][1]]);
    result.push(bp);
  }
  return result;
};