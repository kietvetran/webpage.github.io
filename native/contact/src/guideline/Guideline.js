import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Message from '../common/message/Message';
import { Theme }  from '../common/style/Theme.js';

export default class Guideline extends React.Component {
  constructor(props) {
    super(props);
    this.state   = {};
    this._click  = this._click.bind(this);
  }  

  render() {
    const {peopleList, resultList } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Guideline</Text>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Message type="info" text="Info text" title="Info title"/>
          <Message type="warning" text="Warning text" title="Warning title"/>
          <Message type="error" text="Error text" title="Error title"/>
          <Message type="empty" text="Empty text" title="Empty title"/>
        </ScrollView>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key) {
  }
}

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'position': 'relative',
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
  'headerTitle': {
    ...Theme.font.h1,

  },
  'contentContainer': {
    'paddingTop': (Theme.space.header + (Theme.space.headerGap*3))
  }
});