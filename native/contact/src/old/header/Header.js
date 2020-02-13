import React from 'react';
import { StyleSheet, TextInput, View} from 'react-native';
import FormButton from '../common/form/formButton';
import { Theme }  from '../common/style/theme.js';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this._click  = this._click.bind(this);
    this._change = this._change.bind(this);
  }
  
  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.left}>
        </View>
        <View style={styles.middle}>
          <TextInput style={styles.searchField} onChange={(e)=>{this._change(e, 'search-change')}}/>
        </View>
        <View style={styles.right}>
          <FormButton title="Filter" type="filter" onPress={()=>{this._click(null,'toogle-filter')}} />
        </View>
      </View>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key) {
    if ( e && e.preventDefault ) { e.preventDefault(); }
    if ( key === 'toggle-filter' ){
    } else if ( key === 'back' ) {
    }
  }

  _change(e, key ) {

  }
}

const styles = StyleSheet.create({
  'wrapper': {
    'flex': 1,
    'flexDirection': 'row',
  },
  'left': {
  },
  'middle': {
    'flex': 1,
    ...Theme.debug
  },
  'right': {
  },
  'searchField': {

  }
});