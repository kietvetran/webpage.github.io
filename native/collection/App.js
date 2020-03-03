import * as React from 'react';
import { Platform, StyleSheet, Text, View, Modal, Image, Dimensions, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Spinner from 'react-native-loading-spinner-overlay';

import * as Font from 'expo-font';

import Contact from './src/contact/Contact';
import Organization from './src/organization/Organization';
import Profile from './src/profile/Profile';
import Guideline from './src/guideline/Guideline';

import Popup from './src/common/popup/Popup';

import {Theme} from './src/common/style/Theme';

const { width, height } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'fontLoaded': false,
      'spinnerConfig': { 'visible': false, 'text': 'Loading...'},
      'tabIcon': {
        'contact': {
          'basic': require('./assets/icon/contact/contact.png'),
          'focus': require('./assets/icon/contact/contact-blue.png')
        },
        'profile': {
          'basic': require('./assets/icon/profile/profile.png'),
          'focus': require('./assets/icon/profile/profile-blue.png'),
        },
        'organization': {
          'basic': require('./assets/icon/organization/organization.png'),
          'focus': require('./assets/icon/organization/organization-blue.png')
        },
        'guideline': {
          'basic': require('./assets/icon/puzzle/puzzle.png'),
          'focus': require('./assets/icon/puzzle/puzzle-blue.png')
        }
      }
    };

    this._renderScreenOptions = this._renderScreenOptions.bind(this);
    this._renderTabBarIcon = this._renderTabBarIcon.bind(this);
    this._openModal    = this._openModal.bind(this);
    this._closeModal   = this._closeModal.bind(this);
    this._openSpinner  = this._openModal.bind(this);
    this._closeSpinner = this._closeSpinner.bind(this);
    this._openPopup    = this._openPopup.bind(this);
    this._closePopup   = this._closePopup.bind(this);

    console.log('app current state => ' + AppState.currentState);

    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  async componentDidMount() {
    await Font.loadAsync({
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    });

    this.setState({'fontLoaded': true });

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  render() {
    const {modalConfig={}, spinnerConfig={}, fontLoaded, splashImage} = this.state;

    return fontLoaded ? <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator initialRouteName="contact" screenOptions={this._renderScreenOptions}>
            <Tab.Screen name="contact" component={Contact}/>
            <Tab.Screen name="organization" component={Organization}/>
            <Tab.Screen name="profile" component={Profile}/>
            <Tab.Screen name="guideline" component={Guideline}/>
          </Tab.Navigator>

          { !! modalConfig.children && <Modal animationType={modalConfig.animation || 'slide'}
            transparent={false} visible={true} 
              //onRequestClose={() => {this._click(null,'close-modal')}}
            ><View style={styles.modalContainer}>{modalConfig.children}</View></Modal>
          }

          <Spinner visible={spinnerConfig.visible} textContent={spinnerConfig.text} textStyle={styles.spinnerTextStyle} />
        </NavigationContainer>
        <Popup.Widget widgetRef={(ref)=>{this.popupWidgetRef = ref;}}/>
      </SafeAreaView>
    </SafeAreaProvider> : <View style={styles.container}>
      <Spinner visible={true} textContent="Start up...." textStyle={styles.spinnerTextStyle} />
    </View>
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  //render() { return <View style={styles.container}><Text>Kiet test</Text></View> }

  /****************************************************************************
   appState value:
   - background => The app is not on focus, the app is put on a side.
   - inactive (only in iOS) =>
   - active => when the app is open in the beginning
  ****************************************************************************/
  _handleAppStateChange(appState) {
  }

  /****************************************************************************
  ****************************************************************************/
  _renderScreenOptions({ route }) {
    route.action = {
      'openModal' : this._openModal,
      'closeModal': this._closeModal,
      'openPopup' : this._openPopup,
      'closePopup': this._closePopup
    };
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

  _closeModal() {
    this.setState({'modalConfig': null});
  }

  _openModal( config={} ) {
    config.children ? this.setState({'modalConfig': config}) : this._closeModal();
  }

  _closeSpinner() {
    this.setState({'spinnerConfig': {'visible': false, 'text': 'Loading...'}});
  }

  _openSpinner( text ) {
    this.setState({'spinnerConfig': {'visible': true, 'text': text === undefined ? 'Loading...' : (text || '')}});
  }

  _closePopup() {
    this.popupWidgetRef.hide();
  }

  _openPopup( config={} ) {
    if ( ! this.popupWidgetRef ) { return; }
    this.popupWidgetRef.show( config );
  }
}

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'backgroundColor': Theme.color.appBg
  },
  'spinnerTextStyle': {
  },
  'splashImage': {
    'position': 'absolute',
    'left': 0,
    'top': 0,
    'width': width,
    'height': height,
    'zIndex': 10
  }
});
