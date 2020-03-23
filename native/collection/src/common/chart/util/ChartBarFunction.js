import {Animated} from 'react-native';
import {generateId} from  '../../../util/Function';

export const initGraphBarInfo = ( state, info, multiple ) => {
  let prePercent = 0, colorIndex = 0, length = info.list.length;
  info.width     = state.concatnation && multiple && multiple.count ? 
    (state.axis.x.max / multiple.count) : (state.axis.x.max / length);

  info.list.forEach( (data, i) => {
    data.type      = 'bar-path';
    data.percent   = data.value / info.highest;
    data.width     = info.width - (state.barSpace * 2);
    data.height    = state.axis.y.max * data.percent;
    data.x         = (info.width * i) + state.barSpace + state.padding.left;
    data.y         = state.axis.y.max + state.padding.bottom;
    data.center    = [data.x + (data.width/2), data.y - (data.height/2)];
    data.duration  = state.duration;
    data.color     = data.color || state.color.list[info.color++];

    if ( multiple && multiple.count > 1 && typeof(multiple.index) === 'number' ) {
      if ( state.concatnation ) {
        data.color = state.color.list[colorIndex++];
        data.x = (info.width * multiple.index) + state.barSpace + state.padding.left;
        data.y -= state.axis.y.max * prePercent;
        data.height = (state.axis.y.max * (data.percent + prePercent)) - (state.axis.y.max * prePercent);
        data.center  [data.x + (data.width/2), data.y - (data.height/2)];

        data.duration = data.duration / length; 
        data.delay  = data.duration * i;

        prePercent += data.percent;
      } else {
        data.width  = data.width / multiple.count;
        data.x      = data.x + (multiple.index * data.width);
      }
    }

    //data.duration  = (state.duration / 1000)+'s';
    data.style     = {
      'fill': data.color,
      'stroke': state.color.default,
      'strokeWidth': 1
    };

    data.animateFrom = [
      'M',
      [data.x, data.y].join(','),
      [data.x, data.y].join(','),
      [data.x+data.width, data.y].join(','),
      [data.x+data.width, data.y].join(',')
    ].join(' ');

    data.animateTo = [
      'M',
      [data.x, data.y].join(','),
      [data.x, data.y-data.height].join(','),
      [data.x+data.width, data.y-data.height].join(','),
      [data.x+data.width, data.y].join(',')
    ].join(' ');

    data.path = data.animateTo;

    if ( state.animation ) {
      data.animation = {
        'mode': state.concatnation ? 'linear' : '',
        'value': new Animated.Value(0),
        'config': {
          'inputRange' : [0, 1],
          'outputRange': [data.animateFrom, data.animateTo].map(_exponentialToFixedNotation)
        }
      }; 
    }
  });
}

const _exponentialToFixedNotation = ( number ) => {
  let reg = /(\d)(?:\.(\d+))?e([+-])(\d+)/;
  return number.replace( reg, (m, integer, decimal = '', sign, power) => {
    const fixed = integer + decimal;
    return sign === '+' ? (fixed + '0'.repeat(power - decimal.length)) :
      ('0.' + '0'.repeat(power - 1) + fixed);
  });
}