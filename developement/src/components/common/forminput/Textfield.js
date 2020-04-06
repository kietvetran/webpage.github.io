import React from 'react';
import classNames from 'classnames';

const Textfield = ({input, meta, defaultValue, ...custom}) => {   // eslint-disable-line no-unused-vars
    let isInvalid = !!((meta.touched || custom.forceTouched) &&
        (meta.error || meta.warning));

    let fieldId = custom.id || 'textfield-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
    let source  = custom.source || {};
    let wrapperStyle = classNames('input-content', '-textfield', (source.wrapperStyle || ''), {
        '-required': custom.required || false,
        '-invalid' : isInvalid,
    });

    let inputStyle = classNames('textfield', '-normal', (source.inputStyle || ''), {
        '-invalid': isInvalid,        
    });

    let labelStyle = classNames('input-label', {'-required' : custom.required || false});

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

    return <div role="region" className={wrapperStyle}>
        {!! custom.label && <label htmlFor={fieldId} className={labelStyle}>
                <span>{ custom.label }</span>
                {!!source.labelNote && <span className="input-label-note"> {source.labelNote}</span>}
            </label>
        }

        {!! source.description &&
            <div id={fieldId + '-description'} className="input-label-description" dangerouslySetInnerHTML={{'__html': source.description}}></div>
        }
        <input {...input} aria-invalid={isInvalid} {...rest} className={inputStyle} id={fieldId} type={fieldType}/>
        {isInvalid && <div id={fieldId + '-error'} className="input-error-message" aria-live="polite">{meta.error || meta.warning}</div>}
	  </div>
};

export default Textfield;
