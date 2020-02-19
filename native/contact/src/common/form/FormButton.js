import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
//import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Theme }  from '../style/Theme.js';
import Image from 'react-native-remote-svg';

export default function FormButton({
  title       = '',
  label       = '',
  children    = null,
  type        = '',
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
    },
    'brand': {
      'basic': require('../../../assets/icon/hexagon/hexagon.svg')
    },
    'arrowLeft': {
      'basic': require('../../../assets/icon/arrow/arrow-left.svg')
    },
    'arrowRight': {
      'basic': require('../../../assets/icon/arrow/arrow-right.svg')
    },
    'arrowDown': {
      'basic': require('../../../assets/icon/arrow/arrow-down.svg')
    },
    'arrowUp': {
      'basic': require('../../../assets/icon/arrow/arrow-up.svg')
    },
  }
}) {
  return <TouchableOpacity onPress={()=>{onPress()}} style={[styles.container, styleConfig.container]}>
  { iconConfig[type] ? <View style={[styles.icon, styleConfig.icon || {}, (title || children ? styles.iconWidthAuto : null)]}>
      { title || children ? <View style={[styles.icon, styles.toRight]}>
          <Image style={styles.image} source={iconConfig[type].basic}/>
        </View> : <Image style={styles.image} source={iconConfig[type].basic}/>
      }
      { !! label && <Text style={styles.invisibleText}>{label}</Text> }
      { !! title && <Text style={[styles.plain, styles.inLeft, styles.buttonText, styleConfig.button]}>{title}</Text>}
      { !! children && <View>{children}</View> }
    </View> : (
      title ?
        <Text style={[styles[type] || styles.basic, styles.buttonText, styleConfig.button]}>{title.toUpperCase()}</Text> :
        <View>{children}</View>
    )
  }
  </TouchableOpacity>
};

const styles = StyleSheet.create({
  'container': {
  },
  'basic': {
    ...Theme.button
  },
  'icon': {
    ...Theme.buttonIcon
  },
  'iconWidthAuto': {
    'width': 'auto',
    'paddingTop': 2,
    'paddingBottom': 0,
    'paddingRight': (Theme.buttonIcon.width + 5)
  },
  'primary': {
    ...Theme.button,
    'fontWeight': '700',
    'borderColor': Theme.color.primary,
    'backgroundColor': Theme.color.primary,
    'paddingTop': 10,
    'paddingBottom': 10,
  },
  'secondary': {
    ...Theme.button,
    'fontWeight': '700',
    'borderColor': Theme.color.secondary,
    'backgroundColor': Theme.color.secondary,
    'paddingTop': 10,
    'paddingBottom': 10,
  },
  'plain': {
    ...Theme.button,
    'fontWeight': '700',
    'backgroundColor': '#fff',
    'color': Theme.color.font,
    'paddingTop': 10,
    'paddingBottom': 10,
  },
  'invisibleText': {
    ...Theme.invisibleText
  },
  'image': {
    'flex': 1,
    'width': '100%',
    'height': '100%'
  },
  'toRight': {
    'position': 'absolute',
    'right': 0,
    'top': 0,
    'padding': 12
  },
  'inLeft': {
    'textAlign':'left',
    'borderWidth': 0
  },
  'plainButton': {
    'borderWidth': 0,
    'textAlign': 'left',
    'backgroundColor': 'transparent',
    'color': Theme.color.font,
    'padding': 8,
    'fontWeight': '500'    
  },
  'buttonText': {
    ...Theme.buttonText
  }
});