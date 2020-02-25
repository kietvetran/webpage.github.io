import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Image from 'react-native-remote-svg';
import FormButton from '../common/form/FormButton';
import {capitalize} from '../util/Function';
import { Theme }  from '../common/style/Theme.js';

export default class GuidelineDesktop extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      'pageList': [
        {'id': 'message'   },
        {'id': 'panel'     },
        {'id': 'formInput' },
        {'id': 'formButton'},
        {'id': 'schedule'  },
        {'id': 'wizard'    },
        {'id': 'chart'  },
      ]
    };
    this._click = this._click.bind(this);
  } 

  render() {
    const { pageList } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {pageList.map( (page,i) => (
            <View key={'page-'+i} style={styles.collection}>
              <FormButton type="arrowRight" title={capitalize(page.id)}
                onPress={(e)=>{this._click(e,'switch-page', page)}}
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
    if ( key === 'switch-page' && data ) {
      this.props.navigation.navigate(data.id);
    }
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