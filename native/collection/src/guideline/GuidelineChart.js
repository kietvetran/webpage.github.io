import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

// https://github.com/JesperLekland/react-native-svg-charts#barchart
import { StackedAreaChart, BarChart, Grid, PieChart, ProgressCircle, LineChart, YAxis, XAxis} from 'react-native-svg-charts';

import * as shape from 'd3-shape';
import { Theme }  from '../common/style/Theme.js';

export const MyBarChart = ({click=()=>{}}) => {
  const fill = 'rgb(134, 65, 244)';
  const data = [50, 10, 40, 95, -4, -24, null, 85, undefined, 0, 35, 53, -53, 24, 50, -20, -80];
  return (
    <BarChart animate={false} style={{ height: 200 }} data={data} svg={{ fill }} contentInset={{ top: 30, bottom: 30 }}>
      <Grid />
    </BarChart>
  );
};

export const MyPieChart = ({click=()=>{}}) => {
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
  const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
  const pieData = data.filter((value) => value > 0).map((value, index) => ({
    value,
    'svg': {
      'fill'    : randomColor(),
      'onPress': () => { click(null, 'click-on-pie-chart', index)},
    },
    'key': `pie-${index}`,
  }));

  return <PieChart style={{ height: 200 }} data={pieData} />
};

export const MyProgressCircle = ({click=()=>{}}) => {
  return <ProgressCircle style={{ height: 200 }} progress={0.7} progressColor={'rgb(134, 65, 244)'} />
};

export const MyYAxis = ({click=()=>{}}) => {
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
  const contentInset = { top: 20, bottom: 20 };
  return (
      <View style={{ height: 200, flexDirection: 'row' }}>
          <YAxis
              data={data}
              contentInset={contentInset}
              svg={{
                  fill: 'grey',
                  fontSize: 10,
              }}
              numberOfTicks={10}
              formatLabel={(value) => `${value}ºC`}
          />
          <LineChart
              style={{ flex: 1, marginLeft: 16 }}
              data={data}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              contentInset={contentInset}
          >
              <Grid />
          </LineChart>
      </View>
  );
};

export const MyXAxis = ({click=()=>{}}) => {
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80];
  return (
      <View style={{ height: 200, padding: 20 }}>
          <LineChart
              style={{ flex: 1 }}
              data={data}
              gridMin={0}
              contentInset={{ top: 10, bottom: 10 }}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
          >
              <Grid />
          </LineChart>
          <XAxis
              style={{ marginHorizontal: -10 }}
              data={data}
              formatLabel={(value, index) => index}
              contentInset={{ left: 10, right: 10 }}
              svg={{ fontSize: 10, fill: 'black' }}
          />
      </View>
  );
};

export default class GuidelineChart extends React.Component {
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
            <MyBarChart click={this._click} />
          </View>
          <View style={styles.collection}>
            <MyPieChart click={this._click} />
          </View>
          <View style={styles.collection}>
            <MyProgressCircle click={this._click} />
          </View>
          <View style={styles.collection}>
            <MyYAxis click={this._click} />
          </View>
          <View style={styles.collection}>
            <MyXAxis click={this._click} />
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