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
//import GuidelineChart from './GuidelineChart';
//import GuidelineChartKit from './GuidelineChartKit';
//import GuidelineChartF2 from './GuidelineChartF2';
import GuidelineFormCodeField from './GuidelineFormCodeField';
import GuidelineTypography from './GuidelineTypography';
import GuidelineColor from './GuidelineColor';
import GuidelineDatePicker from './GuidelineDatePicker';
import GuidelinePushNotification from './GuidelinePushNotification';

const Stack = createStackNavigator();

export default function Guideline(props={}) {
  return (
    <Stack.Navigator initialRouteName="Destop" screenOptions={({route})=>{
      route.action = (props.route || {}).action;
      return {};
    }}>
      <Stack.Screen name="Desktop" component={GuidelineDesktop} />
      <Stack.Screen name="Panel" component={GuidelinePanel} />
      <Stack.Screen name="Message" component={GuidelineMessage} />
      <Stack.Screen name="FormInput" component={GuidelineFormInput} />
      <Stack.Screen name="FormButton" component={GuidelineFormButton} />
      <Stack.Screen name="FormCodeField" component={GuidelineFormCodeField} />
      <Stack.Screen name="Schedule" component={GuidelineSchedule} />
      <Stack.Screen name="Wizard" component={GuidelineWizard} />
      <Stack.Screen name="Typography" component={GuidelineTypography} />
      <Stack.Screen name="Color" component={GuidelineColor} />
      <Stack.Screen name="DatePicker" component={GuidelineDatePicker} />
      <Stack.Screen name="PushNotification" component={GuidelinePushNotification} />
    </Stack.Navigator>
  );
};