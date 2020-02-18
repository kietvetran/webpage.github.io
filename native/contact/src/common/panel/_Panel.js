import React from 'react';
import { StyleSheet, Text, ImageBackground, View, Animated } from 'react-native';
import Image from 'react-native-remote-svg';

import FormButton from '../form/FormButton';
import { Theme }  from '../style/Theme.js';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      'hide': typeof(props.hide) === 'boolean' ? props.hide : true,
      'arrowDown': require('../../../assets/icon/arrow/arrow-down.svg'),
      'arrowUp': require('../../../assets/icon/arrow/arrow-up.svg'),
      'animationConfig': {'duration': 600, 'delay': 0}
    };

    this.state.animation = this.state.hide ?
      (new Animated.Value(0)) : new Animated.Value(1);

    this._click = this._click.bind(this);
  }

  render() {
    const {title, styleConfig={}, children} = this.props;
    if ( ! title || ! children ) { return null; }

    const {hide, arrowUp, arrowDown, animation} = this.state;

    return (
      <View style={[styles.container, styleConfig.container || {}]}>
        <View style={styles.icon}>
          <Image style={styles.image} source={hide ? arrowDown : arrowUp}/>
        </View>
        <FormButton title={title} onPress={(e)=>{this._click(e,'toggle-panel')}}
          styleConfig={{'button': styles.button}}
        />
        { ! hide && <Animated.View style={[styles.content, {'opacity': animation}]}>
            {children}
          </Animated.View>
        }
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  toggleView( force ) {
    this._toggleView( force );
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key ) {
    if ( key === 'toggle-panel' ) {
      this._toggleView();
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _toggleView( force ) {
    let {hide, animation, animationConfig} = this.state, isBoolean = typeof(force) === 'boolean';
    if ( isBoolean && force === hide ) { return; }
    
    hide = isBoolean ? force : (! hide);
    let config = hide ? {...animationConfig, 'toValue': 0} : {...animationConfig, 'toValue': 1};

    Animated.timing( animation, config).start();
    this.setState({'hide': hide});
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