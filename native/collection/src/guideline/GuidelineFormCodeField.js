import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';

import FormCodeField from '../common/form/FormCodeField';
import { Theme }  from '../common/style/Theme.js';

export default class GuidelineFormCodeField extends React.Component {
  constructor(props) {
    super(props);
    this._finish = this._finish.bind(this);
  } 

  render() {
    return (
      <View style={styles.container}>
        <FormCodeField size={4} callback={this._finish} 
          title="Code field"
          text="abc lorem ipsum"
        />
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _finish(config={}) {
    //console.log('== DONE ==='); console.log( config );
    Alert.alert(
      config.code || '',
      config.option
    );
  }
}

const styles = StyleSheet.create({
  'container': {
    'position': 'relative',
    'flex': 1
  }
});