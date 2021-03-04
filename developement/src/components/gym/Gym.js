import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Carousel } from '../common/carousel/Carousel';

import './Gym.scss';

class Gym extends Component {
  static defaultProps = {'mode': {} }

  constructor(props) {
    super(props);
    this.state  = {};
    this._click = this._click.bind(this);
  }

  render() {
    return <div className="gym-wrapper">
      <h1>Gym</h1>
      <Carousel />
    </div>
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data) {
    if ( e ) { e.preventDefault(); }
  }


  /****************************************************************************
  ****************************************************************************/
  _calendarCallback( note ) {
  }

  _suggestionCallback( action, suggestion, recognition ) {
  }
}

Gym.propTypes = {
  'actions'  : PropTypes.shape({}).isRequired
};

export default connect((state, props) => {
  return {
    //'deviation': state.deviation
  };
}, null)(Gym);