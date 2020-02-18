import React from 'react';
import {Text, View} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import GuidelineDesktop from './GuidelineDesktop';
import GuidelineMessage from './GuidelineMessage';
import GuidelinePanel from './GuidelinePanel';
import GuidelineFormInput from './GuidelineFormInput';

const Stack = createStackNavigator();

export default function Guideline() {
  return (
    <Stack.Navigator initialRouteName="Destop">
      <Stack.Screen name="Desktop" component={GuidelineDesktop} />
      <Stack.Screen name="Panel" component={GuidelinePanel} />
      <Stack.Screen name="Message" component={GuidelineMessage} />
      <Stack.Screen name="FormInput" component={GuidelineFormInput} />
    </Stack.Navigator>
  );
};