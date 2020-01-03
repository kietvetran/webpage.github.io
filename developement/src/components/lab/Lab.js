import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Lab.scss';

class Lab extends Component {
  static defaultProps = {'mode': {} }

  constructor(props) {
    super(props);
    this.state = {
    };
    this._click  = this._click.bind(this);
  }

  render() {
    return <div className="lab-wrapper">
      <h1>Lab</h1>
    </div>
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data) {
  }
}

Lab.propTypes = {
  //'contract' : PropTypes.shape({}).isRequired,
  //'deviation': PropTypes.shape({}).isRequired,
  'actions'  : PropTypes.shape({}).isRequired
};

export default connect((state, props) => {
  return {
    //'deviation': state.deviation
  };
}, null)(Lab);