import {generateId} from '../../General';
import {createSymbolPath, getCirclePath, getPolarToCartesian, getChartText} from './ChartFunction';


export const initGraphEngineInfo = ( state, info ) => {
  let bgList = [], frontList = [], sumStroke = 0;
  info.list.forEach( (data, index) => {
    if ( isNaN(data.size) ) { return; }
    //data.type     = state.type || 'engine';
    data.type     = 'path';
    data.duration = state.duration;
    data.stroke   = data.stroke || state.engineStroke || 50;
    data.radius   = state.engineRadius || state.pieRadius || 100;

    data.radius -=  (sumStroke + (20*index)) + (data.stroke/2);

    data.x        = (state.axis.x.max / 2) + state.padding.left;
    data.y        = (state.axis.y.max / 2) + state.padding.bottom;
    data.dash     = data.radius * 2 * Math.PI;
    data.percent  = data.value / 100;
    data.center   = [data.x, data.y];
    data.deltaSize = data.size - data.remove;
    data.note      = {
      'degree'  : 360 / data.size,
      'dashSize': data.dash / data.size,
      'dashGap' : state.enginenGap || 5,
      'gap'     : data.remove / data.size,
      'fill'    : data.deltaSize / data.size
    };

    data.rotation   = 180 + (data.note.degree * (data.remove/2));
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
        //'value': new Animated.Value(0),
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


/*
export const initGraphEngineInfo = ( state, info ) => {
  let bgList = [], frontList = [];
  info.list.forEach( (data, index) => {
    if ( isNaN(data.size) ) { return; }
    //data.type     = state.type || 'engine';
    data.type     = 'path';
    data.duration = state.duration;
    data.stroke   = state.engineStroke || 50;
    data.radius   = state.pieRadius || 100;
    data.x        = (state.axis.x.max / 2) + state.padding.left;
    data.y        = (state.axis.y.max / 2) + state.padding.bottom;
    data.dash     = data.radius * 2 * Math.PI;
    data.center   = [data.x, data.y];
    data.deltaSize = data.size - data.remove;
    data.note      = {
      'degree': 360 / data.size,
      'dashSize': data.dash / data.size,
      'dashGap': state.enginenGap || 5,
      'gap'   : data.remove / data.size,
      'fill'  : data.deltaSize / data.size
    };

    data.percent    = (data.value / 100) * data.note.fill;
    data.rotation   = 180 + (data.note.degree * (data.remove/2));
    data.transform  = 'rotate('+data.rotation+' '+data.center[0]+' '+data.center[1]+')';
    data.startAngle = 0;
    data.endAngle   = data.note.degree * data.deltaSize;

    data.path  = getCirclePath({...data, 'endAngle': (data.endAngle * data.percent)});
    data.color = data.color || state.color.list[index];
    data.style = {
      'fill'       : 'none',
      'stroke'     : data.color,
      'strokeWidth': data.stroke,
      'strokeLinecap'  : 'butt',
      'strokeDasharray':  data.step === false ? 'none' :
        [(data.note.dashSize - data.note.dashGap), data.note.dashGap].join(','),
    };

    if ( data.step !== false ) {
      let bg = JSON.parse(JSON.stringify(data));
      bg.id += '-bg';
      bg.path  = getCirclePath(bg);
      bg.color = data.engineDefaultColor || '#dedede';
      bg.style.stroke = bg.color;
      bgList.push( bg );
    }

    if ( state.animation ) {
      data.animateFrom = 0;
      data.animateTo   = 1;
      data.style.strokeOpacity = 0;
      data.animateAttributeName = 'stroke-opacity';
    }
  });

  info.list = bgList.concat( info.list );
};
*/

/*
Old logic, that create count of part 

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

*/
