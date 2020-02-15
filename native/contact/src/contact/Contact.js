import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
//import DialogManager, { ScaleAnimation, DialogContent } from 'react-native-dialog-component';

import Header from './Header';
import EmployeeCard from './EmployeeCard';
import Message from '../common/message/Message';
import { PeopleList } from '../../assets/data/PeopleList';
import { Theme }  from '../common/style/Theme.js';

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state   = {
      'keyword': '',
      'peopleList': PeopleList,
      'resultList': [PeopleList[0], PeopleList[1]]
    };
    this._click  = this._click.bind(this);
    this._change = this._change.bind(this);
  }  

  render() {
    const {peopleList, resultList } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header {...this.state} change={this._change} click={this._click}/>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          { (resultList || []).length === 0 ? <Message type="empty" text="Empty..."/> : <React.Fragment>
              <View style={styles.listContainer}>
                { resultList.map( (data, i) => (
                    <EmployeeCard key={'employee-'+i} data={data} size="small" styleContainer={{'marginBottom': 10}}
                      onPress={this._click}
                    />
                ) )}
              </View>
            </React.Fragment>
          }
        </ScrollView>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key, data) {
    if (e && e.preventDefault) { e.preventDefault(); }

    console.log('==> '+ key);

    if (key === 'reset-search') {
      this.props.resetSearch();
    } else if ( key === 'change-state' ){
      this.setState({'text': 'Abc'});
    }
  }

  _change( e, key ) {
  }
}

const styles = StyleSheet.create({
  'container': {
    'flex': 1
  },
  'listcContainer': {
    'flex': 1
  },
  'header': {
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'right': 0,
    'zIndex': 1,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    'backgroundColor': Theme.color.headerBg,
    ...Theme.shadow.level1
  },
  'contentContainer': {
    'paddingTop': (Theme.space.header + (Theme.space.headerGap*3))
  }
});