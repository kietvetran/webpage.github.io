import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ImageBackground, View } from 'react-native';
import { Theme }  from '../style/theme.js';

export default function FormButton({
  title      = '',
  type       = '',
  mode       = '',
  disabled   = false,
  onPress    = ()=>{},
  iconConfig = {
   'filter': {
      'basic': require('../../../assets/icon/filter/filter.svg')
    },
   'search': {
      'basic': require('../../../assets/icon/search/search.svg')
    }
  }
}) {
  return <TouchableOpacity onPress={()=>{onPress()}}>
  { iconConfig[type] ? <View style={styles.icon}>
    <ImageBackground style={styles.image} source={iconConfig[type].basic}/>
    </View> : <Text style={styles[type] || styles.basic}>{title}</Text>
  }
  </TouchableOpacity>
};

const styles = StyleSheet.create({
  'basic': {
    ...Theme.button
  },
  'icon': {
    ...Theme.buttonIcon
  },
  'primary': {
    ...Theme.button,
    'backgroundColor': Theme.color.primary  
  },
  'secondary': {
    ...Theme.button,
    'backgroundColor': Theme.color.secondary
  },
  'image': {
    'flex': 1
  }
});