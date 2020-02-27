import * as React from 'react';
import { Platform, StyleSheet, Text, View, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
//import Image from 'react-native-remote-svg';

import Organization from './src/organization/Organization';
import {Theme} from './src/common/style/Theme';

const Tab = createBottomTabNavigator();

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
    this._openModal = this._openModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Kiet Ok</Text>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _renderScreenOptions({ route }) {
    route.action = {
      'openModal' : this._openModal,
      'closeModal': this._closeModal
    };
    return {
      'tabBarIcon': (props) => this._renderTabBarIcon({...props, route})
    };
  }

  _renderTabBarIcon({focused, color, size, route}) {
    let name  = (route.name || '').toLowerCase();
    let icons = this.state.tabIcon || {};
    let source = icons[name] ? (focused ? icons[name].focus : icons[name].basic) : null;

    return null;
    //return source ? <Image style={{'width':size, 'height': size}} source={source} /> : null;
    //return source ? <SVGImage style={{'width':size, 'height': size}} source={source} /> : null;
    //return source ? <Image style={{'width':size, 'height': size}} source={source} /> : null;
    //return <Icon name="rocket" size={30} color="#900" />;
    //return <Ionicons name={'user'} size={size} color={color} />;
  }

  _closeModal() {
    this.setState({'modalConfig': null});
  }

  _openModal( config={} ) {
    config.children ? this.setState({'modalConfig': config}) : this._closeModal();
  }
}

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'backgroundColor': Theme.color.appBg
  }
});
