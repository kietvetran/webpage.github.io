import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Theme }  from '../common/style/Theme.js';
import Chart from '../common/chart/Chart';

export default class GuidelineMyChart extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.collection}>
            <Chart data={[[20,50,90,40], [40,10,70,80]]} highest={120} type="line" fill={true}
              xAxis={{'grid': 10, 'text': ['1.jan','2.jan','3.jan','4.jan']}}
              yAxis={{'grid': 10, 'separation': 4, 'unit': 'Kr' }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

/******************************************************************************
            <Chart data={[[20,50,90,40], [40,10,70,80]]} highest={120} type="line" fill={true}
              xAxis={{'grid': 10, 'text': ['1.jan','2.jan','3.jan','4.jan']}}
              yAxis={{'grid': 10, 'separation': 4, 'unit': 'Kr' }}
            />
******************************************************************************/

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
});