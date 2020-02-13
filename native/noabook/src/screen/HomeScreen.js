import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
//import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text>Home</Text>
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: false,
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'backgroundColor': '#fff',
    //'fontFamily': 
  },
  'contentContainer': {
    'paddingTop': 30,
  }
});
