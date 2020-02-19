import React from 'react';
import { StyleSheet, Text, ImageBackground, View, Animated } from 'react-native';

import FormButton from '../form/FormButton';
import { Theme }  from '../style/Theme.js';

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      ...this._initState( props ),
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
                <FormButton title={title[i]}
                  type={hide[i] ? 'arrowDown' : 'arrowUp'}
                  onPress={(e)=>{this._click(e,'toggle-panel', i)}}
                  styleConfig={{'button': (single ? {} : (hide[i] ? styles.multipleOnOpen : styles.multipleOnHide)),}}
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
    'borderLeftColor': Theme.color.border
  },
  'multipleOnHide': {
    'opacity': .3,
  },
  'multipleOnOpen': {
    'opacity': 1,
  },
  'content': {
    'flex': 1,
    'overflow': 'hidden',
    'padding': 8,
    'borderTopWidth': 1,
    'borderTopColor': Theme.color.border
  }
});