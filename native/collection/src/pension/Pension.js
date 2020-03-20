import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Chart from '../common/chart/Chart';
import {Theme} from '../common/style/Theme';

export default class Pension extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'color': {
        'list': [
          'rgba(28, 201, 157, 1)', //'#1cc99d', // green
          'rgba(82, 183, 242, 1)', //'#52b7f2', // blue
          'rgba(243, 80, 114, 1)', //'#f35072', // red
          'rgba(240, 197, 92, 1)', //'#f0c55c', // yellow
          'rgba(134, 117, 244, 1)', //'#8675f4', // purple
          'rgba(216, 144, 59, 1)', //'#d8903b', // orange
          'rgba(233, 163, 191, 1)', //'#e9a3bf', // pink
        ]
      },
      'source': {
        //'animation': false,
        'highest': 120,
        'data': [[80,50,90,40], [40,10,70,80], [10,90,20,70]],
        'type': 'bar',
        //'data': [80,90,90,40], 'type': 'pie',
        //'data': 30, 'type': 'progress',
        'fill': true,
        'xAxis': {'grid': 0, 'text': ['1.jan','2.jan','3.jan','4.jan'], 'textColor': '#333'},
        'yAxis': {'grid': 0, 'separation': 4, 'separationLine': true, 'unit': 'Kr', 'color': '#ccc', 'textColor': '#333' },
      }
    };

    this._click  = this._click.bind(this);
    this._change = this._change.bind(this);
  }

  render() {
    let {source} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Chart {...source} />
        </View>
        <View style={styles.body}>
          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContainer}>
            <Text style={styles.mono}>Body</Text>
          </ScrollView>
        </View>
      </View>
    );
  }

  /******************************************************************************
  ******************************************************************************/
  _click( e, key, data ) {
  }

  _change( e, key, data ) {
  }
}

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'backgroundColor': Theme.appBg,
    'alignItems': 'stretch',
    'justifyContent': 'flex-start',
  },
  'header': {
    'flex': 1,
    'height': 300,
    'alignItems': 'stretch',
    'justifyContent': 'center',
  },
  'body': {
    'flex': 1,
    'backgroundColor': '#fff',
    'borderTopLeftRadius': 50,
    'borderTopRightRadius': 50,
  },
  'bodyContainer': {
    'paddingTop': 50,
    'paddingBottom': 10
  },
  'mono': {
    'fontFamily': 'space-mono',
    'color': 'red'
  }
});