import React from 'react';
import { StyleSheet, Text, ImageBackground, View, Animated } from 'react-native';
import Image from 'react-native-remote-svg';

import FormButton from '../form/FormButton';
import { Theme }  from '../style/Theme.js';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      ...this._initState( props ),
      'arrowDown': require('../../../assets/icon/arrow/arrow-down.svg'),
      'arrowUp': require('../../../assets/icon/arrow/arrow-up.svg'),
      'animationConfig': {'duration': 600, 'delay': 0}
    };
    this._click = this._click.bind(this);
  }

  render() {
    const {styleConfig={}} = this.props;
    const {title, hide, arrowUp, arrowDown, animation, children, single} = this.state;
    if ( ! title.length || ! children.length ) { return null; }

    return (
      <View style={[styles.container, styleConfig.container || {}]}>
        <View style={single ? styles.singleContainer : styles.multipleContainer}>
          { title.map( (text, i) => (
              <View key={'panel-title'+i} style={[styles.title, (i ? styles.titleSeparation : {})]}>
                <View style={styles.icon}>
                  <Image style={styles.image} source={hide[i] ? arrowDown : arrowUp}/>
                </View>
                <FormButton title={title[i]} onPress={(e)=>{this._click(e,'toggle-panel', i)}}
                  styleConfig={{'button': styles.button}}
                />              
              </View>
          ) )}
        </View>
        { hide.map( (mode, i) => {
            return mode ? <Animated.View key={'panel-content-'+i} style={[styles.content, {'opacity': animation[i]}]}>
              {single ? children : children[i]}
            </Animated.View> : null
        })}
      </View>
    );        
  }

  /****************************************************************************
  ****************************************************************************/
  toggleView( index, force ) {
    this._toggleView( index, force );
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {
    if ( key === 'toggle-panel' ) {
      this._toggleView( data );
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _toggleView( index, force ) {
    let {hide, animation, animationConfig} = this.state;
    if ( isNaN(index) || typeof(hide[index]) !== 'boolean' || ! animation[index] ) { return; }

    let isBoolean = typeof(force) === 'boolean';
    if ( isBoolean && force === hide[index] ) { return; }
    
    let close  = {...animationConfig, 'toValue': 0};
    let open   = {...animationConfig, 'toValue': 1};
    let cloned = hide.reduce( (prev, mode, i) => {
      let value = i === index ? (isBoolean ? force : (! mode)) : false;

      value ? Animated.timing( animation[i], open ).start() :
        Animated.timing( animation[i], close ).start();

      prev.push( value );
      return prev;
    }, []);

    this.setState({'hide': cloned});
  }

  _initState( props ) {
    let {title, hide} = props, state = {
      'title': (title instanceof Array ? title : [title]).filter(v => !! v),
      'hide' : hide instanceof Array ? hide : [hide],
      'index': -1,
      'animation': [],
      'children': React.Children.toArray(props.children)
    };

    for ( let i=0; i<state.title.length; i++ ) {
      if ( typeof(state.hide[i]) !== 'boolean' ) {
        state.hide[i] = false;
      }

      state.animation[i] = state.hide[i] ?
        new Animated.Value(0) : new Animated.Value(1);

      if ( ! state.hide[i] ) { state.index = i; }
    }

    state.single = state.title.length === 1;
    return state;
  }

  //_setMaxHeight( e ){this.setState({'maxHeight': e.nativeEvent.layout.height});}
  //_setMinHeight( e ){this.setState({'minHeight' : e.nativeEvent.layout.height});}
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'position': 'relative',
    'overflow': 'hidden',
    'backgroundColor': '#fff',
    'borderRadius': 2,
    'borderWidth': 2,
    'borderStyle': 'solid',
    'borderColor': Theme.color.border
  },
  'singleContainer': {
    'flex': 1,
  },
  'multipleContainer': {
    'flex': 1,
    'flexDirection': 'row',
    'alignItems': 'stretch',
  },
  'title': {
    'flex': 1,
    'position': 'relative'
  },
  'titleSeparation': {
    'borderLeftWidth': 2,
    'borderLeftStyle': 'solid',
    'borderLeftColor': Theme.color.border
  },
  'icon': {
    ...Theme.buttonIcon,
    'position': 'absolute',
    'right': 0,
    'top': 0,
    'padding': 10
  },
  'image': {
    'flex': 1,
    'width': '100%',
    'height': '100%'
  },
  'button': {
    'borderWidth': 0,
    'textAlign': 'left',
    'backgroundColor': 'transparent',
    'color': Theme.color.font,
    'padding': 8,
    'fontWeight': '500'
  },
  'content': {
    'flex': 1,
    'overflow': 'hidden',
    'padding': 8,
    'borderTopStyle': 'dashed',
    'borderTopWidth': 1,
    'borderTopColor': Theme.color.border
  }
});