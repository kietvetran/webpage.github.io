import React from 'react';
import classNames from 'classnames';
import InputWrapper from './InputWrapper';

const SelectBox = ({defaultValue,...custom}) => {   // eslint-disable-line no-unused-vars
    let {source={}, input={}, meta={}} = custom;

    let type      = 'select-box';
    let fieldId   = custom.id || type+'-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
    let isInvalid = !!((meta.touched || custom.forceTouched) &&
        (meta.error || meta.warning));

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

    let fieldType = source.type === 'telfield' ? 'tel' : (
        source.type === 'textfield' ? 'text' : source.type
    );

    let inputStyle = classNames(type, '-normal', (source.inputStyle || ''), {
        '-invalid': isInvalid,        
    });

    return <InputWrapper {...custom} fieldId={fieldId} type={type} isInvalid={isInvalid}>
        <select {...input} id={fieldId} aria-invalid={isInvalid} className={inputStyle} {...rest} >
          { (custom.source.selection || []).map( (data, i) => {
            return <option key={'select-option-'+i} value={data.id}>{data.name}</option>
          }) }
        </select>
    </InputWrapper>
};

export default SelectBox;