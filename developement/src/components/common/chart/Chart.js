import React from 'react';
import './Chart.scss';

// https://css-tricks.com/building-progress-ring-quickly/

const ChartGraph = ({data}) => {
  let graph = null;

  console.log( data );

  if ( data.type === 'bar' ) {
    graph = <rect id={data.id} x={data.x} y={data.y} fill={data.color} width={data.width} height={0} transform={data.transform}>
      <animate attributeName="height" from="0" to={data.height} dur={data.duration} fill="freeze" />
    </rect>;
  } else if ( data.type === 'line-cirle' ) {
    graph = <circle id={data.id} cx={data.cx} cy={data.cy} r={data.radius} fill={data.color} style={data.style}>    
      <animate attributeName="opacity" from="0" to="1" dur={data.duration} fill="freeze" />
    </circle>;
  } else if ( data.type === 'pie' || data.type === 'progress' || data.type === 'path' ) {
    graph = <path id={data.id} style={data.style} d={data.path}>
      { data.animate !== false && <animate attributeName="stroke-dashoffset" dur={data.duration} fill="freeze"
          from={data.animateFrom !== undefined ?  data.animateFrom : data.dash}
          to={data.animateTo !== undefined ? data.animateTo : (data.dash*2)}
        />
      }
    </path>
  } else if ( data.type === 'text' && data.text ) {
    graph = <g>
      <text id={data.id} x={data.x} y={data.y} style={data.style}
        dominantBaseline="middle" textAnchor="middle"
      >{data.text}</text>
      <animate attributeName="fill-opacity" attributeType="CSS" from="0" to="1" dur={data.duration} fill="freeze"/>
    </g>
  }

  return graph;
};

/******************************************************************************
******************************************************************************/
export class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'id': this._generateId(),
      ...this._initState( props )
    };

    this._click = this._click.bind(this);
    this.updateData = this.updateData.bind(this);    
  }

  render() {    
    const {id, viewBox, axis, graph} = this.state;

    // <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox={viewBox} version="1.1"> 
    return graph ? <svg id={id} xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} version="1.1" style={{'backgroundColor':'#fff'}}>
      { (axis.x.list.length > 0 || axis.y.list.length > 0) && <g id="axis-wrapper">
          {axis.x.list.map( (data, i) => (
            <path key={'axis-x-'+i} id={data.id} d={data.path} style={data.style}/>
          ) )}
          {axis.y.list.map( (data, i) => (
            <path key={'axis-y-'+i} id={data.id} d={data.path} style={data.style}/>
          ) )}
        </g>
      }

      { graph.list && graph.list.length > 0 && <g id="graph-wrapper">
          { graph.list.map( (data,i) => (
              <ChartGraph key={'graph-'+(data.id || i)} data={data}/>
          )) }
        </g>
      }
    </svg> : null;
  }

  //componentDidMount() { setTimeout( () => { this.updateData( 80 ); }, 5000); }

  componentDidUpdate(prevProps, prevState) {
    let {graph, nextGraph} = this.state;
    if ( graph === null && nextGraph ) {
      this.setState({'graph': nextGraph, 'nextGraph': null});
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
  _generateId( prefix ) {
    return (prefix || 'chart-') + new Date().getTime() + '-' + Math.floor(Math.random() * 10000 + 1);
  }

  _initState( props ) {
    let state = {
      'duration' : props.duration  || 600, 
      'view'     : props.view      || [1040,1040],
      'padding'  : props.padding   || 20,
      'barSpace' : props.barSpace  || 20,
      'pieRadius': 360,
      'pieStroke': props.pieStroke || 60,
      'lineRadius': 12,
      'lineSpace': 20,
      'axis'     : {},
      'data'     : props.data      || [],
      'type'     : props.type      || 'bar',
      'max'      : props.max       || 0,
      'highest'  : props.highest   || 0,
      'sum'      : props.sum       || 0,
      'color'    : {
        'default'   : '#999',
        'background': '#fff',  
        'list': [
          '#1cc99d', // green
          '#52b7f2', // blue
          '#f35072', // red
          '#f0c55c', // yellow
          '#8675f4', // purple
          '#d8903b', // orange
          '#e9a3bf', // pink
        ]
      },
      'previous' : {...(this.state || {})} 
    };

    state.axis.x = {'max': (state.view[0] - (state.padding*2)), 'list': []};
    state.axis.y = {'max': (state.view[1] - (state.padding*2)), 'list': []};

    if ( props.axis === true || (props.axis !== false && state.type.match(/^(bar|line)/i)) ) {
      state.axis.x.list = this._initAxisList('x', state, 10);
      state.axis.y.list = this._initAxisList('y', state, 10);
    }

    state.viewBox = [0,0,state.view[0],state.view[1]].join(' ');
    state.graph = this._initGraph( state );

    console.log('=== LIST ==='); console.log( state ); console.log( state.axis );
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
    } else if ( state.type === 'bar' ) {
      this._initGraphBarInfo( state, info );
    } else if ( state.type === 'line' ) {      
      if ( info.list[0] instanceof Array ) {
        let collection = info.list, storage = [];
        for ( let i=0; i<collection.length; i++ ) {
          let color =  state.color.list[info.color++];
          collection[i].forEach( (d) => d.color = color );
          let tmp = {...info, 'list': collection[i] };
          this._initGraphLineInfo( state, tmp );
          storage = storage.concat( tmp.list );
        }
        info.list = storage;
      } else {
        this._initGraphLineInfo( state, info );
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
        data.path = getPath(data.cx, data.cy, data.radius, 0, 359.999);
        data.animateFrom = data.dash;
        data.animateTo   = data.dash * (1 + data.percent);
      }

      data.color    = data.color || state.color.list[info.color++];
      data.style    = {
        'fill'       : 'none',
        'stroke'     : data.color,
        'strokeWidth': data.stroke,
        'strokeDasharray': data.dash,
      };

      sumDegree += data.degree;
    });

    if ( state.type === 'progress' ) {
      this._initGraphPieInfoProgress(state, info, getPath);
    }
  };

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
      'y': current.cy,
      'style': {
        'fill'       : current.color,
        'fontFamily' : 'Arial, Helvetica, sans-serif',
        'fontSize'   : '1000%'
      }
    });
  }

  _initGraphLineInfo( state, info ){
    info.width = (state.axis.x.max - (state.padding * 2)) / (info.list.length - 1);
    info.linePath = {'pointList': [], 'prePoint': null, 'dash': 0, 'duration':(state.duration / 1000)};
    info.list.forEach( (data, i) => {
      data.type      = 'line-cirle';
      data.percent   = data.value / info.highest;
      data.width     = info.width - (state.lineSpace * 2);
      data.height    = state.axis.y.max * data.percent;
      //data.cx        = (info.width * i) + state.barSpace + state.padding + (data.width/2);
      data.cx        = (info.width * i) + state.lineSpace + state.padding;
      data.cy        = state.axis.y.max - data.height + state.padding;
      data.radius    = state.lineRadius;
      data.duration  = info.linePath.duration+'s';
      data.color     = data.color || state.color.background; 
      data.style     = {
        'stroke': state.color.default,
        'strokeWidth': 4
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

    if ( info.list.length < 2 ) { return; }

    let dash = parseInt(info.linePath.dash);
    info.list.unshift({
      'id'         : this._generateId('line-path'),
      'type'       : 'path',
      'path'       : 'M '+ info.linePath.pointList.join(' L '),
      'duration'   : info.linePath.duration+'s',
      'dash'       : dash,
      'animateFrom': dash,
      'animateTo'  : 0,
      'style'      : {
        'fill': 'none',
        'stroke': state.color.default,
        'strokeWidth': 4,
        'strokeDasharray': dash,
      }
    });
  }

  _initGraphBarInfo( state, info ){
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
    });
  }

  _initAxisList(axis, state, count, includeLast) {
    let list = [];
    if (! state || ! state.axis || ! state.axis[axis] ) { return list; }
    if (! count || isNaN(count)                       ) { return list; }

    let padding = state.padding, path = '', delta = 0;
    let xMax    = state.axis.x.max, yMax = state.axis.y.max;
    let gap     = axis === 'x' ? parseInt((yMax / count)) : parseInt((xMax / count));
    let length  = count + (includeLast ? 1 : 0);

    for ( let i=0; i<length; i++ ) {
      if ( axis === 'x' ) {
        delta = yMax + padding - (gap*i);
        path  = 'M '+padding+','+delta+' '+ (xMax+padding)+','+delta;
      } else {
        delta = padding + (gap*i);
        path = 'M '+delta+','+padding+' '+ delta+','+(yMax+padding);
      }

      list.push({
        'id'   : 'axis-'+axis+'-'+i,
        'path' : path,
        'style': {
          'stroke'      : '#444',
          'strokeWidth': '2',
          'fill'        : 'none',
          'opacity'     : i ? '.2' : '1'
        }
      });
    }
    return list;
  }
}