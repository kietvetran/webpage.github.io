import React from 'react';
import { StyleSheet, Text, View, Slider } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Chart from '../common/chart/Chart';
import FormInput from '../common/form/FormInput';
import {Theme} from '../common/style/Theme';

export default class Pension extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'colorList': [
        'rgba(28, 201, 157, 1)', //'#1cc99d', // green
        'rgba(82, 183, 242, 1)', //'#52b7f2', // blue
        'rgba(243, 80, 114, 1)', //'#f35072', // red
        'rgba(240, 197, 92, 1)', //'#f0c55c', // yellow
        'rgba(134, 117, 244, 1)', //'#8675f4', // purple
        'rgba(216, 144, 59, 1)', //'#d8903b', // orange
        'rgba(233, 163, 191, 1)', //'#e9a3bf', // pink
      ],
      'config': {
        'year': {
          'title': 'Year',
          'text' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          'unit' : 'år',
          'value': 10,
          'adjustment': 1
        },
        'monthlySaving': {
          'title': 'Montly saving',
          'text' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id nibh tempor, maximus felis id, volutpat dui',
          'unit' : 'kr', 
          'value': 5000,
          'adjustment': 1000
        },
        'currentSaved': {
          'title': 'Current saved',
          'text' : 'Vestibulum eu interdum metus.',
          'unit' : 'kr',
          'value': 20000,
          'adjustment': 2000
        },
        // --------
        'normal'       : {'title': 'Normal',      'interest': .03, 'potential': .1,   'color': 'rgba(28, 201, 157, 1)', 'symbol': 'circle'},
        'riskTypeX'    : {'title': 'Risk type X', 'interest': .1,  'potential': .3,   'color': 'rgba(82, 183, 242, 1)', 'symbol': 'triangle'}, 
        'riskTypeY'    : {'title': 'Risk type Y', 'interest': .13,  'potential': .45, 'color': 'rgba(243, 80, 114, 1)', 'symbol': 'square' },      
        'riskTypeZ'    : {'title': 'Risk type Z', 'interest': .17,  'potential': .8,  'color': 'rgba(134, 117, 244, 1)','symbol': 'triangle-down'},        
      },
      'chart': {
        //'animation': false,
        'highest': 100,
        'type': 'line',
        'padding': {'top': 20, 'left': 60, 'right': 10, 'bottom': 40},
        'xAxis': {'grid': 0, 'text': ['Standar',''], 'textColor': '#333', 'title': 'Year'},
        'yAxis': {'grid': 0, 'separation': 4, 'separationLine': true, 'unit': '', 'color': '#ccc', 'textColor': '#333', 'title': 'Kr' },
      }
    };

    this._click  = this._click.bind(this);
    this._change = this._change.bind(this);

    this.state.chart = this._getCalculatedSavingMoney( this.state );
  }

  render() {
    let {chart, config} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Chart {...chart} />
        </View>
        <View style={styles.body}>
          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContainer}>
            { ['year', 'monthlySaving', 'currentSaved'].map( (key,i) => (
                <View key={'pin-'+key} style={styles.card}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.cardTitle}>{config[key].title}</Text>
                    { !! config[key].text && <Text ellipsizeMode='tail' numberOfLines={2} style={styles.cardText}>{config[key].text}</Text> }
                  </View>
                  <View style={styles.cardRight}>
                    <FormInput type="fieldNumbeAdjustment" value={config[key].value+''}
                      keyboardType="number-pad"
                      styleConfig={{'field': styles.field}}
                      onPress={(e)=>{this._click(e, (key+'-adjustment'), config[key] )}}
                      onChangeText={(e)=>{this._change(e,(key+'-change'),config[key] );}}
                    />
                  </View>
                </View>
            )) }
          </ScrollView>
        </View>
      </View>
    );
  }

  /******************************************************************************
  ******************************************************************************/
  _click( e, key, data ) {
    if ( key === 'year-adjustment' || key === 'monthlySaving-adjustment' || key === 'currentSaved-adjustment' ) {
      let value = parseInt((data.value+'')) + 
        (data.adjustment * (e === 1 ? 1 : -1 ));
      data.value = value;
      this.setState({'chart': this._getCalculatedSavingMoney() });
    }
  }

  _change( e, key, data ) {
    if ( key === 'year-change' || key === 'monthlySaving-change' || key === 'currentSaved-change' ) {
      let value = parseInt(e) || '';
      data.value = value;
      this.setState({'chart': this._getCalculatedSavingMoney() });
    }
  }

  /******************************************************************************
  ******************************************************************************/
  _getCalculatedSavingMoney( state={} ) {
    let {chart, config} = state;
    chart  = JSON.parse( JSON.stringify( (chart || this.state.chart || {}) ));
    config = JSON.parse( JSON.stringify( (config || this.state.config || {}) ));

    chart.xAxis.text = [];

    let now = new Date(), year = now.getFullYear(), value = 0;
    let j = 0, length = parseInt((config.year.value+'')) || 0;
    let pin = length < 5 ? 0 : (length <= 10 ? 2 :  (length / 4));
    pin = parseInt( pin );

    for ( j=0; j<=length; j++ ) {
      j === 0 || j === length || pin === 0 || (pin && (j%pin) === 0) ?
        chart.xAxis.text.push((year+j)) : chart.xAxis.text.push( ' ' );
    }

    let allValueLowerThousand = true;
    chart.data   = [];
    chart.legend = [];
    //['normal'].forEach( (key) => {
    ['normal', 'riskTypeX','riskTypeY','riskTypeZ'].forEach( (key) => {
      let source = config[key], data = [], basic = 0;
      if ( ! source ) { return; }

      for ( j=0; j<=length; j++ ) {
        value = config.currentSaved.value + 
          ((config.monthlySaving.value * 12) * (1+source.interest));

        value += value * (source.potential * j);

        data.push({
          'value': value,
          'color': source.color,
          'point': j === 0 || j === length || pin === 0 || (pin && (j%pin) === 0),
          'symbol': source.symbol || true
        });

        if ( allValueLowerThousand && value < 1000 ) {
          allValueLowerThousand = false;
        }
      }
      chart.data.push( data );
      chart.legend.push({
        'title' : source.title,
        'color' : source.color,
        'symbol': source.symbol || true
      });
    });

    if ( allValueLowerThousand) {
      chart.data.forEach( (d) => {
        (d instanceof Array ? d : [d]).forEach( (n) => {
          n.value = parseInt(n.value / 1000);
          //n.value = parseFloat(parseFloat((n.value / 1000)).toFixed(2));
        });
      });
      chart.yAxis.unit = 'k';
    } else {
      chart.yAxis.unit = '';
    }

    return chart;
  }

  _getXaxisText( config ) {
    let now = new Date(), year = now.getFullYear(), out = [];
    let length = parseInt((config.year.value+'')) || 1;
    for ( let i=0; i<length; i++ ) {
      out.push( (year+i));
    }
    return out;
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
    'height': 320,
    'alignItems': 'stretch',
    'justifyContent': 'center',
  },
  'body': {
    'flex': 1,
    'backgroundColor': '#fff',
    'borderTopLeftRadius': 20,
    'borderTopRightRadius': 20,
  },
  'bodyContainer': {
    'paddingTop': 10,
    'paddingBottom': 10
  },
  'card': {
    'flex': 1,
    'flexDirection': 'row',
    'padding': 10,
  },
  'cardLeft': {
    'flex': 1,
    'justifyContent': 'center',
    'paddingRight': 10,
  },
  'cardRight': {
  },
  'cardTitle': {
    ...Theme.font.h4
  },
  'cardText': {
    ...Theme.font.basic
  },
  'field': {
    'width': 100,
    'textAlign': 'center'
  },
  'mono': {
    'fontFamily': 'space-mono',
    'color': 'red'
  }
});