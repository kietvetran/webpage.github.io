import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { Theme }  from '../common/style/Theme.js';

export default class GuidelineSwipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'log': []};

    this._swipe      = this._swipe.bind(this);
    this._swipeUp    = this._swipeUp.bind(this);
    this._swipeDown  = this._swipeDown.bind(this);
    this._swipeLeft  = this._swipeLeft.bind(this);
    this._swipeRight = this._swipeRight.bind(this);
  }

  render() {
    const { log } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.content}>
            <GestureRecognizer style={styles.swipeArea}
              config={{'velocityThreshold': .1, 'directionalOffsetThreshold': 10}}
              onSwipe={this._swipe}
              onSwipeUp={this._swipeUp}
              onSwipeDown={this._swipeDown}
              onSwipeLeft={this._swipeLeft}
              onSwipeRight={this._swipeRight}
            ><Text style={styles.swipeText}>Swipe here</Text></GestureRecognizer>

            <View style={styles.logArea}>
              {log.map( (text,i) => (
                  <Text key={'log-text-'+i} style={styles.logText}>{text}</Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _swipeUp( e ) {
    //console.log('=> swipe - up');
  }

  _swipeDown( e ) {
    //console.log('=> swipe - down');
  }

  _swipeLeft( e ) {
    //console.log('=> swipe - left');
  }

  _swipeRight( e ) {
    //console.log('=> swipe - right');
  }

  _swipe( name, e ) {
    this.setState({'log': [(name || 'NULL')].concat(this.state.log)});

    /*
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    switch (name) {
      case SWIPE_UP:
        break;
      case SWIPE_DOWN:
        break;
      case SWIPE_LEFT:
        break;
      case SWIPE_RIGHT:
        break;
    }
    */
  }
}

const styles = StyleSheet.create({
  'container': {
    'position': 'relative',
    'flex': 1,
  },
  'contentContainer': {
    'paddingTop': 10,
    'paddingBottom': 10
  },
  'content': {
    'flex': 1,
    'padding': 10,
    'backgroundColor': '#fff'
  },
  'swipeArea': {
    'height': 300,
    'backgroundColor': 'rgba(25, 181, 254, .4)',
    'marginBottom': 10,
    'position': 'relative',
    ...Theme.border.basic,
    'borderWidth': 1
  },
  'swipeText': {
    ...Theme.font.basic,
    'position': 'absolute',
    'left': 0,
    'right': 0,
    'top': 40,
    'textAlign': 'center'
  },
  'logArea': {
    'minHeight': 100
  },
  'logText':{
    ...Theme.font.basic
  },
});
