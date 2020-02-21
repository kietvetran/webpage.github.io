import React, {PureComponent} from 'react';
import { StyleSheet, Text, View, Alert, Animated} from 'react-native';

import FormButton from '../form/FormButton';

import {convertTextToDate, convertDateToText} from '../../util/Function';
import { Theme }  from '../style/Theme.js';

class Step extends PureComponent {

  render () {
    let {nextStep, prevStep, isLast, finish, children, onChange, values} = this.props;
    return (
      <View style={styles.stepContainer}>
        <View style={styles.wizardBody}>
          { children({
              'onChange': onChange,
              'values': values
            })
          }
        </View>
        <View style={styles.wizardFooter}>
          { isLast ?
              <FormButton type="primary" title="Finish" styleConfig={{'container': styles.stepButton}} onPress={finish}/>
              :
              <FormButton type="secondary" title="Next" styleConfig={{'container': styles.stepButton}} onPress={nextStep}/>
          }
          <FormButton type="plain" title="Previous" styleConfig={{'container': styles.stepButton}} onPress={prevStep}/>
        </View>
      </View>
    );
  }
};

export default class Wizard extends PureComponent {
  static Step = (props) => <Step {...props}/>;

  state = {
    'index': 0,
    'values': {
      ...this.props.values
    }
  };

  _nextStep = () => {
    let {index} = this.state, {children} = this.props;
    let length = (children || []).length;
    if ( ! length || index === (length - 1) ) { return; }

    this.setState( prevState => ({'index': (prevState.index + 1) }));
  }

  _prevStep = () => {
    let {index} = this.state, {children} = this.props;
    let length = (children || []).length;
    if ( ! length || index === 0 ) { return; }

    this.setState( prevState => ({'index': (prevState.index - 1) }));
  }

  _finish = () => {
    let {values} = this.state, list = [];
    for ( let key in values ) {
      list.push( key + ': ' + (values[key] || '-'));
    }

    console.log('== Finish ==='); console.log( list );
    //Alert.alert('Finish',list.join(', '));
  }

  _onChange = (name, value) => {
    this.setState({'values': {...this.state.values, [name]: value }});
  }

  render() {
    const {index, values} = this.state, {children} = this.props;

    return (
      <View style={styles.container}>
        { React.Children.map( children, (element, i) => {
            return index === i ? React.cloneElement( element, {
              'step'    : index,
              'isLast'  : (index === (children.length - 1)),
              'nextStep': this._nextStep,
              'prevStep': this._prevStep,
              'finish'  : this._finish,
              'onChange': this._onChange,
              'values'  : values
            }) : null;
        }) }
      </View>
    );
  }
};


const styles = StyleSheet.create({
  'container': {
    'flex': 1
  },
  'stepContainer': {
    'flex': 1,
    'paddingLeft': 10,
    'paddingRight': 10,
  },
  'wizardBody': {
    'flex': 1,
    'alignItems': 'stretch',
    'justifyContent': 'center',
 },
  'wizardFooter': {
  },
  'stepButton': {
    'marginTop': 5,
    'marginBottom': 5,
  }
});