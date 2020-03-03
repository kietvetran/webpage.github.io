import React from 'react';
import { StyleSheet, Text, ImageBackground, View, Animated, Alert } from 'react-native';

import FormButton from '../form/FormButton';
import { Theme }  from '../style/Theme.js';

export default class Popup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state  = {
      ...this._initState( props ),
      'animationConfig': {'duration': 600, 'delay': 0}
    };
    this._click = this._click.bind(this);
  }

  render() {
    const {styleConfig={}, children} = this.props;
    if ( ! children ) { return null; }

    const {show, height} = this.state;

    return (
      <View style={[styles.container, styleConfig.container || {}]}>
        <FormButton type="more" styleConfig={styleConfig} onPress={(e)=>{this._click(e,'toggle-view')}} />
        { show === true && <View style={styles.popupWrapper}>
            <Text>Popup</Text>
          </View>
        }
      </View>
    );        
  }

  /****************************************************************************
  ****************************************************************************/
  show() { this._toggleView( true  ); }
  hide() { this._toggleView( false ); }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {
    if ( key === 'toggle-view' ) {
      this._toggleView();
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _toggleView( force ) {
    let show = typeof(force) === 'boolean' ? force : ! this.state.show;
    this.setState({'show': show});
  }

  _initState( props ) {
    let height = 100, state = {
      'height': props.height || height,
      'show'  : props.show === true
    };

    if ( typeof(state.height) !== 'number' || state.height < height ) {
      state.height = height;
    }

    return state;
  }

  _alert( config={} ) {
    if ( ! config.text && ! config.title ) { return; }
    Alert.alert(
      config.title || '',
      config.text  || '',
      config.option
    );
  }
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
  },
  'popupWrapper': {
    'flex': 1,
    'position': 'absolute',
    'left': 0,
    'top': 0,
    'right': 0,
    'bottom': 0,
    ...Theme.debug
  },
  'popupContent': {
    'flex': 1,
  },
});