/*
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Contact from './src/contact/Contact';
import Profile from './src/profile/Profile';

const MainNavigator = createStackNavigator({
  'Contact': { 'screen': Contact },
  'Profile': { 'screen': Profile },
});

const App = createAppContainer(MainNavigator);

export default App;
*/

import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Header from './src/header/Header';
import Footer from './src/footer/Footer';
import { Theme }  from './src/common/style/theme.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'text': 'Hei Kiet'
    };  
    this._click       = this._click.bind(this)
    this._changeState = this._changeState.bind(this)
  }

  render() {
    const {text} = this.state;
    const action =  {
      'changeState': this._changeState
    };

    return (
      <View ref="frame" style={styles.frame}>
        <View ref="header" style={styles.header}>
          <Header {...action}/>
        </View>
        <View ref="body" style={styles.body}>
          <Text>Body</Text>
        </View>
        <View ref="footer" style={styles.footer}>
          <Footer {...action}/>
        </View>
      </View>
    );
  }

  _click(e, key) {
    if (e) { e.preventDefault(); }

    if (key === 'reset-search') {
      this.props.resetSearch();
    } else if ( key === 'change-state' ){
      this.setState({'text': 'Abc'});
    }
  }

  _changeState() {

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
  },
  'body': {
    'flex': 1,
    'flexDirection': 'column',
    ...Theme.debug
  },
  'footer': {
  }
});
