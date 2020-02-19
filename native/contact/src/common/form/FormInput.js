import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, Text, View, TextInput, Picker, CheckBox } from 'react-native';
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
  return <View style={[styles.selectorContainer, styleConfig.container, (error ? styles.texterror : {})]}>
    <Picker style={[styles.selector, styleConfig.selector, (error ? styles.texterror : {})]} {...rest}>
      {list.map( (data,i) => (
        <Picker.Item key={'form-picker-'+i} label={data.name || data.label || data.id} value={data.id || data.value} />
      ) )}
    </Picker>
  </View>
};

export const Check = ({labelConfig, styleConfig, ...rest}) => {
  return <View style={[styles.container, styles.checkboxContainer, styleConfig.container, styles.inlineContainer]}>
    <CheckBox {...rest}/>
    { !! labelConfig.checkboxLabel && <React.Fragment>
        { typeof(labelConfig.onPress) === 'function' ? <TouchableOpacity onPress={()=>{labelConfig.onPress()}}>
            <Text style={[styles.textLabel, styles.checkboxLabel]}>{labelConfig.checkboxLabel}</Text>
          </TouchableOpacity> : <Text style={[styles.textLabel, styles.checkboxLabel]}>{labelConfig.checkboxLabel}</Text>
        }
      </React.Fragment>
    }
  </View>
};

export default function FormInput({
  icon        = {'type': '', 'position': 'start', 'onPress': null},
  error       = '',
  type        = 'field',
  lineNumber  = 4,
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
    labelConfig.text ? <View style={[styles.container, styleConfig.container]}>
      <Text style={[styles.textLabel, labelConfig.style]}>{labelConfig.text}</Text>
      { !! labelConfig.description && <Text style={[styles.textLabel, styles.textDesciption]}>{labelConfig.description}</Text>}
      {type === 'field' && <Field icon={icon} styleConfig={{...styleConfig, 'container': null}} iconConfig={iconConfig} error={error} {...rest} />}
      {type === 'textarea' && <Field icon={icon} styleConfig={{...styleConfig, 'container': null, 'field': {...styleConfig.field, ...styles.textarea}}} iconConfig={iconConfig} error={error} multiline={true} numberOfLines={lineNumber} {...rest} />}
      {type === 'selector' && <Selector styleConfig={{...styleConfig, 'container': null}} {...rest}/>}
      {type === 'checkbox' && <Check styleConfig={{...styleConfig, 'container': null}} labelConfig={labelConfig} {...rest}/>}
    </View> : <React.Fragment>
      {type === 'field' && <Field icon={icon} styleConfig={styleConfig} iconConfig={iconConfig} error={error} {...rest} />}
      {type === 'textarea' && <Field icon={icon} styleConfig={{...styleConfig, 'container': null, 'field': {...styleConfig.field, ...styles.textarea}}} iconConfig={iconConfig} error={error} multiline={true} numberOfLines={lineNumber} {...rest} />}
      {type === 'selector' && <Selector styleConfig={{...styleConfig, 'container': null}} {...rest}/>}
      {type === 'checkbox' && <Check styleConfig={{...styleConfig, 'container': null}} labelConfig={labelConfig} {...rest}/>}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'position': 'relative'
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
  'textDesciption': {
    ...Theme.inputDescription
  },
  'textLabel': {
    ...Theme.inputLabel,
    'lineHeight': (Theme.inputLabel.fontSize + 12),
  },
  'textfield': {
    ...Theme.inputText
  },
  'texterror': {
    ...Theme.inputError,
  },
  'textarea': {
    'textAlignVertical': 'top',
    'paddingTop': 5,
    'paddingBottom': 5,
  },
  'selectorContainer': {
    'borderWidth': 1,
    'borderColor': Theme.color.border,
  },
  'selector': {
    //...Theme.inputText,
    'width': 'auto',
    'minHeight': Theme.inputText.minHeight,
  },
  'checkboxContainer': {
  },
  'checkboxWrapper': {
  },
  'checkboxLabel': {
    'paddingLeft': 5,
    'paddingRight': 5
  },
  'searchFieldStartSpace': {
    'paddingLeft': (Theme.buttonIcon.width + 5)
  },
  'searchFieldEndSpace': {
    'paddingRight': (Theme.buttonIcon.width + 5)
  }
});