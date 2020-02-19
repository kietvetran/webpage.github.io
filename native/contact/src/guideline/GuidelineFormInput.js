import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import FormInput from '../common/form/FormInput';
import {formatPhone, formatAmount} from '../util/ValueFormat';
import {validatePhone, validateAmount} from '../util/ValueValidation';

import { Theme }  from '../common/style/Theme.js';

export default class GuidelineFormInput extends React.Component {
  constructor(props) {
    super(props);
    this.state   = {
      'phone'  : {'value': formatPhone('41474947','no'), 'error': ''},
      'amount' : {'value': formatAmount('5556525'), 'error': ''},
      'comment': {'value': '', 'error': ''},
      'agreed' : {'value': true, 'error': ''},   
      'picker' : {
        'selected': 'c',
        'list': [
          {'id': 'a', 'name': 'Alfa'},
          {'id': 'b', 'name': 'Beta'},
          {'id': 'c', 'name': 'Gamma'}
        ]
      }
    };
    this._click  = this._click.bind(this);
    this._focus  = this._focus.bind(this);
    this._change = this._change.bind(this);
    this._blur   = this._blur.bind(this);
  } 

  render() {
    const {phone, amount, comment, agreed, picker} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.collection}>
            <FormInput labelConfig={{'text': 'Name',  'style': styles.labelField}} styleConfig={{'container': styles.spacing}}/>
            <FormInput labelConfig={{'text': 'phone', 'style': styles.labelField}} styleConfig={{'container': styles.spacing}}
              //keyboardType="number-pad"
              value={phone.value} error={phone.error}
              onChangeText={(e)=>{this._change(e,'change-phone-text');}}
              onBlur={(e)=>{this._blur(e,'blur-phone');}}
            />
            <FormInput labelConfig={{'text': 'Amount', 'style': styles.labelField}} styleConfig={{'container': styles.spacing}}
              //keyboardType="number-pad"
              value={amount.value} error={amount.error}
              onFocus={(e)=>{this._focus(e,'focus-amount');}}
              onBlur={(e)=>{this._blur(e,'blur-amount');}}
              onChangeText={(e)=>{this._change(e,'change-amount-text','amount');}}
            />
          </View>

          <View style={styles.collection}>
            <FormInput labelConfig={{'text': 'Comment', 'style': styles.labelField}} styleConfig={{'container': styles.spacing}}
              type="textarea" value={comment.value} error={comment.error}
              onFocus={(e)=>{this._focus(e,'focus-comment');}}
              onBlur={(e)=>{this._blur(e,'blur-comment');}}
              onChangeText={(e)=>{this._change(e,'change-comment-text','comment');}}
            />
          </View>

          <View style={styles.collection}>
            <FormInput labelConfig={{'text': 'Selector', 'style': styles.labelField}} styleConfig={{'container': styles.spacing}}
              type="selector" list={picker.list} selectedValue={picker.selected}
              onValueChange={(e)=>{this._change(e,'change-picker')}}
            />
          </View>

          <View style={styles.collection}>
            <FormInput labelConfig={{
                'text': 'Agreement',
                'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et urna a lorem semper efficitur vitae vel purus.',
                'checkboxLabel': 'Yes, I agree...',
                'onPress': ()=>{ this._click(null, 'toggle-agreed')}
              }}
              styleConfig={{'container': styles.spacing}}
              type="checkbox" value={agreed.value} error={agreed.error}
              onChange={(e)=>{this._change(e,'change-agreed');}}
            />
          </View>

        </ScrollView>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key) {
    if ( key === 'toggle-agreed' ) {
      this.setState({'agreed': {...this.state.agreed, 'value': ! this.state.agreed.value}})
    }
  }

  _change(e, key, field) {    
    if ( key === 'change-phone-text' ) {
      let note = JSON.parse(JSON.stringify(this.state.phone));
      note.value = formatPhone(e,'no');
      this.setState({'phone': note});
    } else if ( field && this.state[field] ) {
      let note = JSON.parse(JSON.stringify(this.state[field]));
      note.value = e;
      this.setState({[field]: note});
    } else if ( key === 'change-picker' ) {
      this.setState({'picker': {...this.state.picker, 'selected': e}});
    } else if ( key === 'change-agreed' ) {
      this.setState({'agreed': {...this.state.agreed, 'value': ! this.state.agreed.value}})
    }
  }

  _focus(e, key) {
    if ( key === 'focus-amount' ) {
      let note = JSON.parse(JSON.stringify(this.state.amount));
      note.value = note.value.replace(/\s+/g,'');
      this.setState({'amount': note});
    }
  }

  _blur(e, key) {
    if ( key === 'blur-phone' ) {
      let note = JSON.parse(JSON.stringify(this.state.phone));
      note.error = validatePhone( note.value ) ? '' : 'Invalid phone';
      if ( note.error ) {
        this._alert({'text': note.error});
      }
      this.setState({'phone': note});
    } else if ( key === 'blur-amount' ) {
      let note = JSON.parse(JSON.stringify(this.state.amount));
      note.error = validateAmount( note.value ) ? '' :  'Invalid amount';
      if ( note.error ) {
        this._alert({'text': note.error});
      } else {
        note.value = formatAmount(note.value);
      }
      this.setState({'amount': note});
    } 
  }

  _alert( config={} ) {
    if ( ! config.text && ! config.title ) { return; }

    Alert.alert(
      config.title || '',
      config.text  || '',
      config.option
    );
  }
}

const styles = StyleSheet.create({
  'container': {
    'position': 'relative',
  },
  'contentContainer': {
    'paddingTop': 10,
    'paddingBottom': 10
  },
  'collection': {
    'marginBottom': Theme.space.medium,
    'backgroundColor': '#fff',
    'padding': Theme.space.medium,
    ...Theme.shadow.level1
  },
  'collectionTitle': {
    ...Theme.font.h2,
    'paddingTop': Theme.space.small,
    'paddingBottom': Theme.space.small
  },
  'labelField': {
  },
  'spacing': {
    'paddingBottom': Theme.space.medium
  }
});