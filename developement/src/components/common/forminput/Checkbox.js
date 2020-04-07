import React from 'react';
import classNames from 'classnames';
import InputWrapper from './InputWrapper';

const Checkbox = ({defaultValue, ...custom}) => {   // eslint-disable-line no-unused-vars
    let {source={}, input={}, meta={}} = custom;

    let type      = 'checkbox';
    let fieldId   = custom.id || type+'-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
    let isInvalid = !!((meta.touched || custom.forceTouched) &&
        (meta.error || meta.warning));

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
        <input {...input} id={fieldId} type="checkbox" aria-invalid={isInvalid} className={inputStyle} {...rest} />
        {!! custom.label && <label htmlFor={fieldId} className='input-label'>{ custom.label }</label>}
    </InputWrapper>
};

export default Checkbox;