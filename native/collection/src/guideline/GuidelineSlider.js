import React from 'react';
import { Platform, StyleSheet, Text, View, Slider, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Theme }  from '../common/style/Theme.js';

export default class GuidelineSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'value': 30, 'changed': 30};
    this._change = this._change.bind(this);
  }

  render() {
    const { value, changed } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.content}>
            <Slider minimumValue={0} maximumValue={100} value={value} onValueChange={this._change}
              minimumTrackTintColor={Theme.color.secondary} thumbTintColor={Theme.color.secondary}
              //minimumTrackTintColor='#B00F1D'
              //maximumTrackTintColor='transparent'
              //thumbTintColor='#B00F1D'
              //style={{width: 200, height: 80}}
              //trackStyle={styles.track}
              //thumbStyle={styles.thumb}
            />
            <View style={styles.logArea}>
              <Text style={styles.logText}>{changed}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _change( e ) {
    let changed = Math.round( e ); // 5.4 => 5, 5.5 => 6
    this.setState({'changed': changed});
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
  'logArea': {
    'minHeight': 100
  },
  'logText':{
    ...Theme.font.basic
  },
  'track': {
    'height': 30,
    'borderRadius': 5,
    'backgroundColor': '#d0d0d0',
  },
  'thumb': {
    'width': 10,
    'height': 30,
    'borderRadius': 5,
    'backgroundColor': '#eb6e1b',
  }
});
