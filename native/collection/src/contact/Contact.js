import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
//import DialogManager, { ScaleAnimation, DialogContent } from 'react-native-dialog-component';

import Header from './Header';
import EmployeeCard from './EmployeeCard';
import Message from '../common/message/Message';

import {createRegexp} from "../util/Function";
import {isBirthday} from '../util/Function';
import { PeopleList } from '../../assets/data/PeopleList';
import { Theme }  from '../common/style/Theme.js';

export default class Contact extends React.Component {
  static defaultProps = {
    'headerConfig': {'scolled': 0, 'max': 40, 'timer': 0},
    'timer': {'search': 0},
    'expanding': {'gap': 200, 'action': false}
  };

  constructor(props) {
    super(props);
    this.state   = {
      ...this._initState( props )
    };
    this._click  = this._click.bind(this);
    this._change = this._change.bind(this);
    this._scroll = this._scroll.bind(this);
    this._search = this._search.bind(this);
  }  

  render() {
    const {search, birthdayList} = this.state;

    return (
      <View style={styles.container}>
        <Header ref="header" {...this.state} change={this._change} click={this._click}/>

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

          { (search.matched || []).length === 0 ? <Message type="empty" text="Empty..."/> : <React.Fragment>
              <View style={styles.verticleListContainer}>
                { search.matched.map( (data, i) => (
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

    if ( key === 'search' ) {
      //this.setState({'search': {...this.state.search, 'text': e}});
      clearTimeout( this.props.timer.search || 0 );
      this.props.timer.search = setTimeout( () => {
        this._search({'text': e});
      }, 300);
    }
  }

  _scroll( e, key ) {
    if ( key === 'scroll-vertical-list' ) {
      this._verifyHeaderToggling(e);
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _search( config={}, wantOutput ) {
    let {search} = this.state || {};

    let list  = config.list || search.list;
    let length = list.length;
    let text  = config.text    || '';
    let i     = config.stopped || 0;
    let max   = config.view    || search.view || 20;
    let reg   = createRegexp(text.trim(),1,1,3);
    let state = {'matched': []};

    for ( i; i<length; i++ ){
      if ( ! list[i].name.match(reg) ) { continue; } 
      
      state.matched.push( list[i] );
      if ( state.matched.length === max ) {
        state.stopped = i;
        i = length;
      }
    }

    state.text = text;
    return wantOutput ? state : this.setState({
      'search': {...search, ...state}
    });
  }

  _verifyHeaderToggling( e ) {
    if ( ! e || ! this.refs.header ) { return; }

    let {headerConfig, expanding} = this.props;
    let hideHeader = this.refs.header.getHide();
    let current  = e.nativeEvent.contentOffset.y || 0;

    // verify hiding of header.
    if ( current > headerConfig.max ) {
      let hide = current >= headerConfig.scolled;
      if ( hide !== hideHeader ) {
        this.refs.header.toggleHide(hide);
      }
    } else if ( hideHeader ) {
      this.refs.header.toggleHide(false);
    }

    headerConfig.scolled = current;  

    // verify expading of the list.
    let contentHeight = e.nativeEvent.contentSize.height    || 0;
    let viewHeight = e.nativeEvent.layoutMeasurement.height || 0;
    if ( contentHeight && viewHeight && current && ! expanding.action ) {
      if ( (contentHeight - (viewHeight + current)) < expanding.gap ) {
        expanding.action = true;
        let {search} = this.state, note = this._search(search, true);

        let matched = (search.matched || []).concat((note.matched || []));
        this.setState({'search': {...search, ...note, 'matched': matched}});

        setTimeout( () => {
          expanding.action = false;
        }, 100);
      }      
    }
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

  _initState( props ) {
    let state = {
      'birthdayList': this._getBirthdayList( PeopleList ),
      'search': {
        'view': 30,
        'list': PeopleList,
        'pin' : {}, 
        'matched' : null
      }
    };

    state.search.list.forEach( (data) => {
      state.search.pin[data.id] = data;
    });

    state.search = {...state.search, ...this._search(state.search, true)}
    return state;
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
  'contentContainer': {
    'paddingTop': (Theme.space.header + (Theme.space.headerGap*3))
  }
});