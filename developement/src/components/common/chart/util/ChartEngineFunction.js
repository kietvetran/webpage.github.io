import {generateId} from '../../General';
import {createSymbolPath, getCirclePath, getPolarToCartesian, getChartText} from './ChartFunction';

export const initGraphEngineInfo = ( state, info ) => {
  let list = [], shadowList = [];
  info.list.forEach( (data, index) => {
    if ( isNaN(data.size) ) { return; }
    data.type     = state.type || 'engine';
    data.duration = state.duration;
    data.stroke   = state.engineStroke || 50;
    data.radius   = state.pieRadius || 100;
    data.x        = (state.axis.x.max / 2) + state.padding.left;
    data.y        = (state.axis.y.max / 2) + state.padding.bottom;
    data.center   = [data.x, data.y];
    data.dash     = data.radius * 2 * Math.PI;
    data.deltaSize = data.size - data.remove;
    data.rotation = ((data.deltaSize / data.size)*360) - 360;

    let baseList = [], cloned = null, i = 0, degree = 360 / data.size;
    let percent  = degree / 360;

    data.rotation = 180 + (degree * (data.remove/2));
    data.transform = 'rotate('+data.rotation+' '+data.center[0]+' '+data.center[1]+')';

    for ( i=0; i<data.size; i++ ) {
      if ( i >= data.deltaSize ) { continue; }

      cloned = {
        ...data,
        'id'        : generateId('engine-'+index+'-'+i),
        'type'      : 'path',
        'startAngle': degree * i,
        'endAngle'  : degree * (i+1)
      };

      cloned.path = getCirclePath({
        ...cloned,
        'startAngle': (cloned.startAngle + .5),
        'endAngle': (cloned.endAngle - .5)
      });

      cloned.color = data.engineDefaultColor || '#dedede';
      cloned.style = {
        'fill'       : 'none',
        'stroke'     : cloned.color,
        'strokeWidth': cloned.stroke,
        'strokeLinecap' : 'butt'
      };
      baseList.push( cloned );
    }

    let count = (data.value / 100) * data.deltaSize;
    let loop  = Math.ceil( count ), engineList = [];

    for ( i=0; i<loop; i++ ) {
      cloned = JSON.parse(JSON.stringify(baseList[i]));
      cloned.id += '-original';
      cloned.color = data.color || state.color.list[index];
      cloned.style.stroke = cloned.color;
      if ( (i+1) === loop  && count !== loop ) {
        cloned.style.strokeOpacity = .3;
      }

      cloned.dash = (cloned.radius * 2 * Math.PI) * (data.value/100); 
      cloned.style.strokeDasharray = data.dash * (i+1);

      if ( state.animation ) {
        cloned.animateFrom = (cloned.dash * -1) * (i+1);
        cloned.animateTo   = 0;
        cloned.animation   = {
          //'value': new Animated.Value(0),
          'config': {
            inputRange: [0, 1],
            outputRange: [cloned.animateFrom, cloned.animateTo],
          },
          'attributeName': 'stroke-dashoffset'
        };
      }
      engineList.push( cloned );
    } 

    data.pathList = baseList.concat( engineList );
  });
};
