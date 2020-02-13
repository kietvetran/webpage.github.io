//import { createStackNavigator } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import Contact from './src/contact/Contact';
//import Profile from './src/profile/Profile';
//import Organization from './src/organization/Organization';

const AppNavigator = createStackNavigator({
  'Contact'     : { 'screen': Contact      }
  //'Organization': { 'screen': Organization },
  //'Profile'     : { 'screen': Profile      }
});

export default AppNavigator;