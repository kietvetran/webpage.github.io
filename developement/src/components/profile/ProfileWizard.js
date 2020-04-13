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

let scheema = JSON.parse(JSON.stringify(ProfileWizardScheema));

class ProfileWizardComponent extends Component {
    state = {
        'errors'  : [],
        'formName': scheema.formName || 'eikaForm',
        'template': scheema
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
                            <FormContent content={cnt.content} values={values} click={this._click}/>
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

    _click = (e, key, data) => {
        if ( e && typeof(e.preventDefault) === 'function' ) {
            e.preventDefault();
        }

        if ( (data || {}).action === 'add-step' ) {
            this._addStep( data );
        } else if ( (data || {}).action === 'delete-step' ) {
            this._deleteStep( data );
        }
    }

    /**************************************************************************
    **************************************************************************/
    _getCurrentStepContent = ( data ) => {
        let length = scheema.content.length, info = {'titles': {}};

        for ( let i=0; i<length; i++ ) {
            info.titles[scheema.content[i].title] = 1;

            if ( info.currentContent ) { continue; }

            let found = scheema.content[i].content.find( (d) => d.id === data.id );
            if ( ! found ) { continue; }

            info.currentIndex   = i;
            info.currentContent = scheema.content[i];
        }
        return info;
    }

    _addStep = ( data ) => {
        let info = this._getCurrentStepContent( data );
        if ( ! info || ! info.currentContent ) { return; }
    }

    _deleteStep = ( data ) => {

    }
}

//ProfileWizard.propTypes = {
    //'actions'  : PropTypes.shape({}).isRequired
//};

const ProfileWizardConnection = connect((state, props) => {
    //console.log('=== CONNECT ==='); console.log( state ); console.log( props );
    return {
        'values': getFormValues((scheema.formName || 'eikaForm'))(state)
    };
}, (dispatch) => {
    return {
        'dispatch': dispatch
    };
})(ProfileWizardComponent);


const validate = generateReduxFormValidation( scheema );
const ProfileWizard  = reduxForm({
    'form'    : scheema.formName || 'eikaForm',
    'validate': validate
})(ProfileWizardConnection);
export default ProfileWizard;