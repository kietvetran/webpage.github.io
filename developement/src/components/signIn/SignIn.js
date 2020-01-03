import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';

/* action */
//import * as signInActions from '../../actions/signInActions';

/* component */
import { Message } from '../common/util/message/Message';
import { FormContent } from '../common/forminput/FormContent';
import {generateReduxFormValidation, getFormTemplate} from '../common/Function';
import { getFormData } from '../common/General';
import { Loading } from '../common/loading/Loading';
import './SignIn.scss';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      template: getFormTemplate('signin')
    };
    this._submit = this._submit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { history, user } = nextProps;
    if ( user ) {history.push({ pathname: '/deviation' }); }
  }

  //componentWillMount() { this.props.initialize({'username':'kiet@ruter.no', 'password': '4321'}); }

  render() {
    const { template, formData} = this.state;
    const { handleSubmit, actions, signIn} = this.props;

    return <div className="rds-layer-raised -card-spacing signin-wrapper" data-theme="white">
      {(signIn || {}).loading && <Loading />}
      <h1>Logg inn</h1>
      <p className="lead">Ruter produksjonsstøtte monitorering</p>
      <form name="rbForm" ref={(c) => { this.rbForm = c; }} noValidate onSubmit={handleSubmit(this._submit)} onChange={this.formChange} className="form-wrapper">
        <FormContent {...this.props} content={template.content} type={template.type} formData={formData} dispatch={actions.dispatch} name="rbForm" />
        {!!(signIn || {}).wrongCredentials && <div className="input-content"><Message skin="danger" text="Ugyldig bruker" /></div>}

        <ul className="action-holder">
          <li>
            <button type="submit" className="primary-btn">Logg inn</button>
          </li>
          <li>
            <a href="mailto:kiet.ve.tran@ruter.no" className="link">Glemt passord</a>
          </li>
        </ul>
      </form>
    </div>
  }

  /****************************************************************************
  ****************************************************************************/
  _submit( data ) {
    this.props.actions.sendCredentials(data);
  }
}

Signin.propTypes = {
  signIn: PropTypes.shape({}).isRequired,
  //user   : PropTypes.any.isRequired,
  history: PropTypes.shape({}).isRequired,
  actions: PropTypes.shape({}).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired
};

const validate = generateReduxFormValidation(getFormTemplate('signin'));
export default reduxForm({ form: 'rbForm', validate })(Signin);
