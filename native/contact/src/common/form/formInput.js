import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ImageBackground, View, TextInput } from 'react-native';
import FormButton from './FormButton';
import { Theme }  from '../style/Theme.js';

export const Field = ({icon, styleConfig, iconConfig, error='', ...rest})=> {
  return <View style={[styles.container, styleConfig.container]}>
    <TextInput {...rest} style={[
      styles.textfield,
      styleConfig.field,
      (icon.type ? (icon.position === 'start' ? styles.searchFieldStartSpace : styles.searchFieldEndSpace) : {}),
      (error ? styles.texterror : {})
    ]}/>
    { !! icon.type && <View style={icon.position === 'start' ? styles.iconStart : styles.iconEnd}>
        { icon.onPress ? <FormButton type={icon.type} onPress={()=>{icon.onPress()}} /> : 
          <View style={styles.icon}>
            { !! iconConfig[icon.type] && <ImageBackground style={styles.image} source={iconConfig[icon.type].basic}/> }
          </View>
        }
      </View> 
    }
  </View>
};

export default function FormInput({
  icon        = {'type': '', 'position': 'start', 'onPress': null, 'actionKey': ''},
  labelConfig = {'text': ''},
  styleConfig = {},
  iconConfig  = {
   'filter': {
      'basic': require('../../../assets/icon/filter/filter.svg')
    },
   'search': {
      'basic': require('../../../assets/icon/search/search.svg')
    }
  },
  ...rest
}) {
  return (
    labelConfig.text ? <View style={[styles.container, styles.inlineContainer, styleConfig.container]}>
      <Text style={[styles.textLabel, labelConfig.style]}>{labelConfig.text}</Text>
      <Field icon={icon} styleConfig={{...styleConfig, 'container': null}} iconConfig={iconConfig} {...rest} />
    </View> : <Field icon={icon} styleConfig={styleConfig} iconConfig={iconConfig} {...rest} />
  );
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'position': 'relative',
  },
  'inlineContainer': {
    'flexDirection': 'row'
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
  'textLabel': {
    ...Theme.inputLabel
  },
  'textfield': {
    ...Theme.inputText
  },
  'texterror': {
    ...Theme.inputError,
  },
  'searchFieldStartSpace': {
    'paddingLeft': (Theme.buttonIcon.width + 5)
  },
  'searchFieldEndSpace': {
    'paddingRight': (Theme.buttonIcon.width + 5)
  }
});