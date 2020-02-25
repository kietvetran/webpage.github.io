import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

// https://www.instamobile.io/react-native-tutorials/react-native-charts/
// https://aboutreact.com/react-native-chart-kit/
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit';

import { Theme }  from '../common/style/Theme.js';

const width = Dimensions.get('window').width - (Theme.space.medium * 2);

export const ChartKitLineChart = ({click=()=>{}}) => {
  const data = {
    'labels': ['January', 'February', 'March', 'April', 'May', 'June'],
    'datasets': [{
      'data': [20, 45, 28, 80, 99, 43],
      'strokeWidth': 2, // optional
    }]
  };

  return (
    <View>
      <Text>Bezier Line Chart</Text>
      <LineChart data={data} width={width} height={220} yAxisLabel={'$'} bezier={1} onPress={(e)=>{click(e,'click-on-line-chart')}}
        style={{'marginVertical': 8, 'borderRadius': 2}}
        chartConfig={{
          //backgroundColor: '#e26a00',
          //backgroundGradientFrom: '#fb8c00',
          //backgroundGradientTo: '#ffa726',
          //decimalPlaces: 2, // optional, defaults to 2dp
          //color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          //style: {borderRadius: 16 }

          backgroundColor: '#ccc',
          backgroundGradientFrom: '#ddd',
          backgroundGradientTo: '#eee',
 
          'style': {'borderRadius': 4},
          //'color': (opacity=1) => ( 'rgba(255, 255, 255, '+opacity+')' )
          'color': (opacity=1) => ( 'rgba(0, 0, 0, '+opacity+')' )
        }}
      />
    </View>
  );
};

export const ChartKitBarChart = ({click=()=>{}}) => {
  const data = {
    'labels': ['January', 'February', 'March', 'April', 'May', 'June'],
    'datasets': [{
      'data': [20, 45, 28, 80, 99, 43],
    }]
  };

  return <BarChart data={data} width={width} height={220} yAxisLabel={'$'}
    style={{'marginVertical': 8, 'borderRadius': 2}}
    chartConfig={{
      'color': (opacity=1) => ( 'rgba(0, 0, 0, '+opacity+')' )
    }}
  />
};

export const ChartKitPieChart = ({click=()=>{}}) => {
  const data = [
    {
      name: 'Seoul',
      population: 21500000,
      color: 'rgba(131, 167, 234, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Toronto',
      population: 2800000,
      color: '#F00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Beijing',
      population: 527612,
      color: 'red',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'New York',
      population: 8538000,
      color: '#ffffff',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Moscow',
      population: 11920000,
      color: 'rgb(0, 0, 255)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return <PieChart data={data} width={width} height={220}
    accessor="population"
    backgroundColor="transparent"
    paddingLeft="15"
    absolute
    chartConfig={{
      'color': (opacity=1) => ( 'rgba(0, 0, 0, '+opacity+')' )
    }}
  />
};

export const ChartKitProgress = ({click=()=>{}}) => {
  return null;
  return <ProgressChart data={[0.4, 0.6, 0.8]} width={width} height={220}
    chartConfig={{
      backgroundColor: '#1cc910',
      backgroundGradientFrom: '#eff3ff',
      backgroundGradientTo: '#efefef',
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
    }}
    style={{
      marginVertical: 8,
      borderRadius: 16,
    }}
  />

};


export default class GuidelineChartKit extends React.Component {
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
            <ChartKitLineChart click={this._click}/>
          </View>
          <View style={styles.collection}>
            <ChartKitBarChart click={this._click}/>
          </View>
          <View style={styles.collection}>
            <ChartKitPieChart click={this._click}/>
          </View>
          <View style={styles.collection}>
            <ChartKitProgress click={this._click}/>
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
    'position': 'relative',
    'marginBottom': Theme.space.medium,
    'backgroundColor': '#fff',
    'padding': Theme.space.medium,
    ...Theme.shadow.level1
  },
  'spacing': {
    'marginBottom': Theme.space.medium
  }
});