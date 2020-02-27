import React from 'react';
import { Platform, Modal, StyleSheet, Text, View, Alert, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import FormButton from '../form/FormButton';
import FormInput from '../form/FormInput';

import {convertTextToDate, convertDateToText} from '../../util/Function';
import { Theme }  from '../style/Theme.js';

const scheduleItemHeight = 60;
const headerItemWidth    = 70;

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      ...this._initState( props ),
      'animationConfig': {'duration': 600, 'delay': 0}
    };
    this._click = this._click.bind(this);
  }

  render() {
    //const {styleConfig={}} = this.props;
    const {animation, schedule, header, scheduleDate, title, modalConfig={}} = this.state;

    return (
      <View style={styles.container}>
        <View style={[styles.containerRow, styles.containerRowHeader]}>
          {!! title && <Text style={styles.headerTitle}>{title}</Text>}
          <ScrollView ref="headerScroller" style={styles.containerRowHeaderScroller}  contentContainerStyle={styles.contentContainerRowHeaderScroller} horizontal={true}>
            {header.map( (data,i) => {
              let isActive = scheduleDate.getTime() === data.stamp;
              return data.type === 'next' || data.type === 'previous' ? <View key={'header-'+i} style={[styles.headerItem, styles.headerItemArrow]}>
                { data.type === 'next' ? 
                    <FormButton type="arrowRight" styleConfig={{'container': styles.headerArrowContainer}} onPress={()=>{this._click(null,'get-next-header', data)}}/> :
                    <FormButton type="arrowLeft" styleConfig={{'container': styles.headerArrowContainer}} onPress={()=>{this._click(null,'get-previous-header', data)}}/>
                }
              </View> : <TouchableOpacity key={'header-'+i}
                  style={[styles.headerItem, isActive ? styles.headerItemActive : {}]}
                  onPress={()=>{this._click(null, 'get-schedule', data)}}
                >
                  <Text style={[styles.headerItemDayText, isActive ? styles.headerItemTextActive : {}]}>{data.dayText}</Text>
                  <Text style={[styles.headerItemDateText, isActive ? styles.headerItemTextActive : {}]}>{data.dateText}</Text>
                </TouchableOpacity>
            } )}
          </ScrollView>
        </View>
        <View style={[styles.containerRow, styles.containerRowBody]}>
          <ScrollView ref="scheduleScroller">
            {schedule.map( (data,i) => (
              <TouchableOpacity key={'time-'+i} style={[styles.scheduleItem]} onPress={()=>{this._click(null, 'open-schedule', data)}}>
                <Text style={styles.scheduleItemText}>{ (! i ? (data.dateText + ', ') : '') + data.timeText}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

         { !! modalConfig.data && <Modal animationType='slide'transparent={false} visible={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalBody}>
                <Text style={styles.modalTitle}>Schedule modal</Text>
              </View>
              <View style={styles.modalFooter}>
                <FormButton title="Close" onPress={()=>{this._click(null, 'close-schedule')}}/>
              </View>
            </View>
          </Modal>
        }
      </View>
    );        
  }

  componentDidMount() {
    this._scrollHeaderIntoView();
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {

    if ( key === 'close-schedule' ) {
      this.setState({'modalConfig': undefined});
    } else if ( key === 'open-schedule' && data ) {
      this.setState({'modalConfig': {'data': data}});
    } else if ( key === 'get-schedule' && data && data.date instanceof Date ) {
      let state = {'scheduleDate': this._getDate(data.date) };
      state.schedule = this._getSchedule( state );
      this.setState( state );
      this.refs.scheduleScroller.scrollTo({'y': 0, 'animated': true});
    } else if ( (key === 'get-next-header' || key === 'get-previous-header') && data && data.date instanceof Date ) {
      this._expandHeaderList( data, (key === 'get-next-header'));
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _expandHeaderList( data, isNext ) {
    let {display, header} = this.state;
    let state = {'headerDate': this._getDate(data.date) };
    let list  = this._getHeader( state );

    if ( display === 'weekly' ) {
      state.header = list;
      isNext ? this.refs.headerScroller.scrollTo({'x':0, 'animated': false}) :
        this.refs.headerScroller.scrollToEnd({'animated': false});
    } else {
      if ( isNext ) {
        list.shift();
        header.pop();
        state.header = header.concat( list );
      } else {
        list.pop();
        header.shift();
        state.header = list.concat( header );

        let position = (list.length - 1) * headerItemWidth;
        setTimeout( () => {
          this.refs.headerScroller.scrollTo({'x':position, 'animated': false});
        }, 50);
      }
    }

    state.title = this._getTitle( state ); 
    this.setState( state );
  }

  _scrollHeaderIntoView( timestamp ) {
    if ( ! this.refs.headerScroller ) { return; }

    let {header, scheduleDate} = this.state;
    let stamp = timestamp || scheduleDate.getTime();
    let index = -1, i = 0, length = header.length;
    for ( i; i<length; i++ ) {
      if ( stamp !== header[i].stamp ) { continue; }
      index = i;
      i = length;
    }

    if ( index < 0 ) { return; }
    let position = (index * headerItemWidth) - headerItemWidth;
    this.refs.headerScroller.scrollTo({'x':position, 'animated': false});
  }

  /****************************************************************************
  ****************************************************************************/
  _getTitle( state ) {
    let info = {'list': [], 'pin': {}};
    ((state || this.state).header || []).forEach( (data) => {
      let year = data.date ? data.date.getFullYear() : '';
      if ( ! year || info.pin[year] ) { return; }
      info.pin[year] = 1;
      info.list.push( year );
    });
    return 'Year ' +info.list.join(' / ');
  }

  _getDayName() {
    return ['Sun','Mon','Tue','Wen','Thu','Fri','Sat'];
  }
  _getMonthName() {
    return ['Jan','Feb','Mar','Apr','Mai','Jun','Jul','Aug','Sep','Oct','Nov','Des'];
  }

  _getTimeTextByDate( date ) {
    if ( ! (date instanceof Date) ) { return ''; }
    return [date.getHours(), date.getMinutes()].map( (v) => {
      return v < 10 ? ('0'+v) : v;
    }).join(':');
  }

  _getDate( date ) {
    let now = new Date(), tmp = typeof(data) === 'text' ? convertTextToDate( date ) : (
      typeof(date) === 'number' ? (new Date(date)) :
        (date instanceof Date ? (new Date(date.getTime())) : now)
    );

    let out = tmp instanceof Date ? tmp : now;
    out.setHours(0);
    out.setMinutes(0);
    out.setSeconds(0);
    out.setMilliseconds(0);
    return out;
  }

  _getSchedule( state ) {
    let date  = (state || this.state).scheduleDate  || this._getDate();
    let begin = (state || this.state).clockBegin || 0;
    let dayName   = (state || this.state).dayName || this._getDayName();
    let monthName = (state || this.state).monthName || this._getMonthName();
    let planned = state.planned || {}; // Not in use jet-

    let list = [], i = 0, max = 24;
    let cloned = new Date(date.getTime()), number = cloned.getDate();
    let dateText = dayName[cloned.getDay()]+' '+
      (number < 10 ? ('0'+number) : number) + '. '+ monthName[cloned.getMonth()];
  
    for ( i; i<max; i++ ) {
      cloned.setHours(i);

      let data = {'stamp': cloned.getTime(), 'booking': []};
      data.interval = [data.stamp]; 
      data.date     = new Date( data.stamp );
      data.timeText = this._getTimeTextByDate( data.date );
      data.dateText = dateText;
      data.planned  = planned[data.stamp]; 

      if ( i && list[(i-1)] ) {
        list[(i-1)].interval.push(data.stamp);
      }
      list.push(data);
    }

    if ( begin > 0 && begin < 24 ) {
      let sorted = [], active = false;
      for ( i=0; i<max; i++ ) {
        active = active || list[i].planned || i === begin;
        if ( ! active ) { continue; }
        sorted.push( list[i] );
      }

      list = sorted;
    }

    return list;
  }

  _getHeader( state ) {
    let date      = (state || this.state).headerDate || this._getDate();
    let max       = (state || this.state).headerView || 7;
    let dayName   = (state || this.state).dayName || this._getDayName();
    let monthName = (state || this.state).monthName || this._getMonthName();

    let list = [], cloned = new Date( date.getTime() );
    for ( let i=0; i<max; i++ ) {
      let number = cloned.getDate(), data = {
        'stamp'    : cloned.getTime(),
        'dayText'  : dayName[cloned.getDay()],
        'dateText' : (number < 10 ? ('0'+number) : number) + '. '+ monthName[cloned.getMonth()],
      };

      data.date = new Date( data.stamp );
      list.push( data );

      cloned.setDate( (cloned.getDate() + 1) );
    }

    list.unshift({
      'type': 'previous',
      'date': new Date( list[0].stamp )
    });
    list[0].date.setDate((list[0].date.getDate() - max));

    list.push({
      'type': 'next',
      'date': new Date( cloned.getTime() )
    });

    return list;
  }

  /****************************************************************************
  ****************************************************************************/
  _initState( props ) {
    let {display, scheduleDate, headerDate, clockBegin, headerView} = props, state = {
      'display': display || '',
      'clockBegin': clockBegin || 6,
      'headerView': headerView || 14,
      'dayName'   : this._getDayName(),
      'monthName' : this._getMonthName(),
      'dimension' : {
        'width' : Dimensions.get('window').width,
        'height': Dimensions.get('window').height
      }
    };

    state.scheduleDate = this._getDate( scheduleDate );
    state.headerDate   = this._getDate((headerDate || scheduleDate));

    if ( state.display === 'weekly' ) {
      let day = state.headerDate.getDay() || 7;
      if ( day !== 1 ) {
        let number = state.headerDate.getDate() - (day - 1);
        state.headerDate.setDate( number );
      }
    } else if ( ! headerDate ) {
      state.headerDate.setDate((state.headerDate.getDate()-1));
    }

    state.schedule = this._getSchedule( state );
    state.header   = this._getHeader( state );
    state.title    = this._getTitle( state ); 

    return state;
  }
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1
  },
  'containerRow': {
    'backgroundColor': '#fff',
  },
  'containerRowHeader': {
    'marginBottom': Theme.space.medium,
  },
  'containerRowBody': {
    'flex': 1
  },
  'containerRowHeaderScroller' : {
    ...Theme.shadow.level1
  },
  'contentContainerRowHeaderScroller': {
  },

  /***************************************************************************/
  'headerItemArrow': {
    'width': Theme.buttonIcon.width,
    'position': 'relative'
  },
  'headerArrowContainer': {
    'position': 'absolute',
    'left': 0,
    'top': '50%',
    'marginTop': ((Theme.buttonIcon.height / 2) * -1)
  },
  'headerTitle': {
    ...Theme.font.h2,
    'padding': 5,
    'textAlign': 'center',
    'backgroundColor': 'rgba(0,0,0,.1)'
  },
  'headerItem': {
    'width': headerItemWidth,
    'opacity': .5
  },
  'headerItemActive' : {
    'opacity': 1
  },
  'headerItemTextActive' : {
    'backgroundColor': Theme.color.focus,
    'color': '#fff',
  },
  'headerItemDayText': {
    ...Theme.font.basic,
    'textAlign': 'center',
    'fontWeight': '700',
    'paddingTop': 8
  },
  'headerItemDateText': {
    ...Theme.font.small,
    'textAlign': 'center',
    'paddingBottom': 8,
    'fontWeight': 'normal'
  },

  /***************************************************************************/
  'scheduleItem': {
    'height': scheduleItemHeight,
    'position': 'relative',
    'borderTopWidth': 1,
    'borderTopColor': Theme.color.border,
    'overflow': 'hidden'
  },
  'scheduleItemText': {
    ...Theme.font.basic,
    'position':'absolute',
    'left': 5,
    'top': 2,
    ...Theme.font.small,
    'opacity': .5
  },
  'content': {
    'flex': 1,
    'overflow': 'hidden',
    'padding': 8,
    'borderTopWidth': 1,
    'borderTopColor': Theme.color.border
  },

  /***************************************************************************/
  'modalContainer': {    
    'marginTop': 22,
    'padding': 10,
    'flex': 1
  },
  'modalBody': {
    'flex': 1,
  },
  'modalFooter': {
  },
  'modalTitle': {
    ...Theme.font.h1,
    'marginBottom': 10
  }
});