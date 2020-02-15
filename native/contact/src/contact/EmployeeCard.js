import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, Text, ImageBackground, View } from 'react-native';

import FormButton from '../common/form/FormButton';
import { Theme }  from '../common/style/Theme.js';

export const Person = ({data, fieldList=['name'], styleConfig}) => {
  return <React.Fragment>
    {fieldList.map( (field,i) => (
      <View key={'info-row-'+i} style={styleConfig.infoRow}>
        <Text style={styleConfig[field+'Text'] || {}}>{data[field]}</Text>
      </View>
    ))}
  </React.Fragment>

};
export default function EmployeeCard({
  data      = null,
  size      = 'small',
  mode      = 'verticalList',
  display   = null,
  actionKey = 'click-on-person',
  onPress   = null,
  styleContainer = {}
}) {
  if ( ! data || ! data.id) { return null; }

  const actionList = [
    {'id': 'email', 'type': 'email', 'action': 'email-employee'},
    {'id': 'sms',   'type': 'sms',   'action': 'sms-employee'  },
    {'id': 'call',  'type': 'phone', 'action': 'call-employee' }
  ];
  const fieldList = display || ['name'];
  const styleConfig = ['infoRow', 'nameText'].reduce( (p,k) => {
    p[k] = styles[k+'_'+size] || {};
    return p;
  }, {});

  return <View style={[styles.container, styleContainer]}>
    <View style={styles.mainContainer}>
      { onPress ? <TouchableOpacity onPress={()=>{onPress(null,'click-on-employee', data)}}>
          <Person data={data} styleConfig={styleConfig} fieldList={fieldList}/>
        </TouchableOpacity> : <Person data={data} styleConfig={styleConfig} fieldList={fieldList}/>
      }
    </View>
    { !! onPress && <React.Fragment>
      { actionList.map( (note, i) => (
          <View key={'employee-actiono-'+i} style={styles.actionContainer}>
            <FormButton title={note.id} type={note.type}
              styleConfig={{'icon':styles.iconButton}}
              onPress={()=>{onPress(null,note.action,data)}}
            />
          </View>
      )) }
      </React.Fragment>
    }
  </View>
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'flexDirection': 'row',
    'backgroundColor': '#fff',
    'overflow': 'hidden'
  },
  'mainContainer': {
    'flex': 1    
  },
  'actionContainer': {
  },
  'iconButton': {
    'width': 40,
    'height': 40,
    'padding': 8
  },
  'verticalList': {
    'marginBottom': Theme.space.medium
  },
  'infoRow_small': {
    'flex': 1,
    'padding': 10
  },
  'nameText_small': {
    ...Theme.font.h3
  },
  'infoRow_large': {
    'flex': 1,
  },
  'nameText_large': {
    ...Theme.font.h2
  }
});