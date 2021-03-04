import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Speech} from '../common/speech/Speech';
import {Recognition} from '../common/recognition/Recognition';
import {Chart} from '../common/chart/Chart';

import Wizard from '../common/wizard/Wizard';

import './Home.scss';

class Home extends Component {
  static defaultProps = {'mode': {} }

  constructor(props) {
    super(props);
    this.state = {
    };
    this._click  = this._click.bind(this);
  }

  render() {
    return <div className="home-wrapper">
      <h1>Home</h1>
      <ul className="application-list">
        <li className="application-item">
           <Chart data={[
              {'value': 10, 'reverse': true, 'stroke': 30 },
              //{'value': 80, 'step': false},
              //{'value': 80, 'reverse': true, 'strole': 40},
              {'value': 65, 'step': false, 'track': false}
            ]} type="engine" fill={true} concatnation={true}
            xAxis={{'grid': 10, 'text': ['1.jan','2.jan', '3.jan']}}
            yAxis={{'grid': 10, 'separation': 4, 'unit': 'Kr' }}
            legend={[
              {'text': 'top'},
              {'text': 'middle', 'size': '4em', 'dy': '1em', 'color': '#e60000'},
              {'text': 'bottom', 'dy': '3em'},
              {'text': 'En'},
            ]}
          />
        </li>
        <li className="application-item">
          <Speech {...this.props} />
        </li>
        <li className="application-item">
          <Recognition {...this.props} />
        </li>
      </ul>

      <div className="test-content">
        <a href="https://www.eika.no/smartspar/">Https - Smartspar</a>
        <a href="https://www.eika.no/smartspar/?action=settInnPenger">Https - Smartspar - settInnPenger</a>
        <a href="https://www.eika.no/smartspar/settInnPenger">Https - Smartspar - slash settInnPenger</a>

        <hr/>

        <a href="smartspar://home">Smartspar</a>
        <a href="smartspar://home?action=settInnPenger">Smartspar - LG bruker - sett inn penger</a>
        <a href="smartspar://home?action=settInnPenger&isin=NO0010003999&portfolioBaseCode=03290ASK004199">Smartspar - LG bruker - sett inn penger - Eika Aksjesparkonto I  - Eika Spar</a>
        <a href="smartspar://home?action=settInnPenger&isin=NO0010126030&portfolioBaseCode=03290IPS000437">Smartspar - LG user - IPS konto  - Eika Egenkapitalbevis</a>
        <a href="smartspar://home?action=opprettNySparemaal">Smartspar - Ny sparemål - bare spare</a>
        <a href="smartspar://home?action=opprettNySparemaal&category=pension">Smartspar - Ny sparemål - pensjon</a>
      </div>


    </div>
  }

  /****************************************************************************
           <Chart data={[[90,20],[40, 60],[50, 10]]} highest={120} type="bar" fill={true}
            xAxis={{'grid': 10, 'text': ['1.jan','2.jan','3.jan','4.jan']}}
            yAxis={{'grid': 10, 'separation': 4, 'unit': 'Kr' }}
          />
           <Chart data={[20,50,90,40]} highest={120} type="bar" fill={true}
            xAxis={{'grid': 10, 'text': ['1.jan','2.jan','3.jan','4.jan']}}
            yAxis={{'grid': 10, 'separation': 4, 'unit': 'Kr' }}
          />
       <Chart data={40} highest={120} type="progress" fill={true}
            xAxis={{'grid': 10, 'text': ['1.jan','2.jan','3.jan','4.jan']}}
            yAxis={{'grid': 10, 'separation': 4, 'unit': 'Kr' }}
          />
             <Chart data={[{'value':20,'text':'ab'},{'value':50,'text':'abac'},{'value':90,'text':'tran'},{'value':40,'text':'kiret'}]} highest={120} type="pie" fill={true}
            xAxis={{'grid': 10, 'text': ['1.jan','2.jan','3.jan','4.jan']}}
            yAxis={{'grid': 10, 'separation': 4, 'unit': 'Kr' }}
          />
          <Chart data={[[20,50,90,40],[10,80,20,90]]} highest={120} type="line"/>
  ****************************************************************************/
  _click( e, key, data) {
  }
}

Home.propTypes = {
  //'contract' : PropTypes.shape({}).isRequired,
  //'deviation': PropTypes.shape({}).isRequired,
  'actions'  : PropTypes.shape({}).isRequired
};

export default connect((state, props) => {
  return {
    //'deviation': state.deviation
  };
}, null)(Home);