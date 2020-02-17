import React from 'react';
import { Platform, StyleSheet, TextInput, View} from 'react-native';
import FormButton from '../common/form/FormButton';
import FormInput from '../common/form/FormInput';
import { Theme }  from '../common/style/Theme.js';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'hide': false};
  }

  render()  {
    const {keyword, click, change} = this.props;
    const {hide} = this.state;

    return hide ? null : <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.left}>
        </View>
        <View style={styles.middle}>
          <FormInput styleConfig={{'field':styles.searchField}} onChange={(e)=>{change(e,'search')}}
            icon={{'type':'search'}}
          />
        </View>
        <View style={styles.right}>
          <FormButton title="Filter" type="filter" onPress={()=>{click(null,'toogle-filter')}} />
        </View>
      </View>
    </View>
  }

  /****************************************************************************
  ****************************************************************************/
  getHide() {
    return this.state.hide || false;
  }

  toggleHide( force ) {
    this.setState({'hide': force});
  }
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
  },
  'container': {
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'right': 0,
    'zIndex': 1,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    'backgroundColor': Theme.color.headerBg,
    ...Theme.shadow.level1
  }
});