import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

//https://github.com/xgfe/react-native-datepicker
import DatePicker from 'react-native-datepicker';

import { Theme }  from '../common/style/Theme.js';

export default class GuidelineDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'first': '08.09.1982',
      'second': '08.09.1982 12:31',
    };

    this._change = this._change.bind(this);
  } 

  render() {
    let {first, second} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.collection}>
            <DatePicker
              //style={{width: 200}}
              date={first}
              mode="date"
              placeholder="select date"
              format="DD.MM.YYYY"
              minDate="01.01.1982"
              maxDate="31.12.2030"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  'marginLeft': 36,
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {this._change(date,'change-date', 'first')}}
            />
          </View> 
          <View style={styles.collection}>
            <DatePicker
              //style={{width: 200}}
              date={second}
              mode="datetime"
              placeholder="select datetime"
              format="DD.MM.YYYY HH:mm"
              is24Hour={true}
              showIcon={false}
              customStyles={{
                dateInput: {
                  'width': 300,
                }
                // ... You can check the source to find the other keys.
              }}
              onCloseModal={()=>{}}
              onDateChange={(date) => {this._change(date,'change-date', 'second')}}
            />
          </View> 
        </ScrollView>
      </View>
    );
  }

  /****************************************************************************  
  ****************************************************************************/
  _change( e, key, field ) {
    if ( key === 'change-date' && field ) {
      this.setState({[field]: e});
    }
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
    'marginBottom': Theme.space.medium,
    'backgroundColor': '#fff',
    ...Theme.shadow.level1
  },
});