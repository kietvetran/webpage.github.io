import React, {PureComponent} from 'react';
import { StyleSheet, Text, View, Alert, Animated, Dimensions } from 'react-native';

import FormInput from '../form/FormInput';
import { Theme }  from '../style/Theme.js';

const { width } = Dimensions.get('window');

export default class FormCodeField extends PureComponent {
  static defaultProps = {
    'field': null
  };

  constructor(props) {
    super(props);
    this.state = {
      'size' : typeof(props.size) === 'number' ? (props.size || 4) : 4,
      'list' : Array.apply('', Array((props.size || 4))),
      'value': '',
      'focus': 0
    };

    this._change = this._change.bind(this);
    this._finish = this._finish.bind(this);
  }

  render() {
    const {title, text, desciption}  = this.props;
    const {list, size, focus, value} = this.state; 

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          { !! title && <Text style={styles.title}>{title}</Text> }
          { !! text && <Text style={styles.text}>{text}</Text> }
          { !! desciption && <Text style={styles.desciption}>{desciption}</Text> }

          <FormInput keyboardType="number-pad" autoFocus={true} maxLength={size} value={value}
            styleConfig={{'container': styles.fieldWrapper}}            
            onChangeText={(e)=>{this._change(e,'change-field');}}
          />
        </View>
        <View style={styles.body}>
          { (list || []).map( (v,i) => (
              <View key={'code-box-'+i} style={[
                styles.codeBox,
                (focus === i ? styles.codeBoxFocus : {})
              ]}>{v ? <View style={styles.codeBoxStar} /> : null}</View>
          ) )}
        </View>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _change( e, key ) {
    let {size} = this.state, list = [], focus = -1;
    let splited = e.split('').filter( (v) => !! v );
    for ( let i=0; i<this.state.size; i++ ) {
      list[i] = splited[i] || '';
      if ( focus === -1 && ! list[i] ) {
        focus = i;
      }
    }

    this.setState({'list': list, 'value': e, 'focus': (focus === -1 ? 0 : focus)});
    if ( splited.length >= size ) {
      this._finish( splited.join('') );
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _finish( code ){
    if ( ! code || typeof(this.props.callback) !== 'function' ) { return; }
    this.props.callback({
      'action': 'finish',
      'code': code
    });
  }
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
  },
  'header': {
    'position': 'relative',
    'paddingTop': 20,
    'paddingLeft': 10,
    'paddingLeft': 10,
  },
  'body': {
    'flex': 1,
    'flexDirection': 'row',
    'alignItems': 'stretch',
    'justifyContent': 'center',
    'position': 'relative',
    'paddingTop': 20,
    'paddingLeft': 10,
    'paddingLeft': 10,
  },
  'title': {
    ...Theme.font.h1,
    'textAlign': 'center'
  },
  'text': {
    ...Theme.font.basic,
    'textAlign': 'center'
  },
  'description': {
    ...Theme.font.small,
    'textAlign': 'center'
  },
  'fieldWrapper': {
    'position': 'absolute',
    'left': 0,
    'top': 0,
    'zIndex': 1,
    'opacity': 0
  },
  'codeBox': {
    'position': 'relative',
    'width': 40,
    'height': 40,
    'margin': 5,
    ...Theme.border.basic,
    'borderWidth': 1,
    'backgroundColor': '#fff'
  },
  'codeBoxFocus': {
    'borderWidth': 2,  
    'borderColor': Theme.color.focus,
  },
  'codeBoxStar': {
    'width': 20,
    'height': 20,
    'position': 'absolute',
    'top': '50%',
    'left': '50%',
    'marginLeft': -10, 
    'marginTop': -10,
    'backgroundColor': 'rgba(0,0,0,.8)',
    'borderRadius': 20
  }
});