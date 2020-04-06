import React from 'react';
import {Field} from 'redux-form';

const Filefield = ({input, meta, ...custom}) => {   // eslint-disable-line no-unused-vars
  let isInvalid = !!((meta.touched || custom.forceTouched) && (meta.error || meta.warning));
  let fieldId = custom.id || 'filefield-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
  let source = custom.source || {}, classes = 'input-content -filefield' +
    (custom.required ? ' -required' : '') +
    (isInvalid ? ' -invalid' : '') +
    (source.wrapperStyle ? (' '+source.wrapperStyle) : '')+
    (input.value ? ' -has-value' : '');
  let inputStyle = 'input-filefield ' + (isInvalid ? ' -invalid': '') + (source.inputStyle ? (' '+source.inputStyle) : '');
  let legend = custom.legend || source.legend || '';
  let label  = 'kiet';

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
        {!! source.description && <div id={fieldId + '-description'} className="input-label-description" dangerouslySetInnerHTML={{'__html':source.description}}></div>}
        <div className="input-holder">
          <Field {...input} {...rest} id={fieldId} component="input" type="file" className={inputStyle} />
          {!! label && <label htmlFor={fieldId} className='input-label'>
            <span>{ label }</span>
            <span>{((input.value || [])[0] || {}).name }</span>
          </label>}
          { ((input.value || [])[0] || {}).name && typeof(custom.onClick) === 'function' &&
            <button type="button" className="file-remover icon-btn -cross -ex-small-icon-view"
              onClick={(e)=>{custom.onClick(e,'remove-uploaded-file', input, fieldId);}}
            ><span className="aria-visible">Remov uploaded file</span></button>
          }
        </div>
      </fieldset>
			{isInvalid && <div className="input-error-message" role="alert">{meta.error || meta.warning}</div>}
	  </div>
	);
};

export default Filefield;