import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Theme }  from '../common/style/Theme.js';

export default class GuidelineTypography extends React.Component {
  constructor(props) {
    super(props);
    this.state   = {
      'list': [
        {'name': 'H1',  'style': 'h1'},
        {'name': 'H2',  'style': 'h2'},
        {'name': 'H3',  'style': 'h3'},
        {'name': 'H4',  'style': 'h4'},
        {'name': 'Basic',  'style': 'basic'},
        {'name': 'Basic space-mono fontFamily',  'style': 'basicMono'},
        {'name': 'Small',  'style': 'small'},
        {'name': 'Small space-mono frontfamily',  'style': 'smallMono'},
      ]
    };
  } 

  render() {
    const {list} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          { list.map( (collection, i) => (
              <View key={'collection-'+i} style={styles.collection}>
                <Text style={styles[collection.style]}>{collection.name}</Text>
              </View> 
          ) )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  'container': {
    'position': 'relative',
    'flex': 1
  },
  'contentContainer': {
    'paddingTop': 10,
    'paddingBottom': 10
  },
  'collection': {
    'marginBottom': Theme.space.medium,
    'backgroundColor': '#fff',
    'padding': Theme.space.medium,
    ...Theme.shadow.level1
  },
  'h1': { ...Theme.font.h1 },
  'h2': { ...Theme.font.h2 },
  'h3': { ...Theme.font.h3 },
  'h4': { ...Theme.font.h4 },
  'basic': { ...Theme.font.basic },
  'basicMono': { ...Theme.font.basic, 'fontFamily': 'space-mono' },
  'small': { ...Theme.font.small },
  'small': { ...Theme.font.small, 'fontFamily': 'space-mono' },
});