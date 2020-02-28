import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Theme }  from '../common/style/Theme.js';

export default class GuidelineColor extends React.Component {
  constructor(props) {
    super(props);
    this.state   = {
      'list': Object.keys( Theme.color ).map( (key) => {
        return {
          'name': [key, Theme.color[key]].join(': '),
          'value': Theme.color[key]
        };
      })
    };
  } 

  render() {
    const {list} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          { list.map( (collection, i) => (
              <View key={'collection-'+i} style={styles.collection}>
                <View style={[styles.space, styles.textWrapper]}><Text style={styles.text}>{collection.name}</Text></View>
                <View style={[styles.space, styles.colorWrapper, {'backgroundColor': collection.value}]}/>
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
  },
  'contentContainer': {
    'paddingTop': 10,
    'paddingBottom': 10
  },
  'collection': {
    'flex': 1,
    'flexDirection': 'row',
    'alignItems': 'stretch',
    'marginBottom': Theme.space.medium,
    'backgroundColor': '#fff',
    ...Theme.shadow.level1
  },
  'textWrapper': {
    'width': 270,
    'paddingLeft': Theme.space.medium
  },
  'text': {
    ...Theme.font.basic
  },
  'colorWrapper': {
    'flex': 1,
  },
  'space': {
    'padding': Theme.space.small
  }
});