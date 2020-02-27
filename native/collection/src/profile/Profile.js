import React from 'react';
import {Text, View} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import ProfileDesktop from './ProfileDesktop';
import ProfileField from './ProfileField';

const Stack = createStackNavigator();

export default function Profile(props={}) {
  return (
    <Stack.Navigator initialRouteName="destop" screenOptions={({route})=>{
      route.action = (props.route || {}).action;
      return {};
    }}>
      <Stack.Screen name="desktop" component={ProfileDesktop} />
      <Stack.Screen name="field" component={ProfileField} />
    </Stack.Navigator>
  );
};