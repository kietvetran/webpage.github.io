import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Schedule from '../common/schedule/Schedule';
import { Theme }  from '../common/style/Theme.js';

export default class GuidelineSchedule extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Schedule />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'position': 'relative',
    'paddingTop': Theme.space.small
  }
});