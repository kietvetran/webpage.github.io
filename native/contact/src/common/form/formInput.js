import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ImageBackground, View, TextInput } from 'react-native';
import FormButton from './FormButton';
import { Theme }  from '../style/Theme.js';

export default function FormInput({
  style      = {},
  icon       = {'type': '', 'position': 'start', 'onPress': null, 'actionKey': ''},
  actionKey  = '',
  onChange   = ()=>{},
  iconConfig = {
   'filter': {
      'basic': require('../../../assets/icon/filter/filter.svg')
    },
   'search': {
      'basic': require('../../../assets/icon/search/search.svg')
    }
  },
  ...rest
}) {

  return <View style={styles.container}>
    <TextInput style={[styles.textfield, style, (icon.type ? (icon.position === 'start' ? styles.searchFieldStartSpace : styles.searchFieldEndSpace) : {})]}
      {...rest} onChange={(e)=>{onChange(e, actionKey)}}
    />
    { !! icon.type && <View style={icon.position === 'start' ? styles.iconStart : styles.iconEnd}>
        { icon.onPress ? <FormButton type={icon.type} onPress={(e)=>{icon.onPress(null, icon.actionKey)}} /> : 
          <View style={styles.icon}>
            { !! iconConfig[icon.type] && <ImageBackground style={styles.image} source={iconConfig[icon.type].basic}/> }
          </View>
        }
      </View> 
    }
  </View>
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'position': 'relative',
  },
  'icon': {
    ...Theme.buttonIcon
  },
  'image': {
    'flex': 1
  },
  'iconStart': {
    'position': 'absolute',
    'left': 0,
    'top': 0
  },
  'iconEnd': {
    'position': 'absolute',
    'right': 0,
    'top': 0
  },
  'textfield': {
    'paddingLeft': 5,
    'paddingRight': 5,
    'borderWidth': 1,
    'borderColor': Theme.color.border
  },
  'searchFieldStartSpace': {
    'paddingLeft': (Theme.buttonIcon.width + 5)
  },
  'searchFieldEndSpace': {
    'paddingRight': (Theme.buttonIcon.width + 5)
  }
});