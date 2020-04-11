import React from 'react';
import {getFormat} from './util/Function';
import classNames from 'classnames';
import InputWrapper from './InputWrapper';

const Textfield = ({defaultValue, ...custom}) => {   // eslint-disable-line no-unused-vars
    let {source={}, input={}, meta={}} = custom;

    let type      = 'textfield';
    let fieldId   = custom.id || type+'-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
    let isInvalid = !!((meta.touched || custom.forceTouched) &&
        (meta.error || meta.warning));

    let rest = [
        'placeholder','autoComplete','spellCheck','autoCapitalize','autoCorrect','required',
        'onFocus', 'onKeyUp', 'onKeyDown', 'onBlur', 'data', 'disabled', 'maxLength', 'minLength'
    ].reduce( (prev, key) => {
        if ( ! custom[key] ) { return prev; }

        if ( key === 'onBlur' && custom.required ) {
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

    let fieldType = source.type === 'telfield' ? 'tel' : (
        source.type === 'textfield' ? 'text' : source.type
    );

    let inputStyle = classNames(type, (source.inputStyle || ''), {
        '-invalid': isInvalid,        
    });

    let formated = source.format && input.value ?
        getFormat( input.value, source.format ) : '';

    if ( formated && source.unit ) { formated += ' '+source.unit; }

    return <InputWrapper {...custom} fieldId={fieldId} type={type} isInvalid={isInvalid}>
        {   source.format ? <div className={classNames('input-holder', '-'+source.format)}>
                <input {...input} aria-invalid={isInvalid} {...rest} className={inputStyle} id={fieldId} type={fieldType}/>
                <div className={classNames('formated-value', '-'+source.format)}><span>{formated}</span></div>
            </div> : <input {...input} aria-invalid={isInvalid} {...rest} className={inputStyle} id={fieldId} type={fieldType}/>
        }
    </InputWrapper>
};

export default Textfield;