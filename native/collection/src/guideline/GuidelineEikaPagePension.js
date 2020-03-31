import React from 'react';
import { Platform, StyleSheet, Text, View, ImageBackground} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Theme }  from '../common/style/Theme.js';
import Chart from '../common/chart/Chart';
import Selector from '../common/selector/Selector';

export default class GuidelineEikaPagePension extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'title': 'Se hva du får i pensjon',
      'annualSalary': {
        'label': 'Din årslønn i dag',
        'size': 110,
        'selected': 300000,
        'list': [
          {'value': 50000,  'text': '50 000 kr' },
          {'value': 100000, 'text': '100 000 kr'},
          {'value': 150000, 'text': '150 000 kr'},
          {'value': 200000, 'text': '200 000 kr'},
          {'value': 250000, 'text': '250 000 kr'},
          {'value': 300000, 'text': '300 000 kr'},
          {'value': 350000, 'text': '350 000 kr'},
          {'value': 400000, 'text': '400 000 kr'},
          {'value': 450000, 'text': '450 000 kr'},
          {'value': 500000, 'text': '500 000 kr'},
          {'value': 550000, 'text': '550 000 kr'},
          {'value': 600000, 'text': '600 000 kr'},
          {'value': 650000, 'text': '650 000 kr'},
        ],
      },
      'pensionYear': {
        'label': 'Pensjonsalder',
        'size': 60,
        'selected': 67,
        'list': [
          {'value': 60,  'text': '60 år' },
          {'value': 61,  'text': '61 år' },
          {'value': 62,  'text': '62 år' },
          {'value': 63,  'text': '63 år' },
          {'value': 64,  'text': '64 år' },
          {'value': 65,  'text': '65 år' },
          {'value': 66,  'text': '66 år' },
          {'value': 67,  'text': '67 år' },
          {'value': 68,  'text': '68 år' },
          {'value': 69,  'text': '69 år' },
          {'value': 70,  'text': '70 år' },
          {'value': 71,  'text': '71 år' },
          {'value': 72,  'text': '72 år' },
          {'value': 73,  'text': '73 år' },
          {'value': 74,  'text': '74 år' },
          {'value': 75,  'text': '75 år' },
          {'value': 76,  'text': '76 år' },
          {'value': 77,  'text': '77 år' },
          {'value': 78,  'text': '78 år' },
          {'value': 79,  'text': '79 år' },
          {'value': 80,  'text': '80 år' },
        ],

      },
      'graph': {
        'colorList': ['#61C3E6', '#84BD00', '#EFEBE9'],
        //'symbol': false,
        'data': [
          {'value': 50},
          {'value': 25},
          {'value': 25}
        ],
        'type': 'pie',
        'legend': [
          {'text': 'Du vil ha ca',  'dy':'-1em', 'color': '#00383D', 'size': '1.2em', },
          {'text': '85%',           'dy': '1em', 'color': '#00383D', 'size': '4em', 'style': {'fontWeight': 'bold'}},
          {'text': 'av dagens lønn','dy': '2em', 'color': '#00383D', 'size': '1.2em', },
          {'text': 'i pensjon',                  'color': '#00383D', 'size': '1.2em', },
        ]
      }
    }

    this._change = this._change.bind(this);
  } 

  render() {
    let {graph, title, annualSalary, pensionYear} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.collection}>
            {!! title && <Text style={styles.title}>{title}</Text>}
            {!! annualSalary && <Selector {...annualSalary} 
                styleConfig={{'container': styles.selectorContainer}}
                onChange={(e)=>{this._change(e, 'annual-salary-change')}}
              />
            }

            {!! pensionYear && <Selector {...pensionYear} 
                styleConfig={{'container': styles.selectorContainer}}
                onChange={(e)=>{this._change(e, 'pension-year-change')}}
              />
            }

            {!! graph && <Chart {...graph}/> }
          </View>
        </ScrollView>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _change( e, key, data ) {
    if ( key === 'annual-salary-change' ) {
      //console.log('=> ' + e);
    }
  }
}

const styles = StyleSheet.create({
  'container': {
    'position': 'relative',
    'flex': 1,
    'backgroundColor': '#fff'
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
  'selectorContainer': {
    'marginTop': 15,
    'marginBottom': 15,
  },
  'collection': {
    'padding': 15,
  },
  'title': {
    ...Theme.font.h2,
    'textAlign': 'center',
    'color': '#00383D',
    'marginBottom': 10
  },
});