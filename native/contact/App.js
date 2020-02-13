
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Contact from './src/contact/Contact';
import Organization from './src/organization/Organization';
import Profile from './src/profile/Profile';

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Contact" component={(props)=><Contact {...props}/>} />
        <Tab.Screen name="Organization" component={(props)=><Organization {...props}/>} />
        <Tab.Screen name="Profile" component={(props)=><Profile {...props}/>} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
/*
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Contact" component={HomeScreen} />
        <Tab.Screen name="Profile" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
*/

/*
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
*/