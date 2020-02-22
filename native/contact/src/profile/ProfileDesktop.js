import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Image from 'react-native-remote-svg';
import FormButton from '../common/form/FormButton';

import {ProfileDataList} from './ProfileDataList';
import { Theme }  from '../common/style/Theme.js';

/*
const form = [
  {
    'type': 'field', 'title': 'Fullame', 'name': 'name', 'value': '',
    'validation': [
      {'rule': 'required', 'message': 'The name is required' }
    ]
  },
  {'type': 'field', 'title': 'Email', 'name': 'email', 'value': '',
    'validation': [
    ]
  },
  {'type': 'field', 'title': 'Phone', 'name': 'phone', 'value': '', 'format': 'phone',
    'validation': [
    ]
  },
];
*/

export default class PorfileDesktop extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {'dataList': ProfileDataList || []};
    this._click  = this._click.bind(this);
    this._change = this._change.bind(this);
  } 

  componentWillMount() {
    if ( ! (this.props.dataList instanceof Array) ) { return; }

    let pin = this.props.dataList.reduce( (p,d) =>{
      p[d.name] = d.value || '';
      return p;
    }, {});

    this.state.dataList.forEach( (d) => { d.value = pin[d.name] || ''; });
  }

  render() {
    const { dataList } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {dataList.map( (data,i) => (
            <View key={'data-'+i} style={styles.collection}>
              <FormButton type={data.icon || 'edit'} title={data.title} value={data.value} description={data.description}
                onPress={(e)=>{this._click(e,'edit-data', data)}}              
              />
            </View>
          ) )}
        </ScrollView>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key, data) {
    let {dataList} = this.state;
    if ( key === 'edit-data' && data ) {
      this.props.navigation.navigate( data.type, {
        'dataList': dataList, 'data': data, 'back': 'desktop'
      });
    }
  }

  _change() {

  }
}

const styles = StyleSheet.create({
  'container': {
    'position': 'relative'
  },
  'contentContainer': {
    'paddingTop': 10,
    'paddingBottom': 10
  },
  'collection': {
    'marginBottom': Theme.space.medium,
  },
  'spacing': {
    'marginBottom': Theme.space.medium
  }
});