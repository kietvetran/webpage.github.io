import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FormInput from '../common/form/FormInput';

import Wizard from '../common/wizard/Wizard';
import { Theme }  from '../common/style/Theme.js';

export default class GuidelineWizard extends React.Component {
  constructor(props) {
    super(props);
  } 

  render() {
    return (
      <View style={styles.container} >
        <Wizard values={{'name': '', 'email': '', 'phone': ''}}>
          <Wizard.Step name="name">
            { ({onChange, values}) => (
                <View>
                  <FormInput labelConfig={{'text': 'Name', 'style': styles.labelField}} 
                    value={values.name}
                    onChangeText={(e)=>{onChange('name', e)}}
                  />
                </View>                
            )}
          </Wizard.Step>
          <Wizard.Step name="email">
            { ({onChange, values}) => (
                <View>
                  <FormInput labelConfig={{'text': 'Email', 'style': styles.labelField}} 
                    value={values.email}
                    onChangeText={(e)=>{onChange('email', e)}}
                  />
                </View>                
            )}
          </Wizard.Step>
          <Wizard.Step name="phone">
            { ({onChange, values}) => (
                <View>
                  <FormInput labelConfig={{'text': 'Phone', 'style': styles.labelField}} 
                    value={values.phone}
                    onChangeText={(e)=>{onChange('phone', e)}}
                  />
                </View>                
            )}
          </Wizard.Step>
        </Wizard>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'flexDirection': 'column'
  },
  'labelField': {
    'textAlign': 'center'
  }
});