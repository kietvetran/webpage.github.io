import React from 'react';
import { StyleSheet, Text, View, Animated, Alert, TouchableHighlight , Dimensions } from 'react-native';

import FormButton from '../form/FormButton';
import { Theme }  from '../style/Theme.js';

const { width, height } = Dimensions.get('window');

class PopupButton extends React.PureComponent {
  render() {
    return <FormButton type="more" {...this.props} />
  }
};

class PopupWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state  = {
      ...this._initState( props ),
      'animation': new Animated.Value(0),
      'animationConfig': {'duration': 80, 'delay': 0}
    };
    this._click = this._click.bind(this);
    this._toggleView = this._toggleView.bind(this);
  }

  render() {
    const {styleConfig={}} = this.props;
    const {size, children, display, animation} = this.state;

    return ( children ? <TouchableHighlight style={styles.popupWidget} onPress={()=>{this._click(null, 'hide')}}>
        <Animated.View style={[styles.widgetContent, styleConfig.widgetContent || {}, display || {}, {'height': animation}]}>
          {children}
        </Animated.View>
      </TouchableHighlight> : null
    );        
  }

  componentDidUpdate(prevProps, prevState) {
    let {animationConfig, animation, size} = this.state;
    if ( ! prevState.children && this.state.children ) {
      Animated.timing( animation, {
        ...animationConfig,
        'toValue': size[1] || 100
      }).start(); 
    } else if ( prevState.children && ! this.state.children ) {
      Animated.timing( animation, {
        ...animationConfig, 'duration': 1,'toValue': 0
      }).start();
    }
  }

  /****************************************************************************
  ****************************************************************************/
  show( config={} ) {
    this._toggleView( config );
  }

  hide() {
    this._toggleView();
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {
    if ( key === 'hide' ) {
      this._toggleView();
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _toggleView( config={} ) {
    let state = {
      ...config,
      'direction': ['right', 'down'],
      'children': config.children || null
    };

    let size = state.size || this.state.size || [100,100];
    if ( state.children && state.position ) {
      state.display = {'left':'auto', 'right':'auto', 'top':'auto', 'bottom':'auto'};
      if ( (state.position.x + size[0]) > width ) {
        state.display.right = width - state.position.x;
        state.direction[0] = 'left';
      } else {
        state.display.left = state.position.x; 
      }

      if ( (state.position.y + size[1]) > height ) {
        state.display.bottom = height - state.position.y;
        state.direction[1] = 'up';
      } else {
        state.display.top = state.position.y; 
      }
    }

    this.setState( state );
  }

  _initState( props ) {
    let size = [100,100], state = {
      'size': props.size || size,
      'show': props.show === true
    };
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

export default class Popup extends React.PureComponent {
  static Button = ({buttonRef, ...rest}) => <PopupButton ref={buttonRef} {...rest}/>;
  static Widget = ({widgetRef, ...rest}) => <PopupWidget ref={widgetRef} {...rest}/>;

  render() {
    return null;
  }
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
  },
  'popupWidget': {
    'flex': 1,
    'position': 'absolute',
    'left': 0,
    'top': 0,
    'right': 0,
    'bottom': 0,
    'zIndex': 5,
    'backgroundColor': 'rgba(255,255,255,0)'
  },
  'widgetContent': {
    'flex': 1,
    'position': 'absolute',
    'left': 100,
    'top': 100,
    'zIndex': 5,
    'padding': 5,
    'overflow': 'hidden',
    'backgroundColor': 'rgba(255,255,255,0)'
  },
});