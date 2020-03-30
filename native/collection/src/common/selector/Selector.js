import React from 'react';
import { Platform, Modal, StyleSheet, Text, View, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {convertTextToDate, convertDateToText} from '../../util/Function';
import { Theme }  from '../style/Theme.js';

export default class Selector extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      ...this._initState( props )
    };

    this._click      = this._click.bind(this);
    this._scroll     = this._scroll.bind(this);
    this._scrollBgin = this._scrollBegin.bind(this);
    this._scrollEnd  = this._scrollEnd.bind(this);
    this._setLayout  = this._setLayout.bind(this);
  }

  render() {
    const { styleConfig={} } = this.props;
    const {space, horizontal, list, itemSize, selected, scrollBegin} = this.state;

    return (
      <View onLayout={this._setLayout} style={[
        styles.container,
        styleConfig.container,
        (horizontal ? styles.horizontal : styles.vertical)
      ]}>
        <ScrollView ref="scroller" style={styles.container} horizontal={horizontal} contentContainerStyle={styles.contentContainer}
          onScrollBeginDrag={(e)=>{this._scrollBegin(e)}}
          //onScrollEndDrag={(e)=>{this._scrollEnd(e)}}
          onScroll={(e)=>{this._scroll(e)}}
        >
          { (list || []).map( (data,i) => (
            <Text key={'item-'+i} ellipsizeMode='tail' numberOfLines={1} style={[
              styles.itemText,
              data.value === selected ? styles.itemSelected : (scrollBegin ? styles.itemReveal : styles.itemShy),
              {'width' : (data.width || 'auto')},
              {'height': (data.height || 'auto')}
            ]}>{data.text || ''}</Text>
          )) }
        </ScrollView>
      </View>
    );        
  }

  componentDidMount() {
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {
  }

  _scrollBegin( e ) {
    this.setState({'scrollBegin': {
      'x': e.nativeEvent.contentOffset.x || 0,
      'y': e.nativeEvent.contentOffset.y || 0,
    }});
  }

  _scrollEnd( e ) {
  }

  _scroll( e ) {
    let config = {...e.nativeEvent};
    let {scrollBegin, space, itemSize, list} = this.state;

    if ( scrollBegin ) {
      if ( config.contentOffset.x !== scrollBegin.x ) {
        config.direction = config.contentOffset.x > scrollBegin.x ? 'right' : 'left';
      } else if ( config.contentOffset.y !== scrollBegin.y ) {
        config.direction = config.contentOffset.y > scrollBegin.y ? 'down' : 'up';
      }
    }

    clearTimeout( this.state.timer || 0 );
    this.state.timer = setTimeout( () => {
      this._scrollToItem( config );
    }, 20);
  }

  _setLayout( e ) {
    //if ( ! this.state.layout || ! e || ! e.nativeEvent ) { return; }
    let state = {...this.state, 'layout': {...e.nativeEvent.layout}};
    state.layout.center = [
      state.layout.x + (state.layout.width/2),
      state.layout.y + (state.layout.height/2),
    ];

    //console.log('== LAY OUT ==='); console.log( state.layout );
    state.list = JSON.parse(JSON.stringify(state.originalList));
    if ( state.horizontal ) {
      state.space = state.layout.center[0] - (state.itemSize/2) - state.layout.x;
      state.list.unshift({'width': state.space});
      state.list.push({'width': state.space});
    } else {

    }

    this.setState( state );
    setTimeout( () => {
      this._scrollToItem({'selected': state.selected, 'animated': false}, state); 
    }, 200);
  }

  /****************************************************************************
  ****************************************************************************/
  _scrollToItem( config={}, state ) {
    let {space=0, list=[], itemSize, scrollBegin, horizontal} = state || this.state;

    if ( (! scrollBegin && ! state) || (scrollBegin || {}).onScroll ) { return; }

    if ( scrollBegin ) { scrollBegin.onScroll = true; }

    let scrolled = 0, delta = 0, length = list.length, index = -1;
    if ( config.contentOffset ) {
      scrolled = config.contentOffset.x || 0;
      if ( config.direction ) {
        scrolled += config.direction === 'right' ? (itemSize/2) : ((itemSize/2)*-1);
      }

      delta = scrolled / itemSize;
      index = Math.round(delta);

    } else if ( config.selected !== undefined) {
      index = this._getSelectedIndex({'selected': config.selected, 'list': list});
    } 

    if ( index !== -1 ) {
      if ( horizontal ) {
        this.refs.scroller.scrollTo({
          'x': (itemSize*index),
          'animated': config.animated === false ? false : true
        });
      } else {

      }
    }
    

    let item = (index+2) >= length ? list[(length-2)] : list[(index+1)];
    setTimeout( () => {
      this.setState({'scrollBegin': null});
    }, 100);
    this._setSelected( item );
  }

  _setSelected( item ) {
    if ( ! item ) { return; }

    this.setState({'selected': item.value});
    if ( typeof(this.props.onChange) === 'function' ) {
      this.props.onChange( item.value );
    }
  }

  _getSelectedIndex( state ) {
    let {selected, list} = state || this.state;
    for ( let i=0; i<(list || []).length; i++ ) {
      if ( list[i].value === selected ) { return i; }
    }
    return -1;
  }

  /****************************************************************************
  ****************************************************************************/
  _initState( props ) {
    let {selected, list, vertical} = props, state = {
      'horizontal': vertical !== true,
      'space'     : 0,
      'list'      : [],
      'selected'  : props.selected,
      'dimension' : {
        'width' : Dimensions.get('window').width,
        'height': Dimensions.get('window').height
      }
    };

    state.itemSize = props.size || (state.horizontal ? 100 : 40);

    let found = false;
    (list || []).forEach( (data, index) => {
      if ( data === undefined || data === null ) { return; }

      let cloned = typeof(data) === 'object' ? {...data} :
        {'value': data, 'text': data};

      if ( cloned.text === undefined && cloned.value === undefined ) { return; }

      if ( state.horizontal ) {
        cloned.width  = state.itemSize;
        cloned.middle = (cloned.width * index) + (cloned.width / 2);

      } else {
        cloned.height = state.itemSize;        
        cloned.middle = (cloned.height * index) + (cloned.height / 2);
      }

      state.list.push( cloned );
      if ( found === false ) { found = cloned.value === state.selected; }
    });

    if ( found === false ) { state.selected = state.list[0].value; }

    state.originalList = JSON.parse(JSON.stringify(state.list));
    state.list = null;
    return state;
  }
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'position': 'relative'
  },
  'contentContainer': {
    'position': 'relative'
  },
  'horizontal': {
  },
  'vertical': {
  },
  'itemText': {
    ...Theme.font.basic,
    'fontSize': 18,
    'lineHeight': 24,
    'textAlign': 'center',
    'color': '#00383D',
    'padding': 5
  },
  'itemSelected': {
    'fontSize': 20,
    'textDecorationLine': 'underline',
    'textDecorationStyle': 'solid',
    'fontWeight': 'bold'
  },
  'itemReveal': {
    'opacity': 1    
  },
  'itemShy': {
    'opacity': .3,
  },
});