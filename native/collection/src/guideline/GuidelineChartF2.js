import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

//https://reactnativeexample.com/f2-charts-for-react-native/
//https://reactnativeexample.com/f2-charts-for-react-native/
//https://reactnativeexample.com/a-powerful-slider-with-assorted-data-visualized-charts/
import { StackedAreaChart, BarChart, Grid, PieChart, ProgressCircle, LineChart, YAxis, XAxis} from 'react-native-svg-charts';

import * as shape from 'd3-shape';
import { Theme }  from '../common/style/Theme.js';

export default class GuidelineChartF2 extends React.Component {
  constructor(props) {
    super(props);
    this.state   = {
      'list': [
      ]
    };
    this._click = this._click.bind(this);
  } 

  render() {
    const {list} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.collection}>
          </View>
        </ScrollView>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key, data) {
    console.log('click....');
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
  'spacing': {
    'marginBottom': Theme.space.medium
  }
});