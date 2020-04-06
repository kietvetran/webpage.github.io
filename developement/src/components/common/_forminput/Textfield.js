import React from 'react';

//const Textfield = ({input, meta, defaultValue, input: { value, onChange, onBlur },  ...custom}) => {   // eslint-disable-line no-unused-vars
const Textfield = ({input, meta, defaultValue, ...custom}) => {   // eslint-disable-line no-unused-vars
  let isInvalid = !!((meta.touched || custom.forceTouched) && (meta.error || meta.warning));
  //let value = input.value || '';
  let fieldId = custom.id || 'textfield-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
  let source = custom.source || {}, classes = 'input-content -textfield' +
    (custom.required ? ' -required' : '') +
    (isInvalid ? ' -invalid' : '') +
    (source.wrapperStyle ? (' '+source.wrapperStyle) : '');
  let inputStyle = 'textfield -normal' + (isInvalid ? ' -invalid': '') + (source.inputStyle ? (' '+source.inputStyle) : '');

  let rest = [
    'placeholder','autoComplete','spellCheck','autoCapitalize','autoCorrect','required',
    'onFocus', 'onKeyUp', 'onKeyDown', 'onBlur', 'data', 'disabled', 'maxLength', 'minLength'
  ].reduce( (prev, key) => {
    if ( custom[key] ) {
      if ( key === 'onBlur' && custom.required ) {
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

  //console.log( meta ); console.log( input ); console.log( custom );
  let fieldType = source.type === 'telfield' ? 'tel' : (
    source.type === 'textfield' ? 'text' : source.type
  );

  return (
  	<div className={classes}>
      {custom.label && <label htmlFor={fieldId} className={'input-label' + (custom.required ? ' -required' : '')}>
          <span>{ custom.label }</span>
          {!!source.labelNote && <span className="input-label-note"> {source.labelNote}</span>}
        </label>
      }
      {!! source.description && <div id={fieldId + '-description'} className="input-label-description" dangerouslySetInnerHTML={{'__html': source.description}}></div>}
      <input {...input} id={fieldId} type={fieldType} aria-invalid={isInvalid} {...rest} className={inputStyle}/>
			{isInvalid && <div className="input-error-message" role="alert">{meta.error || meta.warning}</div>}
	  </div>
	);
};

export default Textfield;
