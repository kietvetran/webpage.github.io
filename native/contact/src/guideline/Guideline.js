import React from 'react';
import {Text, View} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import GuidelineDesktop from './GuidelineDesktop';
import GuidelineMessage from './GuidelineMessage';
import GuidelinePanel from './GuidelinePanel';
import GuidelineFormInput from './GuidelineFormInput';
import GuidelineFormButton from './GuidelineFormButton';
import GuidelineSchedule from './GuidelineSchedule';
import GuidelineWizard from './GuidelineWizard';
import GuidelineChart from './GuidelineChart';


const Stack = createStackNavigator();

export default function Guideline(props={}) {
  return (
    <Stack.Navigator initialRouteName="sestop" screenOptions={({route})=>{
      route.action = (props.route || {}).action;
      return {};
    }}>
      <Stack.Screen name="desktop" component={GuidelineDesktop} />
      <Stack.Screen name="panel" component={GuidelinePanel} />
      <Stack.Screen name="message" component={GuidelineMessage} />
      <Stack.Screen name="formInput" component={GuidelineFormInput} />
      <Stack.Screen name="formButton" component={GuidelineFormButton} />
      <Stack.Screen name="schedule" component={GuidelineSchedule} />
      <Stack.Screen name="wizard" component={GuidelineWizard} />
      <Stack.Screen name="chart" component={GuidelineChart} />
    </Stack.Navigator>
  );
};