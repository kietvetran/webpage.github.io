import React, {PureComponent} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import FormButton from '../common/form/FormButton';
import FormInput from '../common/form/FormInput';

import {formatPhone, formatAmount} from '../util/ValueFormat';
import {validatePhone, validateAmount, validateValueOfType} from '../util/ValueValidation';

import { Theme }  from '../common/style/Theme.js';

export default class ProfileField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'data': ((props.route || {}).params || {}).data || {},
      'dataList': ((props.route || {}).params || {}).dataList || [],
      'back': ((props.route || {}).params || {}).back || 'desktop'
    };

    if ( this.state.data.value && this.state.data.format ){
      this.state.data.value = this._format(this.state.data);
    }

    this._click  = this._click.bind(this);
    this._focus  = this._focus.bind(this);
    this._change = this._change.bind(this);
    this._blur   = this._blur.bind(this);
  } 

  render () {
    const {data} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.containerBody}>
          <FormInput labelConfig={{'text': data.label || data.title, 'description': data.description}}
            //keyboardType="number-pad"
            value={data.value} error={data.error}
            onFocus={(e)=>{this._focus(e,'focus-field');}}
            onBlur={(e)=>{this._blur(e,'blur-field');}}
            onChangeText={(e)=>{this._change(e,'change-field');}}
          />
        </View>
        <View style={styles.containerFooter}>
          <FormButton type="primary" title="Save" styleConfig={{'container': styles.actionButton}}
            onPress={()=>{this._click(null,'save')}}
          />
          <FormButton type="plain" title="Cancel" styleConfig={{'container': styles.actionButton}}
            onPress={()=>{this._click(null,'cancel')}}
          />
        </View>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key) {
    let {dataList, back, data} = this.state;

    if ( key === 'save') {
      let error = data.error || this._validate( data );

      if ( error ) {
        data.error = error;
        this.setState({'data': data});

        this._alert({
          'text': 'Please correct the error'
        });
      } else {
        dataList.forEach( (d) => {
          delete( d.error );
          if ( d.name === data.name ) { d.value = data.value; }
        });
        this.props.navigation.navigate( back, {'dataList': dataList});
      }
    } else if ( key === 'cancel') {
      this.props.navigation.navigate( back, {'dataList': dataList});      
    }
  }

  _change(e, key) {
    let data = {...this.state.data, 'value': e};

    if ( data.error ) {
      data.error = this._validate( data );
    }

    if ( data.format === 'phone' ) {
      data.value = this._format(data);
    }

    this.setState({'data': data});
  }

  _focus(e, key) {
    let data = {...this.state.data};
    if ( data.format === 'amount' ) {
      data.value = data.value.replace(/\s+/g,'');
      this.setState({'data': data});
    }
  }

  _blur(e, key) {
    let data = {...this.state.data};
    data.error = this._validate( data );

    if ( data.format && ! data.error ) {
      data.value = this._format( data );
    }

    if ( this.state.data.value !== data.value || this.state.data.error !== data.error) {
      this.setState({'data': data});
    }
  }

  _format( data ) {
    let {format, value} = data || this.state.data;

    if ( format === 'phone' ) {
      return formatPhone( value, 'no' );
    } else if ( format === 'amount' ) {
      return formatAmount( value );
    }
    return value || '';
  }

  _validate( data ) {
    let value = (((data || this.state.data).value || '')+'').trim();
    let error = ((data || this.state.data).validation || []).find( (note) => {
      if ( note.rule === 'required' ) {
        return ! value;
      } else if ( note.regex ) {
        return value && value.match(note.regex);
      } else if ( note.rule === 'phone' ) {
        return value && ! validatePhone( value );
      } else if ( note.rule === 'amount' ) {
        return value && ! validateAmount( value );
      } else if ( note.rule ) {
        return value && ! validateValueOfType( value, note.rule );
      }
      return false;
    });

    return error ? (error.text || error.message || 'Invalid') : '';
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
    'paddingLeft': 10,
    'paddingRight': 10,
    'paddingTop': 10,
  },
  'containerBody': {
    'flex': 1,
    'alignItems': 'stretch'
 },
  'containerFooter': {
  },
  'actionButton': {
    'marginTop': 5,
    'marginBottom': 5,
  }
});