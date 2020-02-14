import React from 'react';
import { StyleSheet, TextInput, View} from 'react-native';
import FormButton from '../common/form/formButton';
import FormInput from '../common/form/formInput';
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
        <FormInput style={styles.searchField} onChange={change} actionKey='search-change'
          icon={{'type':'search'}}
        />
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
    'flexDirection': 'row',
    'paddingTop': Theme.space.headerGap,
    'paddingBottom': Theme.space.headerGap,
  },
  'left': {
  },
  'middle': {
    'flex': 1,
  },
  'right': {
  },
  'searchField': {
    'height': Theme.space.header
  }
});