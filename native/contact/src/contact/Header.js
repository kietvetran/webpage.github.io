import React from 'react';
import { StyleSheet, TextInput, View} from 'react-native';
import FormButton from '../common/form/formButton';
import { Theme }  from '../common/style/theme.js';


export default function Header({
  keyword = 'kiet',
  click  = () => {},
  change = () => {}
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.left}>
      </View>
      <View style={styles.middle}>
        <TextInput style={styles.searchField} onChange={(e)=>{change(e, 'search-change')}}/>
      </View>
      <View style={styles.right}>
        <FormButton title="Filter" type="filter" onPress={()=>{click(null,'toogle-filter')}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  'wrapper': {
    'flex': 1,
    'flexDirection': 'row'
  },
  'left': {
  },
  'middle': {
    'flex': 1,
  },
  'right': {
  },
  'searchField': {
    'height': Theme.space.header,
    'paddingLeft': 5,
    'paddingRight': 5
  }
});