import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {reduxForm, change} from 'redux-form';
import Wizard from '../common/wizard/Wizard';

import {FormContent} from '../common/forminput/FormContent';
import {generateReduxFormValidation} from '../common/Function';
import { ProfileScheema } from './ProfileScheema';
import './Profile.scss';

class ProfileComponent extends Component {
    //static defaultProps = {'mode': {} }
    state = {
        'formName': ProfileScheema.formName || 'eikaForm',
        'template': JSON.parse(JSON.stringify(ProfileScheema))
    }

    render() {
        const {formName, template} = this.state;
        const {handleSubmit, dispatch, storage, params, noLayoutOuterStyle, animation, location} = this.props;

        return <div className="profile-wrapper">
            <form name={formName} ref="eikaForm" noValidate className="form-wrapper"
                onSubmit={handleSubmit(this._submit)} onChange={this._formChange}                
            >
                <FormContent content={template.content} />

                <div className="action-row">
                    <div>
                        <button type="submit" className="primary-btn">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    }

    _submit = ( values ) => {
        console.log('=== SUBMiT ==='); console.log( values );
    }

    _formChange = () => {
        //console.log('=== change.. ===');
    }
}

//Profile.propTypes = {
    //'actions'  : PropTypes.shape({}).isRequired
//};

const ProfileConnection = connect((state, props) => {
    return {
        //'deviation': state.deviation
    };
}, null)(ProfileComponent);


const validate = generateReduxFormValidation( ProfileScheema );
const Profile  = reduxForm({
    'form'    : ProfileScheema.formName || 'eikaForm',
    'validate': validate
})(ProfileConnection);
export default Profile;