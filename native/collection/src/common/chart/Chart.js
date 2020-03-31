/*
<TSpan key={'tspan-'+(data.id || i)} dy={data.dy || '0'} style={data.style}>{data.text}</TSpan>  
https://advancedweb.hu/plotting-charts-with-svg/
https://github.com/react-native-community/react-native-svg/issues/951
https://lottiefiles.com/6391-email-sent
*/

import React, {useMemo} from 'react';
import { StyleSheet, View, Animated, Dimensions, Easing } from 'react-native';
import Svg, {
  Circle, Ellipse, G, Text, TSpan, TextPath, Path, Polygon, Polyline, Line, Rect,
} from 'react-native-svg';

import {generateId} from  '../../util/Function';
import {initGraphBarInfo} from './util/ChartBarFunction';
import {initGraphLineInfo} from './util/ChartLineFunction';
import {initGraphPieInfo} from './util/ChartPieFunction';
import {initAxisList} from './util/ChartAxisFunction';
import {initLegendInfo} from './util/ChartLegendFunction';
import {initGraphEngineInfo} from './util/ChartEngineFunction';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedText = Animated.createAnimatedComponent(Text);

const ChartTSpan = ({tspan}) => {
  return <React.Fragment> 
    { (tspan instanceof Array ? tspan : [tspan]).map( (data, i) => {
        return ! data || ! data.text ? null :
          <TSpan key={'tspan-'+(data.id || i)} dy={data.dy || '1.4em'} style={data.style} x={data.x || '0'}
            dominantBaseline={data.dominantBaseline || 'middle'} textAnchor={data.textAnchor || 'middle'}
          >{data.text}</TSpan>
    }) }
  </React.Fragment>
};

const ChartGraph = ({data, animate}) => {
  let graph = null;
  if ( ! data ) { return graph; }

  let invalid = ['x','y','cx','cy'].find( (key) => typeof(data[key]) !== 'undefined' && isNaN(data[key]) );
  if ( invalid ) { return graph; }

  if ( data.type === 'bar' ) {
    graph = <Rect id={data.id} x={data.x} y={data.y} fill={data.color} width={data.width} height={data.height} transform={data.transform}/>
  } else if ( data.type === 'line-polygon' ) {
    graph = data.animation && data.animation.value && data.animation.attributeName === 'fill-opacity' ?
      <AnimatedPolyline points={data.points} style={data.style} fillOpacity={data.animation.value}/> :
      <Polygon points={data.points} style={data.style}/>
  } else if ( data.type === 'line-cirle' ) {
    graph = <Circle id={data.id} cx={data.cx} cy={data.cy} r={data.radius} fill={data.color} style={data.style}/>
  } else if ( data.type === 'pie' || data.type === 'progress' || data.type === 'bar-path' || data.type === 'path' ) {
    graph = data.animation && data.animation.value && data.animation.config && data.animation.attributeName === 'stroke-dashoffset' ? 
      <AnimatedPath id={data.id} style={data.style} d={data.path} strokeDashoffset={data.animation.value.interpolate(data.animation.config)}/> : (
        data.animation && data.animation.value && data.animation.config ? 
          <AnimatedPath id={data.id} style={data.style} d={data.animation.value.interpolate(data.animation.config)}/> : (
            data.animation && data.animation.value && data.animation.attributeName === 'fill-opacity' ?
            <AnimatedPath id={data.id} style={data.style} d={data.path} fillOpacity={data.animation.value}/>:
            <Path id={data.id} style={data.style} d={data.path}/>
          )
      );
  } else if ( data.type === 'text') {
    graph = <G>
      { data.animation && data.animation.value && data.animation.attributeName === 'fill-opacity' ?
          <AnimatedText id={data.id} x={data.x} y={data.y} style={data.style}
            dominantBaseline={data.dominantBaseline || 'middle'}
            textAnchor={data.textAnchor || 'middle'}
            fillOpacity={data.animation.value}
          >{data.tspan ? <ChartTSpan tspan={data.tspan}/> : (data.textPath ? <TextPath href={data.textPath}>{data.text}</TextPath>: data.text)}</AnimatedText>
          :
          <Text id={data.id} x={data.x} y={data.y} style={data.style}
            dominantBaseline={data.dominantBaseline || 'middle'}
            textAnchor={data.textAnchor || 'middle'}
          >{data.tspan ? <ChartTSpan tspan={data.tspan}/> : (data.textPath ? <TextPath href={data.textPath}>{data.text}</TextPath>: data.text)}</Text>
      }
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
      'id': generateId(),
      'viewWrapper': {
        'animation': new Animated.Value(0),
        'animationConfig': {'duration': 0, 'delay': 0},
      },
      ...this._getInitialState(props),
      ...this._initState( props )
    };

    this._click = this._click.bind(this);
    this.updateData = this.updateData.bind(this);    
  }

  render() {
    const {id, viewBox, view, axis, graph, viewWrapper} = this.state;

    return graph ? <Animated.View style={{'opacity': viewWrapper.animation}}>
      <Svg viewBox={viewBox} width={view[0]} height={view[1]}>
        { axis && (((axis.x || {}).list || []).length > 0 || ((axis.y||{}).list||[]).length > 0) && <G id="axis-wrapper">
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
                data ? (
                  data.transform ? <G transform={data.transform} key={'graph-'+(data.id || i)}>
                    <ChartGraph data={data}/>
                  </G> : <ChartGraph key={'graph-'+(data.id || i)} data={data}/>
                ) : null
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
      this.setState({'nextGraph': undefined});
    } else {
      let pData  = JSON.stringify(prevProps.data || []);
      let cData  = JSON.stringify(this.props.data || []);
      if ( pData !== cData ) { this.updateData( null, { ...this.props }); }

      /*
      let pData  = JSON.stringify(prevProps.data || []);
      let cData  = JSON.stringify(this.props.data || []);
      let pXaxis = JSON.stringify(prevProps.xAxis || {});
      let cXaxis = JSON.stringify(this.props.xAxis || {});
      let pYaxis = JSON.stringify(prevProps.yAxis || {});
      let cYaxis = JSON.stringify(this.props.yAxis || {});

      if ( pData !== cData || pXaxis !== cXaxis || pYaxis !== cYaxis ) {
        this.updateData( null, { ...this.props }); 
      }
      */
    }
  }

  /****************************************************************************
  ****************************************************************************/
  updateData( data, config ) {
    let props = {...this.props, 'data': data, ...(config || {})};
    let state = this._initState( props );

    state.nextGraph = state.graph;
    state.graph     = null;

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
    let {viewWrapper, graph} = this.state;
    Animated.timing( viewWrapper.animation, {
      'toValue': 1,
      ...viewWrapper.animationConfig,
      ...config
    }).start();

    // https://reactnative.dev/docs/0.60/easing
    ((graph || {}).list || []).forEach((data)=> {
      if ( ! data.animation || ! data.animation.value ) { return; }
      //console.log( data.animation.type );

      Animated.timing(data.animation.value, {
        'toValue' : 1,
        'delay'   : data.delay    || 0,
        'duration': data.duration || 600,
        'easing'  : data.animation.mode === 'linear' ? Easing.linear : Easing.ease, // ease, linear, quad, bounce, elastic(2)
        'useNativeDriver': true, // also tried true
      }).start();
    });
  }

  /****************************************************************************
  ****************************************************************************/
  _initState( props={} ) {
    const { width } = Dimensions.get('window');
    let {xAxis={}, yAxis={}} = props, state = {
      'duration' : props.duration  || 600, 
      'view'     : props.view      || [props.width || (width - 20), props.height || 300],
      'padding'  : props.padding   || 40,
      'barSpace' : props.barSpace  || 5,
      'lineRadius': 7,
      'lineSpace': 20,
      'legendSpace': 16,
      'engineSize': 20,
      'engineRemovePart': 6,
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
        'list': (props.colorList || []).concat([
          'rgba(28, 201, 157, 1)', //'#1cc99d', // green
          'rgba(82, 183, 242, 1)', //'#52b7f2', // blue
          'rgba(243, 80, 114, 1)', //'#f35072', // red
          'rgba(240, 197, 92, 1)', //'#f0c55c', // yellow
          'rgba(134, 117, 244, 1)', //'#8675f4', // purple
          'rgba(216, 144, 59, 1)', //'#d8903b', // orange
          'rgba(233, 163, 191, 1)', //'#e9a3bf', // pink
        ]).filter( (d) => !! d )
      },
      'symbolList': ['circle','square','triangle','triangle-down','square-single-cross', 'square-cross','triangle-left','triangle-right',''],
      'symbol'   : props.symbol === false ? false : true,
      'textPath' : props.textPath || true,
      'previous' : {...(this.state || {})},
      'animation': props.animation !== false,
      'legend'   : props.legend instanceof Array ? props.legend : null,
      'concatnation': props.concatnation === true,
      'shadow': props.shadow !== false
    };

    state.pieRadius    = parseInt((state.view[0] / 3.4));
    state.pieStroke    = parseInt((state.pieRadius / 3.4));
    state.enginStroke  = parseInt((state.pieRadius / 4));
    state.engineRadius = parseInt((state.view[0] / 2.3));

    if ( typeof(state.padding) === 'number' ) {
      state.padding = {
        'top'   : state.padding,
        'left'  : state.padding,
        'right' : state.padding,
        'bottom': state.padding
      };
    }

    if ( typeof(state.padding) !== 'object' ) { state.padding = {}; }

    ['top', 'left', 'right', 'bottom'].forEach( (key) => {
      state.padding[key] = state.padding[key+'Original'] || state.padding[key] || 0;
    });

    if ( state.legend && state.legend.length && state.type.match(/^(bar|line|spline)/i) ) {
      for ( let key in state.padding ) {
        if ( key.match(/Original/i) ) { continue; }
        state.padding[key+'Original'] = state.padding[key];
      }
      state.padding.top = parseInt(((state.padding.top * 1.5) + (state.legend.length * state.legendSpace)));
    }

    state.axis.x  = {
      ...xAxis,
      'max': state.view[0] - state.padding.left - state.padding.right,
      'list': [],
      'color': xAxis.color || 'rgba(0,0,0,.7)',
      'textColor': xAxis.textColor || 'rgba(0,0,0,.7)',
      'lineSize' : [2,4]
    };
    state.axis.y  = {
      ...yAxis,
      'max'  : state.view[1] - state.padding.top - state.padding.bottom,
      'list' : [],
      'color': yAxis.color || 'rgba(0,0,0,.7)',
      'textColor': yAxis.textColor || 'rgba(0,0,0,.7)',
      'lineSize'      : [4,2],
      'separation'    : yAxis.separation || 0,
      'separationLine': yAxis.separationLine === true,
      'toRight'       : yAxis.toRight === true,
    };

    state.centerPoint = [
      (state.axis.x.max + state.padding.left + state.padding.right)/2,
      (state.axis.y.max + state.padding.top + state.padding.bottom)/2
    ];

    state.viewBox = [0,0,state.view[0],state.view[1]].join(' ');
    state.graph   = this._initGraph( state );

    if ( props.axis === true || (props.axis !== false && state.type.match(/^(bar|line|spline)/i)) ) {
      state.axis.x.list = this._initAxisList('x', state);
      state.axis.y.list = this._initAxisList('y', state);
    }

    //console.log('=== LIST ==='); console.log( state ); console.log( state.axis );
    return state;
  }

  _initGraph( state ) {
    let info = {
      'list'   : [],
      'pin'    : {},
      'sum'    : 0,
      'highest': 0,
      'multiple': false,
      'color'  : {'i':0, 'used': []},
      'symbol' : {'i':0, 'used': []},
      'animation': []
    };

    if ( ! state ) { return info; }

    if ( typeof(state.highest) === 'number' ) { info.highest = state.highest; }

    (state.data instanceof Array ? state.data : [state.data]).forEach( (d,i) => {
      let data = typeof(d) === 'number' ? {'value': d} : (
        typeof(d.value) === 'number' || d instanceof Array ? d : null
      );
      if ( ! data  ) { return; }

      let value = 0, cloned = null;
      if ( data instanceof Array ) {
        info.multiple = true;

        if ( info.symbol.next ) {
          info.symbol.used.push(state.symbolList[info.symbol.i]);
          info.symbol.i++;
        }
        info.symbol.next = false;

        cloned = data.reduce( (p,n) => {
          let t = typeof(n) === 'number' ? {'value': n} : (
            typeof(n.value) === 'number' ? n : null
          );
          if ( ! t ) { return; }

          let tmp = {...t, 'id': generateId('graph-'+i)};
          if ( tmp.symbol !== false && state.symbol ) {
            tmp.symbol = state.symbolList[info.symbol.i];
            info.symbol.next = true;
          }

          if ( state.type === 'engine' ) {
            tmp.size = tmp.size || state.engineSize || 20;
            tmp.removePart = tmp.removePart || state.engineRemovePart || 6;         
          }

          value += tmp.value || 0;

          info.highest = info.highest < tmp.value ? tmp.value : info.highest;
          info.pin[tmp.id] = tmp;
          p.push( tmp ); 
          return p;
        }, []);

        if ( state.type === 'bar' && state.concatnation && info.highest < value ) {          
          info.highest = value;
        }
      } else {
        cloned = {...data, 'id': generateId('graph-'+i)};

        if ( state.type === 'engine' ) {
          cloned.size = cloned.size || state.engineSize || 20;
          cloned.removePart = cloned.removePart || state.engineRemovePart || 6;         
        } else if ( state.type === 'pie' && state.symbol ) {
          cloned.symbol = state.symbolList[info.symbol.i++];
        }

        value = cloned.value || 0;
        info.pin[cloned.id] = cloned;
        info.highest = info.highest < value ? value : info.highest;
      }

      info.sum    += value;
      info.list.push( cloned );    
    });

    if ( info.symbol.next ) {
      info.symbol.used.push(state.symbolList[info.symbol.i]);
      info.symbol.i++;
    }

    if ( state.type === 'progress' ) {
      info.sum = 100;
    } else if ( typeof(state.sum) === 'number' && state.sum > info.sum) {
      info.sum = state.sum;
    }

    if ( state.type === 'pie' || state.type === 'progress' ) {
      this._initGraphPieInfo( state, info );
    } else if ( state.type === 'line' || state.type === 'spline' || state.type === 'bar' ) {      
      if ( info.list[0] instanceof Array ) {
        let collection = info.list, storage = [], length = collection.length;

        for ( let i=0; i<length; i++ ) {
          let color =  state.color.list[info.color.i++];
          collection[i].forEach( (d) =>{
            if ( d.color ) { return; }
            d.color = color;
          });
          let tmp = {...info, 'list': collection[i] };

          state.type === 'line' || state.type === 'spline' ? this._initGraphLineInfo( state, tmp ) : 
            this._initGraphBarInfo( state, tmp, {
              'count': state.concatnation ? info.list.length : length,
              'index': i
            });
          storage = storage.concat( tmp.list );
        }
        info.list = storage;
      } else {
        let color = state.color.list[info.color.i++];
        info.list.forEach( (d) => d.color = color );
        state.type === 'line' || state.type === 'spline' ?
          this._initGraphLineInfo( state, info ) : 
          this._initGraphBarInfo( state, info );
      }
    } else if ( state.type === 'engine' ) {
      this._initGraphEngineInfo( state, info );
    }

    if ( (state.legend || []).length ) {
      this._initLegendInfo( state, info );
    }
    return info;
  }

  _initGraphPieInfo( state, info ) {
    initGraphPieInfo( state, info );
  }

  _initGraphLineInfo( state, info ){
    initGraphLineInfo( state, info );
  }

  _initGraphBarInfo( state, info, multiple ) {
    initGraphBarInfo( state, info, multiple );
  }

  _initLegendInfo( state, info ) {
    initLegendInfo( state, info );
  }

  _initGraphEngineInfo( state, info ) {
    initGraphEngineInfo(state, info);
  }

  _initAxisList(axis, state) {
    return initAxisList( axis, state );
  }

  /****************************************************************************
  <AnimatedRect
    x="5"
    y="5"
    width="90"
    height="90"
    stroke="blue"
    fill={fill}
    strokeDasharray="1 1"
    strokeWidth={oneToFivePx}
    strokeDashoffset={offset}
    strokeOpacity={strokeOpacity}
    fillOpacity={fillOpacity}
  />
  ****************************************************************************/
  _getInitialState() {
    const anim = new Animated.Value(0);
    const fillOpacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const offset = fillOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
    });
    const strokeOpacity = offset.interpolate({
      inputRange: [0, 10],
      outputRange: [0, 1],
      extrapolateRight: 'clamp',
    });
    const path = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['M20,20L20,80L80,80L80,20Z', 'M40,40L33,60L60,60L65,40Z'],
    });
    const fill = strokeOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.99)'],
    });
    const oneToFivePx = offset.interpolate({
      inputRange: [0, 10],
      outputRange: ['1px', '5px'],
    });
    return { anim, fillOpacity, offset, strokeOpacity, path, fill, oneToFivePx };
  }
}