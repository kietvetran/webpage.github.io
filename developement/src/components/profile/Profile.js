import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {reduxForm, change} from 'redux-form';
import Wizard from '../common/wizard/Wizard';
import { Message } from '../common/util/message/Message';

import {FormContent} from '../common/forminput/FormContent';
import {generateReduxFormValidation} from '../common/forminput/util/Function';
import { ProfileScheema } from './ProfileScheema';
import './Profile.scss';

class ProfileComponent extends Component {
    //static defaultProps = {'mode': {} }
    state = {
        'error': '',
        'formName': ProfileScheema.formName || 'eikaForm',
        'template': JSON.parse(JSON.stringify(ProfileScheema))
    }

    render() {
        const {formName, template, error} = this.state;
        const {handleSubmit} = this.props;

        return <div className="profile-wrapper">
            <form name={formName} ref="eikaForm" noValidate className="form-wrapper"
                onSubmit={handleSubmit(this._submit)} onChange={this._formChange}                
            >
                <FormContent content={template.content}/>

                { !! error && <Message skin="info" text={error}/> }

                <div className="action-row">
                    <div>
                        <button onClick={(e)=>{this._click(e,'submit');}} type="submit" className="primary-btn">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    }

    _submit = ( values ) => {
        console.log('=== SUBMiT ===');
        console.log( values );
    }

    _formChange = () => {
        //console.log('=== change.. ===');
    }

    _click = (e, key) => {
        //if ( e && e.preventDefault ) { e.preventDefault(); }
        if ( key === 'submit' ) {
            if ( this.props.invalid ) {
                this.setState({'error': 'Form has error.'});
            } else if ( this.state.error ) {
                this.setState({'error': ''});                
            }
        }
    }

}

//Profile.propTypes = {
    //'actions'  : PropTypes.shape({}).isRequired
//};

const ProfileConnection = connect((state, props) => {
    console.log('=== CONNECT ===');
    return {
        //'deviation': state.deviation
    };
}, (dispatch) => {
    return {
        'dispatch': dispatch
    };
})(ProfileComponent);


const validate = generateReduxFormValidation( ProfileScheema );
const Profile  = reduxForm({
    'form'    : ProfileScheema.formName || 'eikaForm',
    'validate': validate
})(ProfileConnection);
export default Profile;