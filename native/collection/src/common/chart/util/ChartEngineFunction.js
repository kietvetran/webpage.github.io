import {Animated} from 'react-native';
import {generateId} from  '../../../util/Function';
import {createSymbolPath, getCirclePath, getPolarToCartesian, getChartText} from './ChartFunction';

export const initGraphEngineInfo = ( state, info ) => {
  let bgList = [], frontList = [], sumStroke = 0;
  info.list.forEach( (data, index) => {
    if ( isNaN(data.size) ) { return; }
    //data.type     = state.type || 'engine';
    data.type     = 'path';
    data.duration = state.duration;
    data.stroke   = data.stroke || state.engineStroke || 30;
    data.radius   = state.engineRadius || state.pieRadius || 100;

    data.radius -=  (sumStroke + (10*index)) + (data.stroke/2);
  
    data.x        = state.centerPoint[0];
    data.y        = state.centerPoint[1] + 25;
    data.dash     = data.radius * 2 * Math.PI;
    data.percent  = data.value / 100;
    data.center   = [data.x, data.y];
    data.deltaSize = data.size - data.removePart;
    data.note      = {
      'degree'  : 360 / data.size,
      'dashSize': data.dash / data.size,
      'dashGap' : state.enginenGap || 5,
      'gap'     : data.removePart / data.size,
      'fill'    : data.deltaSize / data.size
    };

    data.rotation   = 180 + (data.note.degree * (data.removePart/2));
    data.transform  = 'rotate('+data.rotation+' '+data.center[0]+' '+data.center[1]+')';
    data.startAngle = 0;
    data.endAngle   = data.note.degree * data.deltaSize;

    data.path  = getCirclePath({...data, 'endAngle': (data.endAngle * data.percent) });
    data.color = data.color || state.color.list[index];
    data.style = {
      'fill'       : 'none',
      'stroke'     : data.color,
      'strokeWidth': data.stroke,
      'strokeLinecap'  : 'butt'
    };

    if ( data.step !== false || data.track !== false  ) {
      let bg = JSON.parse(JSON.stringify(data));
      bg.id += '-bg';
      bg.path  = getCirclePath(bg);
      bg.color = '#dedede';
      bg.style.stroke = bg.color;
      bgList.push( bg );
    }

    if ( data.step !== false  ) {
      let ft = JSON.parse(JSON.stringify(data));
      ft.id += '-ft';
      ft.path  = getCirclePath(ft);
      ft.color = '#fff';
      ft.style.stroke = ft.color;
      ft.style.strokeDasharray = [data.note.dashGap, (data.note.dashSize - data.note.dashGap)].join(',');
      frontList.push( ft );
    }

    if ( data.reverse ) {
      data.endAngle = data.note.fill * 360;
      data.startAngle = (data.note.fill - (data.note.fill * data.percent)) * 360;
      data.path = getCirclePath( data );
    }

    if ( state.animation ) {
      data.style.strokeDasharray = data.dash;
      if ( data.reverse  ) {
        data.animateFrom = data.dash;
        data.animateTo   = data.dash - ((data.dash * data.percent)*data.note.fill);
      } else {
        data.animateFrom = data.dash * -1;
        data.animateTo   = 0;
      }

      data.animation = {
        'value': new Animated.Value(0),
        'config': {
          inputRange: [0, 1],
          outputRange: [data.animateFrom, data.animateTo],
        },
        'attributeName': 'stroke-dashoffset'
      };
    }

    sumStroke += data.stroke;
  });

  info.list = (bgList.concat( info.list )).concat( frontList );
};


