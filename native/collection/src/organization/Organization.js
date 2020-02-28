import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class Organization extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Organization</Text>
        <Text style={styles.mono}>Organization</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  'mono': {
    'fontFamily': 'space-mono',
    'color': 'red'
  }
});