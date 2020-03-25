import {Animated} from 'react-native';
import {generateId} from  '../../../util/Function';
import {createSymbolPath, getChartText} from './ChartFunction';

export const initLegendInfo = ( state, info ) => {
  let space = state.legendSpace || 20, radius = state.lineRadius || 8;
  radius = space < (radius*2) ? parseInt((space / 1.5)) : parseInt((radius / 1.5));

  let padding = state.padding;
  (state.legend || []).forEach( (data, i ) => {
    let x = padding.left + 10 + (radius*2);
    let y = padding.topOriginal + (space*i);

    if ( data.symbol ) {      
      info.list.push({
        'id'  : generateId('legend-symbol'),
        'type': 'path',
        'path':  createSymbolPath({...data, 'radius': radius, 'center': [x,y]}),
        'style': {
          'fill'  : data.color,
          'stroke': state.color.default,
          'strokeWidth': 2
        }
      });
    }
    
    if ( data.title || data.text ) {
      info.list.push(getChartText({
        'x'   : x + radius + 10,
        'y'   : y + radius,
        'text': data.title || data.text,
        'textAnchor': 'start',
        'color': data.color,
        'size': '110%'
      }));
    }
  });
};