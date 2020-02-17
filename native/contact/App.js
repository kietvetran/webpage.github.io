import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Image from 'react-native-remote-svg';

import Contact from './src/contact/Contact';
import Organization from './src/organization/Organization';
import Profile from './src/profile/Profile';
import Guideline from './src/guideline/Guideline';

import { Theme }  from './src/common/style/Theme.js';

//import { Ionicons } from '@expo/vector-icons';
//import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();
//export default function App() {
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'tabIcon': {
        'contact': {
          'basic': require('./assets/icon/contact/contact.svg'),
          'focus': require('./assets/icon/contact/contact-blue.svg')
        },
        'profile': {
          'basic': require('./assets/icon/profile/profile.svg'),
          'focus': require('./assets/icon/profile/profile-blue.svg'),
        },
        'organization': {
          'basic': require('./assets/icon/organization/organization.svg'),
          'focus': require('./assets/icon/organization/organization-blue.svg')
        },
        'guideline': {
          'basic': require('./assets/icon/puzzle/puzzle.svg'),
          'focus': require('./assets/icon/puzzle/puzzle-blue.svg')
        }
      }
    };
    this._renderScreenOptions = this._renderScreenOptions.bind(this);
    this._renderTabBarIcon = this._renderTabBarIcon.bind(this);
  }

  render() {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Tab.Navigator screenOptions={this._renderScreenOptions}>
              <Tab.Screen name="Contact" component={Contact}/>
              <Tab.Screen name="Guideline" component={Guideline}/>
              <Tab.Screen name="Organization" component={Organization}/>
              <Tab.Screen name="Profile" component={Profile}/>
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  _renderScreenOptions({ route }) {
    return {
      'tabBarIcon': (props) => this._renderTabBarIcon({...props, route})
    };
  }

  _renderTabBarIcon({focused, color, size, route}) {
    let name  = (route.name || '').toLowerCase();
    let icons = this.state.tabIcon || {};
    let source = icons[name] ? (focused ? icons[name].focus : icons[name].basic) : null;
    return source ? <Image style={{'width':size, 'height': size}} source={source} /> : null;
    //return source ? <SVGImage style={{'width':size, 'height': size}} source={source} /> : null;
    //return source ? <Image style={{'width':size, 'height': size}} source={source} /> : null;
    //return <Icon name="rocket" size={30} color="#900" />;
    //return <Ionicons name={'user'} size={size} color={color} />;
  }
}

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'backgroundColor': Theme.color.appBg
  }
});

/*
import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function DetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details!</Text>
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Details" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
*/


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