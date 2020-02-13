import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Header from './Header';
import { Theme }  from '../common/style/theme.js';

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state   = {'keyword': ''},
    this._click  = this._click.bind(this);
    this._change = this._change.bind(this);
  }  

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header {...this.state} change={this._change} click={this._click}/>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text>Home</Text>
        </ScrollView>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key) {
    if (e && e.preventDefault) { e.preventDefault(); }

    if (key === 'reset-search') {
      this.props.resetSearch();
    } else if ( key === 'change-state' ){
      this.setState({'text': 'Abc'});
    }
  }

  _change( e, key ) {
  }
}

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'backgroundColor': '#fff',
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
    'backgroundColor': '#fbfbfb',
    'height': Theme.space.header,
    ...Theme.shadow.level1
  },
  'contentContainer': {
    'paddingTop': (Theme.space.header + 10)
  }
});