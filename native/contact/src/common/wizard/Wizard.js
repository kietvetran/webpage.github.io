import React, {PureComponent} from 'react';
import { StyleSheet, Text, View, Alert, Animated, Dimensions } from 'react-native';

import FormButton from '../form/FormButton';
import { Theme }  from '../style/Theme.js';


const { width } = Dimensions.get('window');

class Step extends PureComponent {
  state  = {
    'animation': new Animated.Value((this.props.run === 'next' ? width: (this.props.run === 'previous' ? (width*-1) : 0))),
    'animationConfig': {'duration': 250, 'delay': 0, 'toValue': 0}
  };

  render () {
    let {animation} = this.state;
    let {nextStep, prevStep, isLast, finish, children, onChange, values, run} = this.props;

    return (
      <Animated.View style={[styles.stepContainer, {'marginLeft': animation}]}>
        <View style={styles.stepContent}>
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
      </Animated.View>
    );
  }

  componentDidMount() {
    let {animationConfig, animation} = this.state, {run} = this.props;
    if ( run !== 'next' && run !== 'previous' ) { return; }

    Animated.timing( animation, animationConfig ).start();
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

    this.setState({'index': (index + 1), 'run': 'next'});
    //this.setState( prevState => ({'index': (prevState.index + 1) }));
  }

  _prevStep = () => {
    let {index} = this.state, {children} = this.props;
    let length = (children || []).length;
    if ( ! length || index === 0 ) { return; }

    this.setState({'index': (index - 1), 'run': 'previous'});
    //this.setState( prevState => ({'index': (prevState.index - 1) }));
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
    const {index, values, run} = this.state, {children} = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.stepCounter}>{'Step '+ (index+1)+' / '+ children.length}</Text>

        { React.Children.map( children, (element, i) => {
            return index === i ? React.cloneElement( element, {
              'step'    : index,
              'isLast'  : (index === (children.length - 1)),
              'nextStep': this._nextStep,
              'prevStep': this._prevStep,
              'finish'  : this._finish,
              'onChange': this._onChange,
              'values'  : values,
              'run'     : run
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
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'right': 0,
    'bottom': 0
  },
  'stepCounter': {
    'position': 'absolute',
    'top': 10,
    'left': 0,
    'right': 0,
    ...Theme.font.basic,
    'textAlign': 'center',
    'opacity': .5
  },
  'stepContent': {
    'flex':1,
    'width': width,
    'paddingLeft': 10,
    'paddingRight': 10    
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