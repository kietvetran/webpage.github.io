import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
//import { StyleSheet, TouchableHighlight, Text, View, Image } from 'react-native';
import { Theme }  from '../style/Theme.js';

export default function FormButton({
  title       = '',
  children    = null,
  type        = '',
  value       = '',
  description = '',
  leftIcon    = '', 
  disabled    = false,
  onPress     = ()=>{},
  styleConfig = {}, 
  iconConfig  = {
    'filter'    : {'basic': require('../../../assets/icon/filter/filter.png')},
    'phone'     : {'basic': require('../../../assets/icon/phone/phone.png')},
    'sms'       : {'basic': require('../../../assets/icon/sms/sms.png')},
    'email'     : {'basic': require('../../../assets/icon/at/at.png')},
    'search'    : {'basic': require('../../../assets/icon/search/search.png')},
    'edit'      : {'basic': require('../../../assets/icon/edit/edit.png')},
    'brand'     : {'basic': require('../../../assets/icon/hexagon/hexagon.png')},
    'arrowLeft' : {'basic': require('../../../assets/icon/arrow/arrow-left.png')},
    'arrowRight': {'basic': require('../../../assets/icon/arrow/arrow-right.png') },
    'arrowDown' : {'basic': require('../../../assets/icon/arrow/arrow-down.png')},
    'arrowUp'   : {'basic': require('../../../assets/icon/arrow/arrow-up.png')},
    'checked'   : {'basic': require('../../../assets/icon/checked/checked.png')},
    'blank'     : {'basic': require('../../../assets/icon/blank/blank.png')},
    'more'      : {'basic': require('../../../assets/icon/more/more-vertical.png')},
    'plus'      : {'basic': require('../../../assets/icon/plus/plus.png')},
    'minus'     : {'basic': require('../../../assets/icon/minus/minus.png')},
  }
}) {
  return <TouchableOpacity onPress={(e)=>{onPress(e)}} style={[
    styles.container,
    (((iconConfig[type] || iconConfig[leftIcon]) && (title || children)) || type === 'action') ? styles.containerAction : {},
    styleConfig.container
  ]}>
    { iconConfig[type] || type === 'action' || iconConfig[leftIcon] ?
      <View style={[styles.icon, styleConfig.icon || {}, (title || children ? styles.iconWidthAuto : null), (iconConfig[leftIcon] ? styles.iconWidthLeft : null)]}>
        { !! (iconConfig[type] || {}).basic && <React.Fragment>
            { title || children ? <View style={[styles.icon, styles.toRight]}>
                <Image style={styles.image} source={iconConfig[type].basic}/>
              </View> : <Image style={styles.image} source={iconConfig[type].basic}/>
            }
          </React.Fragment>
        }
        { !! (iconConfig[leftIcon] || {}).basic &&  <View style={[styles.icon, styles.toLeft]}>
            <Image style={styles.image} source={iconConfig[leftIcon].basic}/>
          </View>
        }

        { title && value ? <View style={styles.titleAndValueWrapper}>
            <Text style={[styles.plain, styles.inLeft, styles.buttonText, styleConfig.button]}>{title}</Text>
            <Text style={[styles.plain, styles.inRight, styles.buttonValue, styleConfig.value]}>{value}</Text>            
          </View> : <React.Fragment>
            { !! title && <Text style={[styles.plain, styles.inLeft, styles.buttonText, styleConfig.button]}>{title}</Text>}
          </React.Fragment>
        }
        { !! description && <Text style={[styles.plain, styles.inLeft, styles.buttonDescription, styleConfig.description]}>{description}</Text>}
        { !! children && <View>{children}</View> }
      </View> : <View style={[styles.icon, styleConfig.icon || {}, (title || children ? styles.iconWidthAutoNoIcon : null)]}>
        { title ?
          <Text style={[styles[type] || styles.basic, styles.buttonText, styles[type+'Text'], styleConfig.button]}>{title.toUpperCase()}</Text> :
          <View>{children}</View>
        }
      </View>
    }
  </TouchableOpacity>
};

const styles = StyleSheet.create({
  'container': {
  },
  'containerAction': {
    'backgroundColor': '#fff'
  },
  'basic': {
    ...Theme.button
  },
  'icon': {
    ...Theme.buttonIcon,
    'minHeight': Theme.buttonIcon.height,
    'height': 'auto'
  },
  'iconWidthLeft': {
    'paddingLeft': Theme.buttonIcon.width,
    'borderWidth': 1,
    'borderColor': Theme.color.border
  },
  'iconWidthAuto': {
    'width': 'auto',
    'paddingTop': 2,
    'paddingBottom': 0,
    'paddingRight': Theme.buttonIcon.width
  },
  'iconWidthAutoNoIcon': {
    'width': 'auto',
    'padding': 0
  },
  'primary': {
    ...Theme.button,
    'fontWeight': '700',
    'borderColor': Theme.color.primary,
    'backgroundColor': Theme.color.primary,
    'paddingTop': 10,
    'paddingBottom': 10,
  },
  'primaryText': {
    'color': '#fff'
  },
  'secondary': {
    ...Theme.button,
    'fontWeight': '700',
    'borderColor': Theme.color.secondary,
    'backgroundColor': Theme.color.secondary,
    'paddingTop': 10,
    'paddingBottom': 10,
  },
  'secondaryText': {
    'color': '#fff'
  },
  'plain': {
    ...Theme.button,
    'fontWeight': '700',
    'backgroundColor': '#fff',
    'color': Theme.color.font,
    'paddingTop': 10,
    'paddingBottom': 10,
  },
  'image': {
    'flex': 1,
    'width': '100%',
    'height': '100%'
  },
  'toLeft': {
    'position': 'absolute',
    'left': 0,
    'top': 0,
    'padding': 12
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
  'inRight': {
    'textAlign':'right',
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
    'flex': 1,
    ...Theme.buttonText,
  },
  'buttonValue': {
    'flex': 1,
    ...Theme.buttonText,
    'fontWeight': 'normal',
    'opacity': .8
  },
  'buttonDescription': {
    ...Theme.buttonText,
    'fontWeight': 'normal',
    'opacity': .8,
    'marginTop': -5
  },
  'titleAndValueWrapper': {
    'flex': 1,
    'flexDirection': 'row',
    'alignItems': 'stretch',
  }
});