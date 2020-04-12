import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {reduxForm, change} from 'redux-form';
import Wizard from '../common/wizard/Wizard';
import { Message } from '../common/util/message/Message';
import {fireEvent} from '../common/General';

import {FormContent} from '../common/forminput/FormContent';
import {generateReduxFormValidation} from '../common/forminput/util/Function';
import { ProfileWizardScheema } from './ProfileWizardScheema';

import './Profile.scss';

class ProfileWizardComponent extends Component {
    state = {
        'errors'  : [],
        'formName': ProfileWizardScheema.formName || 'eikaForm',
        'template': JSON.parse(JSON.stringify(ProfileWizardScheema))
    }

    render() {
        const {formName, template, errors} = this.state;
        const {handleSubmit} = this.props;

        return <div ref="wrapper" className="profile-wrapper">
            <Wizard ref="wizard" step="clickable" headerSide={template.wizard} navigate={this._navigate}>
                { (template.content || []).map((cnt, i) => (
                    <Wizard.Step key={'step-'+i} title={cnt.title}>
                        <h2>{cnt.title}</h2>
                        <form name={formName} ref="eikaForm" noValidate className="form-wrapper"
                            onSubmit={this._submit} onChange={this._formChange}                
                        >
                            <FormContent content={cnt.content}/>
                            {!! errors[i] && <Message skin="danger" text={errors[i]}/> }
                        </form>
                    </Wizard.Step>
                    
                )) }
            </Wizard>
        </div>
    }

    _submit = ( values ) => {
        console.log('=== SUBMiT ==='); console.log( values );
    }

    _formChange = () => {
        //console.log('=== change.. ===');
    }

    _navigate = ( config ) => {
        let {valid} = this.props;
        let errors  = JSON.parse(JSON.stringify(this.state.errors));
        if ( valid ) {
            errors[config.current] = '';
        } else {
            errors[config.current] = 'There is some error.';
            this._triggerFormInputError();
        }
        this.setState({'errors': errors});
        return valid;
    }

    _triggerFormInputError = () => {
        let selector = 'input, select, textarea';
        let elements = this.refs.eikaForm.querySelectorAll( selector );
        for ( let i = 0; i < elements.length; ++i ) {
            fireEvent( elements[i], 'blur' );
        }
    }
}

//ProfileWizard.propTypes = {
    //'actions'  : PropTypes.shape({}).isRequired
//};

const ProfileWizardConnection = connect((state, props) => {
    return {
        //'deviation': state.deviation
    };
}, (dispatch) => {
    return {
        'dispatch': dispatch
    };
})(ProfileWizardComponent);


const validate = generateReduxFormValidation( ProfileWizardScheema );
const ProfileWizard  = reduxForm({
    'form'    : ProfileWizardScheema.formName || 'eikaForm',
    'validate': validate
})(ProfileWizardConnection);
export default ProfileWizard;