import React from 'react';
import classNames from 'classnames';
import InputWrapper from './InputWrapper';

const Selection = ({defaultValue,...custom}) => {   // eslint-disable-line no-unused-vars
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

/*
const Selection = ({input, meta, ...custom}) => {   // eslint-disable-line no-unused-vars
  let isInvalid = !!((meta.touched || custom.forceTouched) && (meta.error || meta.warning));
  let fieldId = custom.id || 'selection-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
  let source = custom.source || {}, classes = 'input-content -select-box' +
    (custom.required ? ' -required' : '') +
    (isInvalid ? ' -invalid' : '') +
    (source.wrapperStyle ? (' '+source.wrapperStyle) : '');
  let inputStyle = 'select-box -normal' + (isInvalid ? ' -invalid': '')+ (source.inputStyle ? (' '+source.inputStyle) : '');

  let rest = ['required','onChange', 'data', 'disabled'].reduce( (prev, key) => {
    if ( custom[key] ) {
      if ( key === 'onChange' ) {
        prev[key] = ( e ) => {
          input[key]( e );
          custom[key]( e );
        };
      } else {
        prev[key] = custom[key];
      }
    }
    return prev;
  }, {});

  if ( source.detailDescription || source.description ) {
    rest['aria-describedby'] = fieldId + '-description';
  }

  return (
  	<div className={classes}>
      {custom.label && <label htmlFor={fieldId} className={'input-label' + (custom.required ? ' -required' : '')}>
          <span>{ custom.label } </span>
          {!!source.labelNote && <span className="input-label-note">{source.labelNote}</span>}
        </label>
      }
      {!! source.description && <div id={fieldId + '-description'} className="input-label-description" dangerouslySetInnerHTML={{'__html': source.description}}></div>}
      <div className="input-holder">
        <select {...input} id={fieldId} aria-invalid={isInvalid} className={inputStyle} {...rest} >
          { (custom.source.selection || []).map( (data, i) => {
            return <option key={'calendar-hour-'+i} value={data.id}>{data.name}</option>
          }) }
        </select>
      </div>
			{isInvalid && <div className="input-error-message" role="alert">{meta.error || meta.warning}</div>}
	  </div>
	);
};
*/

export default Selection;