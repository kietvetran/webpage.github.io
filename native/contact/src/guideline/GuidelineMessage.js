import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Message from '../common/message/Message';
import { Theme }  from '../common/style/Theme.js';

export default class GuidelineMessage extends React.Component {
  //constructor(props) {super(props);} 

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Message type="info" text="Info text" title="Info title" styleConfig={{'container': styles.spacing}}/>
          <Message type="warning" text="Warning text" title="Warning title" styleConfig={{'container': styles.spacing}}/>
          <Message type="error" text="Error text" title="Error title" styleConfig={{'container': styles.spacing}}/>
          <Message type="empty" text="Empty text" title="Empty title" styleConfig={{'container': styles.spacing}}/>
        </ScrollView>
      </View>
    );
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
  'spacing': {
    'marginBottom': Theme.space.medium,      
  }
});