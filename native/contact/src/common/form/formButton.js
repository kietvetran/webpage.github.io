import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ImageBackground, View } from 'react-native';
import { Theme }  from '../style/Theme.js';

export default function FormButton({
  title       = '',
  type        = '',
  mode        = '',
  disabled    = false,
  onPress     = ()=>{},
  styleConfig = {}, 
  iconConfig  = {
   'filter': {
      'basic': require('../../../assets/icon/filter/filter.svg')
    },
   'phone': {
      'basic': require('../../../assets/icon/phone/phone.svg')
    },
   'sms': {
      'basic': require('../../../assets/icon/sms/sms.svg')
    },
   'email': {
      'basic': require('../../../assets/icon/at/at.svg')
    },
   'search': {
      'basic': require('../../../assets/icon/search/search.svg')
    }
  }
}) {
  return <TouchableOpacity onPress={()=>{onPress()}}>
  { iconConfig[type] ? <View style={[styles.icon, styleConfig.icon || {}]}>
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