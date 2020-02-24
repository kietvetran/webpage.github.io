import React, {PureComponent} from 'react';
import { StyleSheet, Text, View, Alert, Animated, Dimensions } from 'react-native';

import FormButton from '../form/FormButton';
import { Theme }  from '../style/Theme.js';

const { width } = Dimensions.get('window');

class Step extends PureComponent {
  state  = {
    'animation': new Animated.Value((this.props.run === 'next' ? width: (this.props.run === 'previous' ? (width*-1) : 0))),
    'animationConfig': {'duration': 200, 'delay': 0, 'toValue': 0}
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

  constructor(props) {
    super(props);
    this.state = {...this._initState( props ) };

    this._click    = this._click.bind(this);
    this._nextStep = this._nextStep.bind(this);
    this._prevStep = this._prevStep.bind(this);
    this._finish   = this._finish.bind(this);
    this._navigate = this._navigate.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  render() {
    const {children} = this.props;
    const {index, values, step, run} = this.state; 

    return (
      <View style={styles.container}>
        { step === 'counting' && <Text style={styles.stepCounter}>{'Step '+ (index+1)+' / '+ children.length}</Text> }
        { step instanceof Array && <React.Fragment>
            { step.map( (data,i) => (
                <FormButton key={'step-button-'+i} type={ i===index ? 'secondary' : 'plain'} title={data.step}
                  onPress={()=>{this._click(null,'navigate', data)}}
                  styleConfig={{'container': {'left': data.left, 'width': data.size, 'position':'absolute', 'top': 10, 'zIndex':10}}}
                />
            ) )}
          </React.Fragment>
        }

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

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {
    if ( key === 'navigate' && data ) {
      this._navigate( data.index );
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _nextStep() {
    this._navigate(null, 'next');
  }

  _prevStep() {
    this._navigate(null, 'previous');
  }

  _finish(){
    let {values} = this.state, list = [];
    for ( let key in values ) {
      list.push( key + ': ' + (values[key] || '-'));
    }

    console.log('== Finish ==='); console.log( list );
    //Alert.alert('Finish',list.join(', '));
  }

  _navigate( i, run ) {
    let {index} = this.state, {children} = this.props;
    let length = (children || []).length;
    if ( ! length ) { return; }

    if ( isNaN(i) || (!i && i !== 0) ) {
      if ( run !== 'next' && run !== 'previous'         ) { return; }
      if ( run === 'next'     && index === (length - 1) ) { return; }
      if ( run === 'previous' && index === 0            ) { return; }
      i = index + (run === 'next' ? 1 : -1);
    }

    if ( i < 0 || i >= length || i === index ) { return; }

    if ( ! run ) { run = i > index ? 'next' : 'previous'; }

    this.setState({'index': i, 'run': run});
  }

  _onChange( name, value ) {
    this.setState({'values': {...this.state.values, [name]: value }});
  }

  /****************************************************************************
  ****************************************************************************/
  _initState( props ) {
    let {values={}, step, children} = props, state = {
      'index': 0,
      'values': {...values},
      'step'  : step === 'counting' ? 'counting' : null
    };

    if ( step === 'clickable' && (children || []).length ) {
      state.step = [];
      let length = children.length, size = 42, gap = 10, maxSpace = 30;
      let space = (width - (size * length) - (gap * 2)) / (length - 1);

      if ( space > maxSpace ) {
        space = maxSpace;
        gap =  (width - (size * length) - (space * (length-1))) / 2
      }

      for ( let i=0; i<(children || []).length; i++ ) {
        state.step.push({
          'step' : (i+1)+'',
          'size' : size,
          'index': i,
          'left' : i === 0 ? gap : (state.step[(i-1)].left + (size + space))   
        })
      }
    }

    return state;
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