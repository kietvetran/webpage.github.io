import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
//import DialogManager, { ScaleAnimation, DialogContent } from 'react-native-dialog-component';

import Header from './Header';
import EmployeeCard from './EmployeeCard';
import Message from '../common/message/Message';
import {isBirthday} from '../util/Function';
import { PeopleList } from '../../assets/data/PeopleList';
import { Theme }  from '../common/style/Theme.js';

export default class Contact extends React.Component {
  static defaultProps = {
    'headerConfig': {'scolled': 0, 'max': 40, 'timer': 0}
  };

  constructor(props) {
    super(props);
    this.state   = {
      'keyword': '',
      'hideHeader': false,
      'peopleList': PeopleList,
      'resultList': PeopleList.filter( (d,i) => i < 20 ),
      'birthdayList': this._getBirthdayList(PeopleList),
    };
    this._click  = this._click.bind(this);
    this._change = this._change.bind(this);
    this._scroll = this._scroll.bind(this);
  }  

  render() {
    const {peopleList, resultList, birthdayList, hideHeader } = this.state;

    return (
      <View style={styles.container}>
        <View ref="headerWrapper" style={[styles.header, (hideHeader ? styles.hideHeader : {})]}>
          <Header {...this.state} change={this._change} click={this._click}/>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} 
          scrollEventThrottle={16} onScroll={(e)=>{this._scroll(e, 'scroll-vertical-list')}}
        >
          { birthdayList.length > 0 && <View style={styles.birthdayContainer}>
              <ScrollView style={styles.birthdayContainer} horizontal={true}>
                <View style={styles.horizontalListContainer}>
                  { birthdayList.map((data,i) => (
                    <EmployeeCard key={'birthday-employee-'+i} data={data} styleContainer={i ? {'marginLeft': 10} : {}}/>
                  ))}
                </View>
              </ScrollView>
            </View>
          }

          { (resultList || []).length === 0 ? <Message type="empty" text="Empty..."/> : <React.Fragment>
              <View style={styles.verticleListContainer}>
                { resultList.map( (data, i) => (
                    <EmployeeCard key={'employee-'+i} data={data} styleContainer={{'marginBottom': 10}}
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

    if (key === 'reset-search') {
      this.props.resetSearch();
    } else if ( key === 'change-state' ){
      this.setState({'text': 'Abc'});
    }
  }

  _change( e, key ) {
  }

  _scroll( e, key ) {
    if ( key === 'scroll-vertical-list' ) {
      this._verifyHeaderToggling(e);
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _verifyHeaderToggling( e ) {
    if ( ! e ) { return; }
    let {hideHeader} = this.state, {headerConfig} = this.props;
    let current  = e.nativeEvent.contentOffset.y || 0;

    //console.log( current + ' ===  ' + headerConfig.scolled);

    if ( current > headerConfig.max ) {
      let hide = current >= headerConfig.scolled;
      if ( hide !== hideHeader ) {
        //this.setState({'hideHeader': hide});
      }
    } else if ( hideHeader ) {
      //this.setState({'hideHeader': false});
    }
    headerConfig.scolled = current;
  }

  /****************************************************************************
  ****************************************************************************/
  _getBirthdayList( list ) {
    return (list || this.state.peopleList || []).reduce( (prev,data) => {
      let age = isBirthday(data.birthday);
      if ( age ) {
        data.age = age;
        prev.push( data ); 
      }
      return prev;
    }, []);
  }
}

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'position': 'relative'
  },
  'birthdayContainer': {
    'flex': 1,
    'marginBottom': 10
  },
  'horizontalListContainer': {
    'flexDirection': 'row'
  },
  'verticleListContainer': {
    'position': 'relative'
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
  'hideHeader': {
    'display': 'none'
  },
  'contentContainer': {
    'paddingTop': (Theme.space.header + (Theme.space.headerGap*3))
  }
});