import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import FormButton from '../common/form/FormButton';

import {capitalize} from '../util/Function';
import { Theme }  from '../common/style/Theme.js';

export default class GuidelineDesktop extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      'pageList': [
        {'id': 'Typography'},
        {'id': 'Color'     },
        {'id': 'Message'   },
        {'id': 'Panel'     },
        {'id': 'FormInput' },
        {'id': 'FormButton'},
        {'id': 'FormCodeField'},
        {'id': 'DatePicker'},
        {'id': 'Schedule'  },
        {'id': 'Wizard'    },
        {'id': 'PushNotification'},
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
              <FormButton type="arrowRight" title={page.id}
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
});