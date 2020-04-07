import React from 'react';
import classNames from 'classnames';
import InputWrapper from './InputWrapper';

const Textarea = ({defaultValue, ...custom}) => {   // eslint-disable-line no-unused-vars
    let {source={}, input={}, meta={}} = custom;

    let type      = 'textarea';
    let fieldId   = custom.id || type+'-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
    let isInvalid = !!((meta.touched || custom.forceTouched) &&
        (meta.error || meta.warning));

    let rest = [
        'placeholder','autoComplete','spellCheck','autoCapitalize','autoCorrect','required',
        'onFocus', 'onKeyUp', 'onKeyDown', 'onBlur', 'onChange', 'data', 'disabled', 'maxLength', 'minLength'
    ].reduce( (prev, key) => {
        if ( ! custom[key] ) { return prev; }

        if ( key === 'onBlur' && custom.required ) {
            prev[key] = ( e ) => {
                input[key]( e );
                custom[key]( e );
            };
        } else if ( input[key] ) {
            prev[key] = ( e ) => {
                input[key]( e );
                custom[key]( e );
            };
        } else {
            prev[key] = custom[key];
        }
        return prev;
    }, {});

    let remain = source.maxLength && source.remainCharacterText ?
        (custom.maxLength - (input.value || '').length) : null;

    if ( source.detailDescription || source.description ) {
        rest['aria-describedby'] = fieldId + '-description';
    }

    if ( isInvalid ) {
        rest['aria-controls'] = fieldId + '-error';
    }

    let inputStyle = classNames(type, (source.inputStyle || ''), {
        '-invalid': isInvalid,        
    });

    return <InputWrapper {...custom} fieldId={fieldId} type={type} isInvalid={isInvalid}>
        <textarea {...input} id={fieldId} aria-invalid={isInvalid} {...rest} className={inputStyle}/>
        {remain !== null && <div className="textarea-remain-character">{source.remainCharacterText + ' ' +remain}</div> }
    </InputWrapper>
};

export default Textarea;