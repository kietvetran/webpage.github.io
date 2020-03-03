import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import FormButton from '../common/form/FormButton';
import { Theme }  from '../common/style/Theme.js';

export default function PersonWidget({ data, actionList=[], onPress=()=>{}}) {
  return data ? <View style={styles.container}>
    {actionList.map( (note, i)=> (
      <FormButton key={'person-widget-btn-'+i} title={note.title} type="secondary"
        styleConfig={{}}
        onPress={()=>{onPress(null,note.action,data)}}
      />
    ))}
  </View> : null;
};

const styles = StyleSheet.create({
  'container': {
    'position': 'relative',
    'backgroundColor': '#fff',
    ...Theme.shadow.level2
  }
});