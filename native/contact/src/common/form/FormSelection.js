import React from 'react';
import { StyleSheet, Text, ImageBackground, View, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import FormButton from './FormButton';
import FormInput from './FormInput';

import {createRegexp} from "../../util/Function";
import { Theme }  from '../style/Theme.js';

export default class FormSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      ...this._initState( props )
    };
    this._click  = this._click.bind(this);
    this._change = this._change.bind(this);
  }

  render() {
    const {styleConfig={}, multiple} = this.props;
    const {title, search, selected} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.containerHeader}>
          <FormInput labelConfig={{'text': 'Search'}}
            onChangeText={(e)=>{this._change(e,'search');}}
          />
        </View>
        <View style={styles.containerBody}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            { !! selected.list.length && <View style={styles.selectedWrapper}>
                { selected.list.map((data,i) => (
                    <FormButton key={'matched-item-'+i} title={data.name} leftIcon="checked"
                      onPress={()=>{this._click(null,'select-matched-item',data)}}
                    />
                ) )}
              </View>
            }
            <View style={styles.matchedWrapper}>
              { search.matched.map((data,i) => (
                  <FormButton key={'matched-item-'+i} title={data.name} 
                    leftIcon={selected.pin[data.id] ? 'checked': 'blank'}
                    onPress={()=>{this._click(null,'select-matched-item',data)}}
                  />
              ) )}
            </View>
          </ScrollView>
        </View>

        { !! multiple && <View style={styles.containerFooter}>
            <FormButton type="primary" title="Save" styleConfig={{'container': styles.actionButton}}
              onPress={()=>{this._click(null,'save')}}
            />
            <FormButton type="plain" title="Cancel" styleConfig={{'container': styles.actionButton}}
              onPress={()=>{this._click(null,'cancel')}}
            />
          </View>
        }
      </View>
    );        
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {
    if ( key === 'save' ) {
      if ( typeof(this.props.callback) === 'function' ) {
        this.props.callback({'action': 'save', ...this.state.selected, 'id': this.props.id});
      }
    } else if ( key === 'cancel' ) {
      if ( typeof(this.props.callback) === 'function' ) {
        this.props.callback({'action': 'cancel', ...this.state.selected, 'id': this.props.id });
      }
    } else if ( key === 'select-matched-item' ) {
      this._select( data );
    }
  }

  _change(e, key) {
    if ( key === 'search' ) {
      this.setState({'search': {...this.state.search, 'text': e}});
      clearTimeout( this.state.timer.search );
      this.state.timer.search = setTimeout( () => {
        this._search({'text': e});
      }, 300);
    } 
  }

  /****************************************************************************
  ****************************************************************************/
  _select( data ) {
    if ( ! data ) { return; }
    let {id, multiple, callback} = this.props, action = '';
    let selected = JSON.parse(JSON.stringify(this.state.selected));

    if ( selected.pin[data.id] ) {
      delete( selected.pin[data.id] );
      selected.list = selected.list.filter( (d) => d.id !== data.id );
      action = 'remove';
    } else {
      selected.list.push( data );
      selected.pin[data.id] = data;
      action = 'add';
    }

    if (
      typeof(callback) === 'function' &&
      callback({'action': action, ...selected, 'id':id}) === false 
    ) { return; }

    //if ( multiple ) { this.setState({'selected': selected}); }
  }

  _search( config={}, wantOutput ) {
    let {search} = this.state || {};

    let list  = config.list || search.list;
    let length = list.length;
    let text  = config.text    || '';
    let i     = config.stopped || 0;
    let max   = config.view    || search.view || 20;
    let reg   = createRegexp(text.trim(),1,1,3);
    let state = {'matched': []};

    for ( i; i<length; i++ ){
      if ( ! list[i].name.match(reg) ) { continue; } 
      
      state.matched.push( list[i] );
      if ( state.matched.length === max ) {
        state.stopped = i;
        i = length;
      }
    }

    return  wantOutput ? state : this.setState({
      'search': {...search, ...state}
    })
  }

  _initState( props ) {
    let {list, selected, text} = props, state = {
      'timer': {'search': 0},
      'search': {
        'view': 30,
        'list': [],
        'pin' : {}, 
        'matched' : null
      },
      'selected': {
        'list': [],
        'pin' : {}, 
      }
    };

    (list || []).forEach( (data) => {
      if ( ! data.id && ! data.name ) { return; }
      state.search.list.push({...data});
      state.search.pin[data.id] = data;
    });

    (selected instanceof Array ? selected : [selected]).forEach( (note) => {
      if ( ! note ) { return; }
      let data =  typeof(note) === 'string' ? state.search.pin[note] :
        state.search.pin[note.id];
      if ( ! data ) { return; }

      state.selected.list.push( data );
      state.selected.pin[data.id] = data;
    });

    state.search = {...state.search, ...this._search(state.search, true)}
    return state;
  }

  //_setMaxHeight( e ){this.setState({'maxHeight': e.nativeEvent.layout.height});}
  //_setMinHeight( e ){this.setState({'minHeight' : e.nativeEvent.layout.height});}
};

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    //...Theme.debugFixed,
  },
  'contentContainer': {
    'paddingTop': 10,
    'paddingBottom': 10
  },
  'containerHeader': {
    'backgroundColor': '#eee',
    'padding': 10
  },
  'containerBody': {
    'flex': 1,
    'alignItems': 'stretch',
  },
  'containerFooter': {
    'backgroundColor': '#eee',
    'padding': 10
  },
  'actionButton': {
    'marginTop': 5,
    'marginBottom': 5,
  },
  'matchedWrapper': {
    'position': 'relative',
  },
  'selectedWrapper': {
    'position': 'relative', 
    'paddingBottom': 10
  }
});