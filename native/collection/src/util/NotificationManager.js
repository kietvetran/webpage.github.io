import { Platform, PushNotificationIOS } from 'react-native';
import PushNotification from 'react-native-push-notification';
//import PushNotificationIOS from '@react-native-community/push-notification-ios';

// https://www.youtube.com/watch?v=Sx-KapT-_DU
// https://dev.to/jakubkoci/react-native-push-notifications-313i
// https://www.youtube.com/watch?v=VMti_GgKgwY
export default class NotificationManager {
  static a() {
    console.log('== a ');
    console.log( PushNotification );    
    console.log( PushNotificationIOS );
  }

  static configure( config={}) {
    //console.log('== Confiure ===');
    PushNotification.configure({
      'onRegister': (token) => {
        console.log('=== On Register ===');
        console.log( token );
      },
      'onNotification': (notification) => {
        console.log('=== On Notification ===');
        console.log( notification );

        notification.finish();
      }
    });
  }

  static unregister(){
    PushNotification.unregister();
  }

  static cancelAllLocalNotification(){
    Platform.OS === 'ios' ? PushNotificationIOS.removeAllDeliveredNotifications() :
      PushNotification.cancelAllLocalNotifications();
  }

  static displayNotification( config={} ) {
    let option = {
      ...this._buildAndroidNotification(config), // Android
      ...this._buildIOSNotification(config),     // iOS
      'title'  : config.title || '',
      'message': config.text  || '',
      'playSound': config.playSound === false ? false : true,
      'soundName': config.soundName || 'default',
      'userInteraction': false,
      'date': config.date || undefined
    };

    //option.date ? PushNotification.localNotificationSchedule( option ) :
    //  PushNotification.localNotification( option );
    if ( option.date ) {
      console.log('date => ' + option.date);
      PushNotification.localNotificationSchedule( option );
      PushNotification.localNotificationSchedule({
        'title'  : option.title,
        'message': option.message,
        'date'   : option.date
      });
    } else {
      PushNotification.localNotification( option );
    }
  };

  static _buildAndroidNotification( config={} ){
    return {
      'id'        : config.id,
      'autoCancel': true,
      'largeIcon' : config.largeIcon || 'ic_laucher',
      'smallIcon' : config.smallIcon || 'ic_laucher',
      'bigText'   : config.text || '',
      'subText'   : config.title || '',
      'vibrate'   : config.vibrate === false ? false : true,
      'vibration' : config.vibration  || 300,
      'priority'  : config.priority   || 'hight',
      'importance': config.importance || 'hight',
      'data'      : config.data 
    };
  }

 static  _buildIOSNotification( config={} ){
    return {
      'alertAction': config.alertAction || 'view',
      'category'   : config.category || '',
      'userInfo'   : {
        'id'  : config.id,
        'item': config.data
      }
    };
  }
};

//export const notificationManager =  new NotificationManager();