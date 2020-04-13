import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {reduxForm, change, getFormValues } from 'redux-form';
import Wizard from '../common/wizard/Wizard';
import { Message } from '../common/util/message/Message';
import {fireEvent} from '../common/General';

import {FormContent} from '../common/forminput/FormContent';
import {generateReduxFormValidation, getFormContentFlatList} from '../common/forminput/util/Function';
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
        const {handleSubmit, values} = this.props;

        return <div ref="wrapper" className="profile-wrapper">
            <Wizard ref="wizard" step="clickable" headerSide={template.wizard} navigate={this._navigate}>
                { (template.content || []).map((cnt, i) => (
                    <Wizard.Step key={'step-'+i} title={cnt.title}>
                        <h2>{cnt.title}</h2>
                        <form name={formName} ref="eikaForm" noValidate className="form-wrapper"
                            onSubmit={this._submit} onChange={this._formChange}
                        >
                            <FormContent content={cnt.content} values={values}/>
                            {!! errors[i] && <Message skin="danger" text={errors[i]}/> }
                        </form>
                    </Wizard.Step>
                    
                )) }
            </Wizard>
        </div>
    }

    componentDidMount() {
        let {template} = this.state, formData = {};
        let list = getFormContentFlatList( template.content );
        list.forEach( (data) => {
            let {name, defaultValue} = data;
            if ( ! name || (!defaultValue && typeof(defaultValue) !== 'number')) {
                return;
            }
            formData[name] = defaultValue;
        });

        this.props.initialize(formData);
    }

    _submit = ( values ) => {
        //console.log('=== SUBMiT ==='); console.log( values );
    }

    _formChange = () => {
        //console.log('=== change.. ==='); console.log( this.props.values );
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
    //console.log('=== CONNECT ==='); console.log( state ); console.log( props );
    return {
        'values': getFormValues((ProfileWizardScheema.formName || 'eikaForm'))(state)
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