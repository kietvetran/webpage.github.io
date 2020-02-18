import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Message from '../common/message/Message';
import FormInput from '../common/form/FormInput';
import Panel from '../common/panel/Panel';
import {formatPhone, formatAmount} from '../util/ValueFormat';
import {validatePhone, validateAmount} from '../util/ValueValidation';

import { Theme }  from '../common/style/Theme.js';

export default class Guideline extends React.Component {
  constructor(props) {
    super(props);
    this.state   = {
      'phone' : {'value': formatPhone('41474947','no'), 'error': ''},
      'amount': {'value': formatAmount('5556525'), 'error': ''}
    };
    this._click  = this._click.bind(this);
    this._focus  = this._focus.bind(this);
    this._change = this._change.bind(this);
    this._blur   = this._blur.bind(this);
  } 

  render() {
    const {phone, amount, person} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Guideline</Text>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.collection}>
            <Text style={styles.collectionTitle}>FormInput</Text>
            <FormInput labelConfig={{'text': 'Name',  'style': styles.labelFiel}} styleConfig={{'container': styles.inputSpacing}}/>
            <FormInput labelConfig={{'text': 'phone', 'style': styles.labelFiel}} styleConfig={{'container': styles.inputSpacing}}
              //keyboardType="number-pad"
              value={phone.value} error={phone.error}
              onChangeText={(e)=>{this._change(e,'change-phone-text');}}
              onBlur={(e)=>{this._blur(e,'blur-phone');}}
            />
            <FormInput labelConfig={{'text': 'Amount', 'style': styles.labelFiel}} styleConfig={{'container': styles.inputSpacing}}
              //keyboardType="number-pad"
              value={amount.value} error={amount.error}
              onFocus={(e)=>{this._focus(e,'focus-amount');}}
              onBlur={(e)=>{this._blur(e,'blur-amount');}}
              onChangeText={(e)=>{this._change(e,'change-amount-text','amount');}}
            />
          </View>
          <View style={styles.collection}>
            <Text style={styles.collectionTitle}>Panel</Text>
            <Panel title="Lorem ipsum"  styleConfig={{'container': styles.inputSpacing}}>
              <Text>
                First paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus arcu velit, pulvinar sed imperdiet id,
                cursus eget lorem. Morbi magna enim, euismod sit amet arcu vel, maximus tristique diam. 
              </Text>
              <Text>
                Second paragraph:
              </Text>
            </Panel>

            <Panel title={['Lopem ipsum', 'Animal']}  styleConfig={{'container': styles.inputSpacing}}>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus arcu velit, pulvinar sed imperdiet id,
                cursus eget lorem. Morbi magna enim, euismod sit amet arcu vel, maximus tristique diam. Suspendisse potenti.
                Nam nisi ex, suscipit ut sodales et, facilisis at orci. Nam rhoncus nisi id dapibus hendrerit. Nulla et neque orci
              </Text>
              <Text>
                Dog, cat, mouse, bat
              </Text>
            </Panel>

          </View>
          
          <View style={styles.collection}>
            <Text style={styles.collectionTitle}>Message</Text>
            <Message type="info" text="Info text" title="Info title"/>
            <Message type="warning" text="Warning text" title="Warning title"/>
            <Message type="error" text="Error text" title="Error title"/>
            <Message type="empty" text="Empty text" title="Empty title"/>
          </View>
        </ScrollView>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key) {}

  _change(e, key, field) {    
    if ( key === 'change-phone-text' ) {
      let note = JSON.parse(JSON.stringify(this.state.phone));
      note.value = formatPhone(e,'no');
      this.setState({'phone': note});
    } else if ( field && this.state[field] ) {
      let note = JSON.parse(JSON.stringify(this.state[field]));
      note.value = e;
      this.setState({[field]: note});
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
    'flex': 1,
    'position': 'relative',
  },
  'header': {
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'right': 0,
    'zIndex': 1,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    'backgroundColor': Theme.color.headerBg,
    ...Theme.shadow.level1,
    'paddingTop': 10,
    'paddingBottom': 10
   },
  'headerTitle': {
    ...Theme.font.h1,
  },
  'contentContainer': {
    'paddingTop': (Theme.space.header + Theme.space.headerGap + 20)
  },
  'collection': {
    'marginBottom': Theme.space.medium,
    'backgroundColor': '#fff'
  },
  'collectionTitle': {
    ...Theme.font.h2,
    'paddingTop': Theme.space.small,
    'paddingBottom': Theme.space.small
  },
  'labelFiel': {
    'width': 70
  },
  'inputSpacing': {
    'marginBottom': Theme.space.medium,      
    'paddingRight': 10
  },
  'debug': {
    ...Theme.debug
  }
});