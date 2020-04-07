import React from 'react';
import {Field} from 'redux-form';
import classNames from 'classnames';
import InputWrapper from './InputWrapper';

const RadioBoxes = ({defaultValue, ...custom}) => {   // eslint-disable-line no-unused-vars
    let {source={}, input={}, meta={}} = custom;

    let type      = 'radio';
    let fieldId   = custom.id || type+'-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
    let isInvalid = !!((meta.touched || custom.forceTouched) &&
        (meta.error || meta.warning));

    let labels = source.labels, length = labels.length;
    let values = source.values || [];
    let legend = custom.legend || source.legend || '';
    let rest = [
        'required','onChange', 'data', 'disabled'
    ].reduce( (prev, key) => {
        if ( ! custom[key] ) { return prev; }

        if ( key === 'onChange' ) {
            prev[key] = ( e ) => {
                input[key]( e );
                custom[key]( e );
            };
        } else {
            prev[key] = custom[key];
        }
        return prev;
    }, {});

    if ( source.detailDescription || source.description ) {
        rest['aria-describedby'] = fieldId + '-description';
    }

    if ( isInvalid ) {
        rest['aria-controls'] = fieldId + '-error';
    }

    let inputStyle = classNames('input-'+type, (source.inputStyle || ''), {
        '-invalid': isInvalid,        
    });

    return <InputWrapper {...custom} fieldId={fieldId} type={type} isInvalid={isInvalid} legend={legend}>
        <ul className="input-radio-list">
            { labels.map( (label,i) => {
                let pin = fieldId + '-' + i, value = values[i] || label;
                return <li key={pin}>
                    <Field {...input} {...rest} id={pin} value={values[i] || label} type="radio" component="input" className={inputStyle}/>
                    <label htmlFor={pin} className='input-label'>{label}</label>
                </li>
            })}
        </ul>
    </InputWrapper>
};

export default RadioBoxes;