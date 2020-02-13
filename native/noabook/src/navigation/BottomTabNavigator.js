import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import LinksScreen from '../screen/LinksScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

const PageList = [
  {'name': 'Home', 'title': 'Home',     'header': 'Home', 'component': HomeScreen  },
  {'name': 'Link', 'title': 'Resouces', 'header': 'Link', 'component': LinksScreen }
];

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      {PageList.map( (page,i) => (
        <BottomTab.Screen key={'page-tab-'+i} name={page.name} component={page.component} options={{
          'title': page.title 
        }}/>
      ))}
    </BottomTab.Navigator>
  );

  /*
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen name="Link" component={LinksScreen}
        options={{
          title: 'Resources'
          //tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
    </BottomTab.Navigator>
  );
  */
}

const getHeaderTitle = (route) => {
  let name  = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  let option = PageList.reduce( (prev, page) => {
    prev[page.name] = page.header || '';
    return prev;
  }, {});  
  return option[name] || '';
};