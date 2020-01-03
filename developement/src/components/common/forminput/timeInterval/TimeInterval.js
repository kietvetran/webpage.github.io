import React from 'react';
import {Field,change} from 'redux-form';
import Textfield from '../Textfield';
import {Calendar} from '../../calendar/Calendar';
import {convertDateToText, convertTextToDate, generateId} from '../../General';

import './TimeInterval.scss';
//import {Field} from 'redux-form';

let moment = require('moment');

export class TimeInterval extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'clockValue': ''
    };

    this._calendarCallback = this._calendarCallback.bind(this);
  }

  render() {
    const {label, name, min, max, properties} = this.props;
    const data = properties.source;

    return (
      <div title={label} className="rds-form-group input-content -time-interval">
        <Calendar ref="calendar" clock={false} ref="calendar" tabIndex={false} view={2}
          fieldStyle="-normal" legend={label} min={min} max={max} yearNavigation={true}
          placeholder={['fra', 'til']} callback={this._calendarCallback} interval={data.forceInterval || data._default}
        />
        <div className="field-holder">
          <Field id={data.id} name={data.name} label={data.label} type="text"
            autoComplete="off" spellCheck="false" autoCapitalize="off" autoCorrect="off" placeholder={data.placeholder}
            component={Textfield} props={properties}/>
        </div>
      </div>
    );
  }

  /****************************************************************************
  ****************************************************************************/
  _calendarCallback() {
    let {properties, name} = this.props;
    if ( ! properties.formName || ! properties.actions || ! this.refs.calendar ) { return; }

    let interval = this.refs.calendar.getIntervalDate() || [];
    let value = interval[0] && interval[1] ? interval.join(';') : '';
    properties.actions.dispatch(change(properties.formName, name, value));
  }
}
