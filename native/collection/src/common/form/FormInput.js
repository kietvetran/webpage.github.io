import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, Text, View, TextInput, Picker, CheckBox, Image } from 'react-native';
import FormButton from './FormButton';
import { Theme }  from '../style/Theme.js';

export const Field = ({icon, styleConfig, iconConfig, error, inputRef, access, ...rest})=> {
  return <View style={[styles.container, styleConfig.container]}>
    <TextInput {...rest} {...access} ref={inputRef} style={[
      styles.textfield,
      styleConfig.field,
      (icon.type ? (icon.position === 'start' ? styles.searchFieldStartSpace : styles.searchFieldEndSpace) : {}),
      (error ? styles.textError : {}),
      (rest.editable === false ? styles.textDisabled : {})
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

export const Selector = ({list = [], styleConfig, error, inputRef, access, ...rest}) => {
  return <View style={[styles.selectorContainer, styleConfig.container, (error ? styles.textError : {})]}>
    <Picker {...access} style={[styles.selector, styleConfig.selector, (error ? styles.textError : {})]} {...rest}>
      {list.map( (data,i) => (
        <Picker.Item key={'form-picker-'+i} label={data.name || data.label || data.id} value={data.id || data.value} />
      ) )}
    </Picker>
  </View>
};

export const Check = ({labelConfig, styleConfig, inputRef, access, ...rest}) => {
  return <View style={[styles.container, styles.checkboxContainer, styleConfig.container, styles.inlineContainer]}>
    <CheckBox  {...access} {...rest}/>
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
  accessibility ={},
  iconConfig  = {
   'filter': {
      'basic': require('../../../assets/icon/filter/filter.png')
    },
   'search': {
      'basic': require('../../../assets/icon/search/search.png')
    }
  },
  onPress,
  ...rest
}) {
  let access = {
    'accessible'        : accessibility.status === false ? false : true,
    //'accessibilityRole' : accessibility.role  || 'button',
    'accessibilityLabel': accessibility.label || labelConfig.label || '',
    'accessibilityHint' : accessibility.hint  || labelConfig.description  || '',
    //'accessibilityState': accessibility.state || ''
  };

  return (
    labelConfig.text || type === 'fieldNumbeAdjustment' ? <View style={[styles.container, styleConfig.container]}>
      { !! labelConfig.text && <Text style={[styles.textLabel, labelConfig.style]}>{labelConfig.text}</Text> }
      { !! labelConfig.description && <Text style={[styles.textLabel, styles.textDesciption]}>{labelConfig.description}</Text>}
      {type === 'field' && <Field icon={icon} styleConfig={{...styleConfig, 'container': null}} iconConfig={iconConfig} error={error} {...rest} access={access}/>}
      {type === 'textarea' && <Field icon={icon} styleConfig={{...styleConfig, 'container': null, 'field': {...styleConfig.field, ...styles.textarea}}} iconConfig={iconConfig} error={error} multiline={true} numberOfLines={lineNumber} {...rest} access={access}/>}
      {type === 'selector' && <Selector styleConfig={{...styleConfig, 'container': null}} {...rest} access={access}/>}
      {type === 'checkbox' && <Check styleConfig={{...styleConfig, 'container': null}} labelConfig={labelConfig} {...rest} access={access}/>}
      {type === 'fieldNumbeAdjustment' && <View style={styles.fieldNumbeAdjustmentWrapper}>
          <View style={styles.fieldNumbeAdjustmentLeft}>
            <FormButton type="minus" styleConfig={{'icon': {'padding': 14}, ...styleConfig, 'container': null}} onPress={()=>{ if ( typeof(onPress) === 'function' ) { onPress(-1); } }} />
          </View>
          <View style={styles.fieldNumbeAdjustmentCenter}>
            <Field icon={icon} styleConfig={{...styleConfig, 'container': null}} iconConfig={iconConfig} error={error} {...rest} access={access} />
          </View>
          <View style={styles.fieldNumbeAdjustmentRight}>
            <FormButton type="plus" styleConfig={{'icon': {'padding': 14}, ...styleConfig, 'container': null}} onPress={()=>{ if ( typeof(onPress) === 'function' ) { onPress(1); } }} />
          </View>
        </View>
      }
      { !! error && <Text accessibilityLiveRegion="polite" style={[styles.textError, styles.textErrorSpace]}>{error}</Text> }
    </View> : <React.Fragment>
      {type === 'field' && <Field icon={icon} styleConfig={styleConfig} iconConfig={iconConfig} error={error} {...rest} access={access}/>}
      {type === 'textarea' && <Field icon={icon} styleConfig={{...styleConfig, 'container': null, 'field': {...styleConfig.field, ...styles.textarea}}} iconConfig={iconConfig} error={error} multiline={true} numberOfLines={lineNumber} {...rest} access={access}/>}
      {type === 'selector' && <Selector styleConfig={{...styleConfig, 'container': null}} {...rest} access={access}/>}
      {type === 'checkbox' && <Check styleConfig={{...styleConfig, 'container': null}} labelConfig={labelConfig} {...rest} access={access}/>}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  'container': {
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
    ...Theme.inputText,
    'backgroundColor': '#fff'
  },
  'textError': {
    ...Theme.inputError,
  },
  'textDisabled': {
    'backgroundColor': '#eee'
  },
  'textErrorSpace': {
    'marginTop': 5,
    'padding': 5
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
  },


  'fieldNumbeAdjustmentWrapper': {
    'flex': 1,
    'flexDirection': 'row',
    'alignItems': 'stretch',
    'justifyContent': 'center',
  },
  'fieldNumbeAdjustmentWrapperLeft': {
  },
  'fieldNumbeAdjustmentWrapperCenter': {
    'flex': 1
  },
  'fieldNumbeAdjustmentWrapperRight': {
  },
});