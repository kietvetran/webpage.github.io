import React from 'react';
import { StyleSheet, Text, View, Picker, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import FormButton from '../common/form/FormButton';
import FormSelection from '../common/form/FormSelection';

import {PeopleList} from '../../assets/data/PeopleList';

import Storage from '../util/Storage';

import {ProfileDataList} from './ProfileDataList';
import { Theme }  from '../common/style/Theme.js';

export default class PorfileDesktop extends React.Component {
  constructor(props) {
    super(props);
    this.state     = { ...this._initState(props) };
    this._click    = this._click.bind(this);
    this._change   = this._change.bind(this);
    this._selected = this._selected.bind(this); 
  } 

  render() {
    const { dataList=[], modal } = this.state;

    //return <FormSelection callback={this._selected} list={PeopleList} selected="person-0" callback={this._selected} id={'invitation'}/>

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {dataList.map( (data,i) => (
            <View key={'data-'+i} style={styles.collection}>
              <FormButton type={data.icon || 'edit'} title={data.title} value={data.value} description={data.description}
                onPress={(e)=>{this._click(e,'edit-data', data)}}              
              />
            </View>
          ) )}
        </ScrollView>

       { (modal === 'friend' || modal === 'invitation') && <Modal animationType='slide' transparent={false} visible={true}>
          <FormSelection callback={this._selected} list={PeopleList} id={modal}
            multiple={modal === 'invitation'}
          />
        </Modal>
      }
      </View>
    );
    //*/
  }

  componentDidUpdate(prevProps, prevState) {
    let cList = this.state.dataList;
    let pList = ((this.props.route || {}).params || {}).dataList;
    if ( pList && JSON.stringify(pList) !== JSON.stringify(cList) ) {
      this._initState({'dataList': pList}, true);
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _click(e, key, data) {
    let {dataList} = this.state;
    if ( key === 'edit-data' && data ) {
      if ( data.type === 'selection' ) {
        this.setState({'modal': data.name})
      } else {
        this.props.navigation.navigate( data.type, {
          'dataList': JSON.parse(JSON.stringify(dataList)),
          'data'    : JSON.parse(JSON.stringify(data)),
          'back'    : 'desktop'
        });
      }
    }
  }

  _change() {

  }

  _selected( config ) {
    let dataList = JSON.parse( JSON.stringify(this.state.dataList) );
    let data = dataList.find( d => d.name === config.id );
    if ( ! data ) { return; }

    let list = config.list || [], modal = config.id;

    if ( config.id === 'friend' ) {
      data.value = (list[0] || {}).name || '';
      modal = null;
    } else if ( config.id === 'invitation' && config.action === 'save' ) {
      data.description = list.map( (d) => d.name ).join(', ');
    }

    if ( config.action === 'save' || config.action === 'cancel' ) {
      modal = null;
    } 

    this.setState({'dataList': dataList, 'modal': modal});
    return modal === null ? false : true;
  }

  /****************************************************************************
  ****************************************************************************/
  async _initState( props={}, save=false ) {
    let state = {'dataList': ProfileDataList || [], 'key': 'MyProfile'};
    let dataList = props.dataList || (await Storage.get( state.key ));

    if ( dataList instanceof Array ) {
      let pin = dataList.reduce( (p,d) =>{
        p[d.name] = d.value || '';
        return p;
      }, {});

      state.dataList.forEach( (d) => { d.value = pin[d.name] || ''; });

      if ( save ) {
        Storage.set( state.key, state.dataList );
      }
    }

    this.setState( state );
  }
}

const styles = StyleSheet.create({
  'container': {
    'position': 'relative'
  },
  'contentContainer': {
    'paddingTop': 10,
    'paddingBottom': 10
  },
  'collection': {
    'marginBottom': Theme.space.medium,
  },
  'spacing': {
    'marginBottom': Theme.space.medium
  }
});