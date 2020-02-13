import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Theme }  from './src/common/style/theme.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'text': 'Hei Kiet'
    };  
    this._click = this._click.bind(this)
  }

  render() {
    const {text} = this.state;

    return (
      <View ref="frame" style={styles.frame}>
        <View ref="header" style={styles.header}>
          <Text>Header</Text>
          <Button title="Filter" onPress={()=>{this._click(null, 'toggle-filter')}}/>
        </View>
        <View ref="body" style={styles.body}>
          <Text>Body</Text>
        </View>
        <View ref="footer" style={styles.footer}>
          <Text>Footer</Text>
        </View>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key) {
    if (e) { e.preventDefault(); }

    if (key === 'reset-search') {
      this.props.resetSearch();
    } else if ( key === 'change-state' ){
      this.setState({'text': 'Abc'});
    }
  }

}

const styles = StyleSheet.create({
  'frame': {
    'flex': 1,
    'flexDirection': 'column',
    'justifyContent': 'center',
    'backgroundColor': Theme.color.appBg
  },
  'header': {
    ...Theme.debug
  },
  'body': {
    'flex': 1,
    'flexDirection': 'column',
    ...Theme.debug
  },
  'footer': {
    ...Theme.debug
  }
});