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
      <View style={styles.container}>
        <Text>{text}</Text>
        <Button title="Chnage state" onPress={()=>{this._click(null,'change-state')}}/>
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
  'container': {
    'flex': 1,
    'backgroundColor': Theme.color.appBg,
    'alignItems': 'center',
    'justifyContent': 'center'
  },
});