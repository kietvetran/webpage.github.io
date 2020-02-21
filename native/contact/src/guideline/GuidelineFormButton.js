import React from 'react';
import { Platform, StyleSheet, Text, View, Alert, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import FormButton from '../common/form/FormButton';

import { Theme }  from '../common/style/Theme.js';

export default class GuidelineFormInput extends React.Component {
  constructor(props) {
    super(props);
    this.state   = {
      'list': [
        { 
          'name': 'Form button',
          'list': [
            {'type': 'primary',   'title': 'primary'},
            {'type': 'secondary', 'title': 'secondary'},
            {'type': 'plain',     'title': 'plain'},
          ]
        }, { 
          'name': 'Action button',
          'list': [
            {'type': 'edit', 'title': 'Name', 'value': 'Kiet Ve Tran', 'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tincidunt elit ac dolor tempus vulputate et commodo metus.'},
          ]
        }, { 
          'name': 'Icon',
          'list': [
            [
              {'type': 'brand'},
              {'type': 'search'},
              {'type': 'phone'},
              {'type': 'sms'},
              {'type': 'email'},
              {'type': 'filter'},
            ], [
              {'type': 'arrowLeft'},
              {'type': 'arrowRight'},
              {'type': 'arrowDown'},
              {'type': 'arrowUp'}
            ]
          ]
        },
      ]
    };
  } 

  render() {
    const {list} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          { list.map( (collection, i) => (
              <View key={'collection-'+i} style={styles.collection}>
                <Text style={styles.collectionTitle}>{collection.name}</Text>
                { collection.list[0] instanceof Array ? <React.Fragment>                                    
                    { collection.list.map( (note,x) =>(
                        <View key={'collection-row-'+i+'-'+x} style={styles.collectionRow}>
                          { note.map( (data,j) =>(
                              <FormButton key={'button-'+i+'-'+x+'-'+j}
                                type={data.type} title={data.title} value={data.value} description={data.description} styleConfig={{'container': styles.spacing}}
                              />
                          ) )}
                        </View>
                    ) )}
                  </React.Fragment> : <React.Fragment>
                    { collection.list.map( (data,j) =>(
                        <FormButton key={'button-'+i+'-'+j}
                          type={data.type} title={data.title} value={data.value} description={data.description} styleConfig={{'container': styles.spacing}}
                        />
                    ) )}
                  </React.Fragment>
                }
              </View> 
          ) )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  'container': {
    'position': 'relative',
  },
  'contentContainer': {
    'paddingTop': 10,
    'paddingBottom': 10
  },
  'collection': {
    'marginBottom': Theme.space.medium,
    'backgroundColor': '#fff',
    'padding': Theme.space.medium,
    ...Theme.shadow.level1
  },
  'collectionRow': {
    'flex': 1,
    'flexDirection': 'row'
  },
  'collectionTitle': {
    ...Theme.font.h2,
    'backgroundColor': Theme.color.appBg,
    'padding': Theme.space.small,
    'paddingTop': 0,
    'marginBottom': Theme.space.medium
  },
  'spacing': {
    'marginBottom': Theme.space.medium
  }
});