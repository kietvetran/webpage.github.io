import React from 'react';
import { Platform, StyleSheet, Text, View, ImageBackground} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Theme }  from '../common/style/Theme.js';
import Chart from '../common/chart/Chart';

export default class GuidelineEikaPageQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'space': 300,
      'image': require('../../assets/image/eika-question-bg.png'),
      'width': 280,
      'title': '50 000',
      'description': 'Pensjonsmentoren',
      'goal': ['Mål', '400 000'],
      'graph': {
        'colorList': ['#00383D'],
        'data': [
          {'value': 40, 'symbol':'circle', 'point': false},
          {'value': 230, 'symbol':'circle', 'point': false},
          {'value': 120, 'symbol':'circle', 'point': false},
          {'value': 390, 'symbol':'circle', 'point': true},
        ],
        'highest': 400,
        'type': 'spline',
        'height': 140,
        'padding': {'top': 20, 'left': 0, 'right': 55, 'bottom': 20},
        'xAxis': {
          'grid': 0, 
          'text': ['4 år','8 år','12 år','16 år'],
          'textColor': '#00383D',
          'separationLineStyle': {'opacity': 0},
          'style': {'opacity': 0}
        },
        'yAxis': {
          'grid': 0, 
          'separation': 2,
          'separationLine': true,
          'separationLineStyle': {'opacity': 0},
          'unit': ' 000',
          'toRight': true,
          'textColor': '#00383D',
          'style': {'opacity': 0}
        }
      }
    }
  } 

  render() {
    let {image, graph, width, title, description, goal, space} = this.state;
    return (
      <View style={styles.container}>
        <ImageBackground source={image} style={styles.backgroundImage}/>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={{...styles.collection, 'height': space}}/>

          <View style={styles.collection}>
            <View style={{...styles.content, 'width': width}}>
              {!! title && <Text style={styles.title}>{title}</Text>}
              {!! description && <Text style={styles.desction}>{description}</Text> }
              { (goal || []).length > 0 && <View style={styles.goalContainer}>
                  { goal.map( (text,i) => (
                      <Text key={'goal-text-'+i} style={{...styles.goalText, ...(styles['goalText'+i] || {})}}>{text}</Text>
                  )) }
                </View>
              }

              <Chart {...graph} width={(width-40)}/>
            </View>
          </View>
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
  'backgroundImage': {
    'position': 'absolute',
    'left': 0,
    'top': 0,
    'right': 0,
    'bottom': 0
  },
  'contentContainer': {
    'paddingTop': 10,
    'paddingBottom': 10,
    'position': 'relative'
  },
  'collection': {
    'flex': 1,
    'flexDirection': 'row',
    'justifyContent': 'center',
  },
  'content': {
    'backgroundColor': 'rgba(255,255,255,.85)',
    'padding': 20,
    'borderRadius': 10,
  },
  'title': {
    ...Theme.font.h2,
    'color': '#00383D',
  },
  'description': {
    ...Theme.font.basic,
    'color': '#00383D',
  },
  'goalContainer': {
    'position': 'absolute',
    'top': 0,
    'right': 0,
    'marginTop': 20,
    'marginRight': 20,
  },
  'goalText': {
    ...Theme.font.basic,
    'fontSize': 12,
    'color': '#00383D'
  },
  'goalText0': {
    'textAlign': 'right'
  }
});