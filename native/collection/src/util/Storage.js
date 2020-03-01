import {AsyncStorage} from 'react-native';

export default class Storage {
  static async set( key, value='' ) {
    if ( ! key ) { return false; }

    let out = true;
    try {
      let t = typeof(value), v = t === 'object' ? JSON.stringify(value) : (
        t.match( /(number|string|boolean)/i ) ? (value+'') : ''
      );
      if ( v ) { await AsyncStorage.setItem(key, v); }
    } catch ( e ) {
      out = false; 
    }
  
    return out ? value : null;
  }

  static async get( key ) {
    if ( ! key ) { return ''; }

    let out = null;  
    try {
      let v = await AsyncStorage.getItem( key );
      out = v.match( /^(\{|\[)/ ) ? JSON.parse( v ) : v;
    } catch (e) {  out = null; }
    return out;
  }

  static async remove( key ) {
    try {
      if ( key ) { AsyncStorage.removeItem( key ); }
    } catch (e) {}
  }
}
