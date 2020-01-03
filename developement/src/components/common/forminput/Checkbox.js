import React from 'react';
const Checkbox = ({input, meta, ...custom}) => {   // eslint-disable-line no-unused-vars
  let isInvalid = !!((meta.touched || custom.forceTouched) && (meta.error || meta.warning));
  let fieldId = custom.id || 'checkbox-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
  let source = custom.source || {}, classes = 'input-content -checkbox' +
    (custom.required ? ' -required' : '') +
    (isInvalid ? ' -invalid' : '') +
    (source.wrapperStyle ? (' '+source.wrapperStyle) : '')+
    (input.checked ? ' -is-checked' : '');
  let inputStyle = 'input-checkbox ' + (isInvalid ? ' -invalid': '') + (source.inputStyle ? (' '+source.inputStyle) : '');
  let legend = custom.legend || source.legend || '';

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
      <fieldset>
        {!! legend && <legend className={'input-label'+ (custom.required ? ' -required' : '')}>
            <span>{ legend }</span>
            {!!source.legendNote && <span className="input-label-note"> {source.legendNote}</span>}
          </legend>
        }
        <div className="input-holder">
          <input {...input} id={fieldId} type="checkbox" aria-invalid={isInvalid} className={inputStyle} {...rest} />
          {!! custom.label && <label htmlFor={fieldId} className='input-label'><span>{ custom.label }</span></label>}
          {!! source.description && <div id={fieldId + '-description'} className="input-label-description" dangerouslySetInnerHTML={{'__html':source.description}}></div>}

        </div>
      </fieldset>
			{isInvalid && <div className="input-error-message" role="alert">{meta.error || meta.warning}</div>}
	  </div>
	);
};

export default Checkbox;