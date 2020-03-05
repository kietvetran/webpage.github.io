import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FormButton from '../common/form/FormButton';
import NotificationManager from '../util/NotificationManager';

export default class GuidelinePushNotification extends React.Component {
  constructor(props) {
    super(props);
    this._click = this._click.bind(this);
  } 

  render() {
    return (
      <View style={styles.container}>
        <FormButton type="secondary" title="Notification" 
          styleConfig={{'container': styles.button}}
          onPress={(e)=>{this._click(e, 'display-notification')}}
        />
        <FormButton type="secondary" title="Notification delay" 
          styleConfig={{'container': styles.button}}
          onPress={(e)=>{this._click(e, 'display-notification-delay')}}
        />
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key) {
    if ( key === 'display-notification') {
      //NotificationManager.configure();
      NotificationManager.displayNotification({
        'title': 'Notification',
        'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      }); 
    } else if ( key === 'display-notification-delay') {
      console.log('yes.yes...');
      let now = new Date();
      //NotificationManager.configure();
      NotificationManager.displayNotification({
        'date' : new Date((now.getTime() - (1*60*60*1000) + (60*1000))),
        'title': 'Notification delay',
        'text' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      }); 
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  'button': {
    'width': 200,
    'margin': 5
  }
});