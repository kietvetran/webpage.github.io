import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, Text, View, TextInput, Picker } from 'react-native';
import FormButton from './FormButton';
import { Theme }  from '../style/Theme.js';
import Image from 'react-native-remote-svg';

export const Field = ({icon, styleConfig, iconConfig, error, ...rest})=> {
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
            { !! iconConfig[icon.type] && <Image style={styles.image} source={iconConfig[icon.type].basic}/> }
          </View>
        }
      </View> 
    }
  </View>
};

export const Selector = ({list = [], styleConfig, error, ...rest}) => {
  return <View style={[styles.container, styleConfig.container, styles.textfield, (error ? styles.texterror : {})]}>
    <Picker style={[styles.selector, styleConfig.selector, (error ? styles.texterror : {})]} {...rest}>
      {list.map( (data,i) => (
        <Picker.Item key={'form-picker-'+i} label={data.name || data.label || data.id} value={data.id || data.value} />
      ) )}
    </Picker>
  </View>
};

export default function FormInput({
  icon        = {'type': '', 'position': 'start', 'onPress': null, 'actionKey': ''},
  error       = '',
  type        = 'field',
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
      {type === 'field' && <Field icon={icon} styleConfig={{...styleConfig, 'container': null}} iconConfig={iconConfig} error={error} {...rest} />}
      {type === 'selector' && <Selector styleConfig={{...styleConfig, 'container': null}} {...rest}/>}
    </View> : <React.Fragment>
      {type === 'field' && <Field icon={icon} styleConfig={styleConfig} iconConfig={iconConfig} error={error} {...rest} />}
      {type === 'selector' && <Selector styleConfig={{...styleConfig, 'container': null}} {...rest}/>}
    </React.Fragment>
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
    'flex': 1,
    'width': '100%',
    'height': '100%'
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
  'selector': {
    ...Theme.inputText,
    'width': 'auto',
    'borderWidth': 0
  },
  'searchFieldStartSpace': {
    'paddingLeft': (Theme.buttonIcon.width + 5)
  },
  'searchFieldEndSpace': {
    'paddingRight': (Theme.buttonIcon.width + 5)
  }
});