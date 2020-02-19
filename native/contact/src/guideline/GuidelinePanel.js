import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Panel from '../common/panel/Panel';
import { Theme }  from '../common/style/Theme.js';

export default class GuidelinePanel extends React.Component {
  constructor(props) {
    super(props);
  } 
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Panel title="Lorem ipsum"  styleConfig={{'container': styles.spacing}}>
            <Text style={styles.text}>
              First paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus arcu velit, pulvinar sed imperdiet id,
              cursus eget lorem. Morbi magna enim, euismod sit amet arcu vel, maximus tristique diam. 
            </Text>
            <Text style={styles.text}>
              Second paragraph:
            </Text>
          </Panel>
          <Panel title={['Lopem ipsum', 'Animal']}  styleConfig={{'container': styles.spacing}}>
            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus arcu velit, pulvinar sed imperdiet id,
              cursus eget lorem. Morbi magna enim, euismod sit amet arcu vel, maximus tristique diam. Suspendisse potenti.
              Nam nisi ex, suscipit ut sodales et, facilisis at orci. Nam rhoncus nisi id dapibus hendrerit. Nulla et neque orci
            </Text>
            <Text style={styles.text}>
              Dog, cat, mouse, bat
            </Text>
          </Panel>
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
  'text': {
    ...Theme.font.basic
  },
  'spacing': {
    'marginBottom': Theme.space.medium
  }
});