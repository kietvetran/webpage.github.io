import {generateId} from '../../General';
import {createSymbolPath, getChartText} from './ChartFunction';

export const initLegendInfo = ( state, info ) => {
  if ( state.type.match( /^(engine|pie|progress)/i) ) {
    _initCenterText( state, info );
  } else {
    _initOtherLegendText( state, info );
  }
};

const _initCenterText = ( state, info ) => {
  if ( ! (state.legend || []).length ) { return; }

  let tspanList = [], current = info.list[0] || {};
  let center    = state.type === 'engine' ? current.center : state.centerPoint;
  let length    = state.legend.length, space = 0;

  state.legend.forEach( (data, index) => {
    let tspan = getChartText({
      ...data,
      'x'   : center[0],
      'type': 'tspan',
      'dy'  : index === 0 ? (data.dy || '0') : (data.dy || '1.4em'),
    });

    if ( tspan.dy ) {
      space += (parseFloat((tspan.dy+'')) * 16)/2;
    }

    tspanList.push(tspan);
  });

  info.list.push(getChartText({
    'x': center[0],
    'y': center[1] - space,
    'tspan': tspanList
  }));

};

const _initOtherLegendText = ( state, info ) => {
  let space = state.legendSpace || 20, radius = state.lineRadius || 8;
  radius = space < (radius*2) ? parseInt((space / 1.5)) : parseInt((radius / 1.5));

  let padding = state.padding;
  (state.legend || []).forEach( (data, i ) => {
    let x = padding.left + 10 + (radius*2);
    let y = padding.topOriginal + (space*i);
    let delta = 0;

    if ( ! data.symbol && info.multiple && info.symbol.used[i] ) {
      data.symbol = info.symbol.used[i];
    }

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
    } else {
      delta = radius;
    }

    if ( data.title || data.text ) {
      info.list.push(getChartText({
        'x'   : x + radius + 10 - delta,
        'y'   : y + radius,
        'text': data.title || data.text,
        'textAnchor': 'start',
        'color': data.color
      }));
    }
  });
};