import React from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import Svg, {
  Circle,Ellipse, G, Text, TSpan, TextPath, Path, Polygon, Polyline, Line, Rect,
} from 'react-native-svg';

/*
const ChartGraph = ({data, animate}) => {
  let graph = null;

  if ( data.type === 'bar' ) {
    graph = <rect id={data.id} x={data.x} y={data.y} fill={data.color} width={data.width} height={0} transform={data.transform}>
      <animate attributeName="height" from="0" to={data.height} dur={data.duration} fill="freeze" />
    </rect>;
  } else if ( data.type === 'line-polygon' ) {
    graph = <polygon points={data.points} style={data.style} >
      <animate attributeName="opacity" from="0" to={data.animateTo} dur={data.duration} fill="freeze" />
    </polygon>
  } else if ( data.type === 'line-cirle' ) {
    graph = <circle id={data.id} cx={data.cx} cy={data.cy} r={data.radius} fill={data.color} style={data.style}>    
      <animate attributeName="opacity" from="0" to="1" dur={data.duration} fill="freeze" />
    </circle>;
  } else if ( data.type === 'pie' || data.type === 'progress' || data.type === 'path' ) {
    graph = <path id={data.id} style={data.style} d={data.path}>
      { animate !== false && data.animate !== false && <animate attributeName="stroke-dashoffset" dur={data.duration} fill="freeze"
          from={data.animateFrom !== undefined ?  data.animateFrom : data.dash}
          to={data.animateTo !== undefined ? data.animateTo : (data.dash*2)}
        />
      }
    </path>
  } else if ( data.type === 'text' && data.text ) {
    graph = <g>
      <text id={data.id} x={data.x} y={data.y} style={data.style}
        dominantBaseline="middle" textAnchor={data.textAnchor || 'middle'}
      >{data.text}</text>
       { animate !== false && data.animate !== false && <animate attributeName="fill-opacity" attributeType="CSS" from="0" to="1" dur={data.duration} fill="freeze"/>}
    </g>
  }

  return graph;
};
*/

const ChartGraph = ({data, animate}) => {
  let graph = null;
  if ( ! data ) { return graph; }

  if ( data.type === 'bar' ) {
    graph = <Rect id={data.id} x={data.x} y={data.y} fill={data.color} width={data.width} height={data.height} transform={data.transform}>
    </Rect>;
  } else if ( data.type === 'line-polygon' ) {
    graph = <Polygon points={data.points} style={data.style} >
    </Polygon>
  } else if ( data.type === 'line-cirle' ) {
    graph = <Circle id={data.id} cx={data.cx} cy={data.cy} r={data.radius} fill={data.color} style={data.style}>
    </Circle>;
  } else if ( data.type === 'pie' || data.type === 'progress' || data.type === 'bar-path' || data.type === 'path' ) {
    graph = <Path id={data.id} style={data.style} d={data.path}>
    </Path>
  } else if ( data.type === 'text' && data.text ) {
    graph = <G>
      <Text id={data.id} x={data.x} y={data.y} style={data.style}
        dominantBaseline="middle" textAnchor={data.textAnchor || 'middle'}
      >{data.text}</Text>
    </G>
  }

  return graph;
};


/******************************************************************************
******************************************************************************/
export default class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'id': this._generateId(),
      'animation': new Animated.Value(0),
      'animationConfig': {'duration': 800, 'delay': 300},
      ...this._initState( props )
    };

    this._click = this._click.bind(this);
    this.updateData = this.updateData.bind(this);    
  }

  render() {
    const {id, viewBox, view, axis, graph, animation} = this.state;

    return graph ? <Animated.View style={{'opacity': animation}}>
      <Svg viewBox={viewBox} width={view[0]} height={view[1]}>
        { (axis.x.list.length > 0 || axis.y.list.length > 0) && <G id="axis-wrapper">
            {axis.x.list.map( (data, i) => (
              data ? <ChartGraph key={'x-'+(data.id || i)} data={data} animate={false}/> : null
            ) )}
            {axis.y.list.map( (data, i) => (
              data ? <ChartGraph key={'y-'+(data.id || i)} data={data} animate={false}/> : null
            ) )}
          </G>
        }
        { graph.list && graph.list.length > 0 && <G id="graph-wrapper">
            { graph.list.map( (data,i) => (
                data ? <ChartGraph key={'graph-'+(data.id || i)} data={data}/> : null
            )) }
          </G>
        }
      </Svg>
    </Animated.View> : null;
  }

  componentDidMount() { 
    this._revealAnimation();
    //setTimeout( () => { this.updateData(80); }, 5000);
  }

  componentDidUpdate(prevProps, prevState) {
    let {graph, nextGraph} = this.state;
    if ( graph === null && nextGraph ) {
      this._revealAnimation({ 'duration': 0,'delay': 0, 'toValue' : 0});
      this.setState({'graph': nextGraph, 'nextGraph': null});
    } else if ( graph && nextGraph === null ) {
      this._revealAnimation({'delay': 0});
    }
  }

  /****************************************************************************
  ****************************************************************************/
  updateData( data ) {
    let props = {...this.props, 'data': data};
    let state = this._initState( props );

    if ( state.type === 'progress' ) {
      // SVG hack for animation from  50% to 25%
      state.nextGraph = state.graph;
      state.graph     = null;
    } 

    this.setState( state );
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {
    if ( e ) { e.preventDefault(); }
  }

  /****************************************************************************
  ****************************************************************************/
  _revealAnimation( config={} ) {
    let {animation, animationConfig} = this.state;
    Animated.timing( animation, {
      'toValue': 1,
      ...animationConfig,
      ...config
    }).start();
  }

  /****************************************************************************
  ****************************************************************************/
  _generateId( prefix ) {
    return (prefix || 'chart-') + new Date().getTime() + '-' + Math.floor(Math.random() * 10000 + 1);
  }

  _initState( props={} ) {
    const { width } = Dimensions.get('window');
    let {xAxis={}, yAxis={}} = props, state = {
      'duration' : props.duration  || 600, 
      'view'     : props.view      || [props.width || (width - 20), props.height || 300],
      'padding'  : props.padding   || 40,
      'barSpace' : props.barSpace  || 5,
      'lineRadius': 7,
      'lineSpace': 20,
      'data'     : props.data      || [],
      'type'     : props.type      || 'bar',
      'fill'     : props.fill === true,
      'max'      : props.max       || 0,
      'highest'  : props.highest   || 0,
      'sum'      : props.sum       || 0,
      'axis'     : {},
      'color'    : props.color     || {
        'default'   : props.colorDefault    || 'rgba(0,0,0,.5)',
        'background': props.colorBackground || 'rgba(255,255,255,1)',  
        'list': props.colorList || [
          'rgba(28, 201, 157, 1)', //'#1cc99d', // green
          'rgba(82, 183, 242, 1)', //'#52b7f2', // blue
          'rgba(243, 80, 114, 1)', //'#f35072', // red
          'rgba(240, 197, 92, 1)', //'#f0c55c', // yellow
          'rgba(134, 117, 244, 1)', //'#8675f4', // purple
          'rgba(216, 144, 59, 1)', //'#d8903b', // orange
          'rgba(233, 163, 191, 1)', //'#e9a3bf', // pink
        ]
      },
      'previous' : {...(this.state || {})} 
    };

    state.pieRadius = parseInt((state.view[0] / 3.5));
    state.pieStroke = parseInt((state.pieRadius / 3.5));

    state.axis.x  = {
      'max': (state.view[0] - (state.padding*2)),
      'list': [],
      'grid': 1 + (xAxis.grid || 0),
      'color': xAxis.color || 'rgba(0,0,0,.7)',
      'lineSize' : [2,6],
      'text' : xAxis.text,
    };
    state.axis.y  = {
      'max'  : (state.view[1] - (state.padding*2)),
      'list' : [],
      'grid' : 1 + (yAxis.grid || 0),
      'color': yAxis.color || 'rgba(0,0,0,.7)',
      'lineSize' : [6,2],
      'separation' : yAxis.separation || 0,
      'unit' : yAxis.unit || '',
    };

    state.viewBox = [0,0,state.view[0],state.view[1]].join(' ');
    state.graph   = this._initGraph( state );

    if ( props.axis === true || (props.axis !== false && state.type.match(/^(bar|line)/i)) ) {
      state.axis.x.list = this._initAxisList('x', state);
      state.axis.y.list = this._initAxisList('y', state);
    }

    //console.log('=== LIST ==='); console.log( state ); console.log( state.axis );
    return state;
  }

  _initGraph( state ) {
    let info = {'list': [], 'pin': {}, 'sum': 0, 'highest': 0, 'color': 0};
    if ( ! state ) { return info; }

    if ( typeof(state.highest) === 'number' ) { info.highest = state.highest; }

    (state.data instanceof Array ? state.data : [state.data]).forEach( (d,i) => {
      let data = typeof(d) === 'number' ? {'value': d} : (
        typeof(d.value) === 'number' || d instanceof Array ? d : null
      );
      if ( ! data  ) { return; }

      let value = 0, cloned = null;
      if ( data instanceof Array ) {
        cloned = data.reduce( (p,n) => {
          let t = typeof(n) === 'number' ? {'value': n} : (
            typeof(n.value) === 'number' ? n : null
          );
          if ( ! t ) { return; }

          let tmp = {...t, 'id': this._generateId('graph-'+i)};
          value += tmp.value || 0;

          info.highest = info.highest < tmp.value ? tmp.value : info.highest;
          info.pin[tmp.id] = tmp;
          p.push( tmp ); 
          return p;
        }, []);
      } else {
        cloned = {...data, 'id': this._generateId('graph-'+i)};
        value = cloned.value || 0;
        info.pin[cloned.id] = cloned;
        info.highest = info.highest < value ? value : info.highest;
      }

      info.sum    += value;
      info.list.push( cloned );    
    });

    if ( state.type === 'progress' ) {
      info.sum = 100;
    } else if ( typeof(state.sum) === 'number' && state.sum > info.sum) {
      info.sum = state.sum;
    }

    if ( state.type === 'pie' || state.type === 'progress' ) {
      this._initGraphPieInfo( state, info );
    } else if ( state.type === 'line' || state.type === 'bar' ) {      
      if ( info.list[0] instanceof Array ) {
        let collection = info.list, storage = [], length = collection.length;

        for ( let i=0; i<length; i++ ) {
          let color =  state.color.list[info.color++];
          collection[i].forEach( (d) => d.color = color );
          let tmp = {...info, 'list': collection[i] };

          state.type === 'line' ? this._initGraphLineInfo( state, tmp ) : 
            this._initGraphBarInfo( state, tmp, {'count': length, 'index': i} );
          storage = storage.concat( tmp.list );
        }
        info.list = storage;
      } else {
        let color = state.color.list[info.color++];
        info.list.forEach( (d) => d.color = color );
        state.type === 'line' ? this._initGraphLineInfo( state, info ) : 
          this._initGraphBarInfo( state, info );
      }
    }

    return info;
  }

  _initGraphPieInfo( state, info ) {
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

    let sumDegree = 0;
    info.list.forEach( (data) => {
      data.type     = state.type || 'pie';
      data.duration = (state.duration / 1000)+'s';
      data.percent  = data.value / info.sum;
      data.degree   = 360 * data.percent;
      data.stroke   = state.pieStroke || 50;
      data.radius   = state.pieRadius || 100;
      data.cx       = (state.axis.x.max / 2) + state.padding;
      data.cy       = (state.axis.y.max / 2) + state.padding;
      data.dash     = data.radius * 2 * Math.PI;     

      if ( data.type === 'pie' ) {
        data.path = getPath(data.cx, data.cy, data.radius, sumDegree, (data.degree + sumDegree));
      } else {
        data.path = getPath(data.cx, data.cy, data.radius, sumDegree, (data.degree + sumDegree));
        //data.path = getPath(data.cx, data.cy, data.radius, 0, 359.999);
        //data.animateFrom = data.dash;
        //data.animateTo   = data.dash * (1 + data.percent);
      }

      data.color    = data.color || state.color.list[info.color++];
      data.style    = {
        'fill'       : 'none',
        'stroke'     : data.color,
        'strokeWidth': data.stroke,
        'strokeDasharray': data.dash,
        'strokeLinecap' : 'butt'
      };

      sumDegree += data.degree;
    });

    if ( state.type === 'progress' ) {
      this._initGraphPieInfoProgress(state, info, getPath);
    } else {
      this._initGraphPieInfoText(state, info);
    }
  };

  _initGraphPieInfoText( state, info ) {
    let length = info.list.length, index = 0;
    let height = info.list[0].radius - info.list[0].stroke;
    let gap    = 20, space = (height*2) / length;

    for ( let i=0; i<length; i++ ) {
      let data = info.list[i];
      if ( ! data || ! data.cx || ! data.cy ) { continue; }

      info.list.push({
        'id'  : this._generateId('pie-text-'+i),
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
  }

  _initGraphPieInfoProgress( state, info, getPath ) {
    let current = info.list[0];

    if ( (((state.previous || {}).graph || {}).list || [])[1] ) {
      let previous = state.previous.graph.list[1];
      current.animateFrom = previous.animateTo;
    }

    let cloned  = JSON.parse(JSON.stringify(current));
    cloned.id      = this._generateId('progress');
    cloned.value   = 100;
    cloned.degree  = 360;
    cloned.percent = 1;
    cloned.path    = getPath(cloned.cx, cloned.cy, cloned.radius, 0, 359.999); 
    cloned.dash    = 0;
    cloned.style.stroke = state.color.default;
    cloned.style.strokeDasharray = cloned.dash;
    cloned.animate = false;
    info.list.unshift( cloned );

    info.list.push({
      'id'  : this._generateId('progress-text'),
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
    });
  }

  _initGraphLineInfo( state, info ){
    info.width = (state.axis.x.max - (state.lineSpace * 2)) / (info.list.length - 1);
    info.linePath = {'pointList': [], 'prePoint': null, 'dash': 0, 'duration':(state.duration / 1000)};
    info.list.forEach( (data, i) => {
      data.type      = 'line-cirle';
      data.percent   = data.value / info.highest;
      data.width     = info.width - (state.lineSpace * 2);
      data.height    = state.axis.y.max * data.percent;
      //data.cx        = (info.width * i) + state.barSpace + state.padding + (data.width/2);
      data.cx        = (info.width * i) + state.lineSpace + state.padding;
      data.cy        = state.axis.y.max - data.height + state.padding;
      data.center    = [data.cx, data.cy];
      data.radius    = state.lineRadius;
      data.duration  = info.linePath.duration+'s';
      data.color     = data.color || state.color.background;
      data.style     = {
        'stroke': state.color.default,
        'strokeWidth': 2
      };

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

    if ( info.list.length > 1 ) { this._initGraphLinePath( state, info ); }
  }

  _initGraphLinePath( state, info ) {
    let color = info.list[0].color || state.color.default;
    let dash  = parseInt(info.linePath.dash);
    let pointList = info.linePath.pointList;
    info.list.unshift({
      'id'         : this._generateId('line-path'),
      'type'       : 'path',
      'path'       : 'M '+ pointList.join(' L '),
      'duration'   : info.linePath.duration+'s',
      'dash'       : dash,
      'animateFrom': dash,
      'animateTo'  : 0,
      'style'      : {
        'fill': 'none',
        'stroke': color,
        'strokeWidth': 4,
        'strokeDasharray': dash,
      }
    });

    if ( ! state.fill ) { return; }
    let first  = info.list[1];
    let last   = info.list[(info.list.length - 1)];
    let bottom = state.axis.y.max + state.padding;

    pointList  = pointList.concat([
      [last.cx,  bottom].join(','),
      [first.cx, bottom].join(',')
    ]);

    info.list.unshift({
      'id'         : this._generateId('line-polygon'),
      'type'       : 'line-polygon',
      'points'     : pointList.join(' '),
      'duration'   : info.linePath.duration+'s',
      'animateTo'  : .6,
      'style'      : {
        'fill'       : color,
        'opacity'    : .4,
        'stroke'     : 'transparent',
        'strokeWidth': 0,
       }
    });
  }

  _initGraphBarInfo( state, info, multiple ){
    info.width  = state.axis.x.max / info.list.length;
    info.list.forEach( (data, i) => {
      data.type      = 'bar-path';
      data.percent   = data.value / info.highest;
      data.width     = info.width - (state.barSpace * 2);
      data.height    = state.axis.y.max * data.percent;
      data.x         = (info.width * i) + state.barSpace + state.padding;
      data.y         = state.axis.y.max + state.padding;
      data.center    = [data.x + (data.width/2), data.y - (data.height/2)];

      if ( multiple && multiple.count > 1 && typeof(multiple.index) === 'number' ) {
        data.width  = data.width / multiple.count;
        data.x      = data.x + (multiple.index * data.width);
      }

      data.duration  = (state.duration / 1000)+'s';
      data.color     = data.color || state.color.list[info.color++];
      data.style     = {
        'fill': data.color,
        'stroke': state.color.default,
        'strokeWidth': 1
      };      

      /*
      data.animateAttributeName = 'd';
      data.animateFrom = [
        'M',
        [data.x, data.y].join(','),
        [data.x, data.y].join(','),
        [data.x+data.width, data.y].join(','),
        [data.x+data.width, data.y].join(',')
      ].join(' ');
      */

      data.path = [
        'M',
        [data.x, data.y].join(','),
        [data.x, data.y-data.height].join(','),
        [data.x+data.width, data.y-data.height].join(','),
        [data.x+data.width, data.y].join(',')
      ].join(' ');

    });
  }

  /*
  _initGraphBarInfo( state, info, multiple ){
    info.width  = state.axis.x.max / info.list.length;
    info.list.forEach( (data, i) => {
      data.type      = 'bar';
      data.percent   = data.value / info.highest;
      data.width     = info.width - (state.barSpace * 2);
      data.height    = state.axis.y.max * data.percent;
      data.x         = (info.width * i) + state.barSpace + state.padding;
      data.y         = state.axis.y.max - data.height + state.padding;
      data.center    = [data.x + (data.width/2), data.y + (data.height/2)];
      data.transform = 'rotate(180 '+data.center[0] +' '+data.center[1]+')';
      data.duration  = (state.duration / 1000)+'s';
      data.color     = data.color || state.color.list[info.color++]; 

      if ( multiple && multiple.count > 1 && typeof(multiple.index) === 'number' ) {
        data.width  = data.width / multiple.count;
        data.x      = data.x + ( (multiple.count - multiple.index) * data.width) - data.width;
        //data.inner  = [data.x + (data.width/2), data.y + (data.height/2)];
      }
    });
  }
  */

  /****************************************************************************
  ****************************************************************************/
  _initAxisList(axis, state) {
    let list = [];
    if (! state || ! state.axis || ! state.axis[axis] ) { return list; }

    let padding = state.padding, path = '', delta = 0, count = state.axis[axis].grid || 1;
    let xMax    = state.axis.x.max, yMax = state.axis.y.max;
    let gap     = axis === 'x' ? parseInt((yMax / count)) : parseInt((xMax / count));

    for ( let i=0; i<count; i++ ) {
      if ( axis === 'x' ) {
        delta = yMax + padding - (gap*i);
        path  = 'M '+padding+','+delta+' '+ (xMax+padding)+','+delta;
      } else {
        delta = padding + (gap*i);
        path = 'M '+delta+','+padding+' '+ delta+','+(yMax+padding);
      }

      list.push({
        'id'   : 'axis-'+axis+'-'+i,
        'type' : 'path',
        'path' : path,
        'style': {
          'stroke'      : state.axis[axis].color || '#444',
          'strokeWidth' : '2',
          'fill'        : 'none',
          'opacity'     : i ? '.2' : '1'
        }
      });
    }

    if ( state.type.match(/^(bar|line)/i) ) { 
      axis === 'x' ? this._initXaxisText( state, list ) :
        this._initYaxisText( state, list );
    }
    return list;
  }

  _initXaxisText( state, list ) {
    let bottom = state.axis.y.max + state.padding;
    let text   = state.axis.x.text instanceof Array ? state.axis.x.text : (
      state.axis.x.text ? [state.axis.x.text] : []
    );
    if ( ! text.length || ! ((state.graph || {}).list || []).length ) { return; }

    let source     = (state.data instanceof Array ? state.data : [state.data]);
    let collection = source[0] instanceof Array ? source[0] : source;
    let lineSize   = state.axis.x.lineSize, index = 0;

    state.graph.list.forEach( (data,i) => {
      if ( ! data.center || ! text[index] ) { return; }
      let x = data.center[0];

      list.push({
        'id'  : this._generateId('x-text-'+i),
        'type': 'text',
        'x'   : x,
        'y'   : bottom + 20,
        'text': text[index++],
        'style': {
          'fill'       : state.axis.x.color || '#444',
          'fontFamily' : 'Arial, Helvetica, sans-serif',
          'fontSize'   : '100%'          
        }
      });

      list.push({
        'id'  : this._generateId('x-p-'+i),
        'type': 'path',
        'path': 'M ' + (x-(lineSize[0]/2))+','+(bottom-lineSize[1]) + ' L '+ (x-(lineSize[0]/2))+','+bottom,
        'style': {
          'stroke'      : state.axis.x.color || '#444',
          'strokeWidth' : '2',
          'fill'        : 'none',
        }
      });
    });
  }

  _initYaxisText( state, list ) {
    let highest = state.graph.highest || 0, separation = state.axis.y.separation;
    if ( ! highest || ! separation ) { return; }   

    let lineSize = state.axis.y.lineSize, unit = state.axis.y.unit || '';
    let bottom   = state.axis.y.max + state.padding;
    let value    = highest / separation, height = state.axis.y.max / separation;

    for ( let i=0; i<separation; i++ ) {
      let y = bottom - (height *(i+1));
      let x = state.padding;

      list.push({
        'id'  : this._generateId('x-text-'+i),
        'type': 'text',
        'x'   : x - 5,
        'y'   : y + 5,
        'textAnchor': 'end',
        'text': (value * (i+1)) + unit,
        'style': {
          'fill'       : state.axis.y.color || '#444',
          'fontFamily' : 'Arial, Helvetica, sans-serif',
          'fontSize'   : '100%'          
        }
      });

      list.push({
        'id'  : this._generateId('y-p-'+i),
        'type': 'path',
        'path': 'M ' + x+','+y + ' L '+ (x+lineSize[0])+','+y,
        'style': {
          'stroke'      : state.axis.y.color || '#444',
          'strokeWidth' : '2',
          'fill'        : 'none',
        }
      });      
    }
  }
}