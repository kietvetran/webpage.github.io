import React from 'react';
import {PopupInfo} from '../popupInfo/PopupInfo';

const Textarea = ({input, meta, defaultValue, ...custom}) => {   // eslint-disable-line no-unused-vars
  let isInvalid = !!((meta.touched || custom.forceTouched) && (meta.error || meta.warning));
  let fieldId = custom.id || 'textarea-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
  let source = custom.source || {}, classes = 'input-content -textarea' +
    (custom.required ? ' -required' : '') +
    (isInvalid ? ' -invalid' : '') +
    (source.wrapperStyle ? (' '+source.wrapperStyle) : '');
  let inputStyle = 'textarea' + (isInvalid ? ' -invalid': '') + (source.inputStyle ? (' '+source.inputStyle) : '');

  let rest = [
    'placeholder','autoComplete','spellCheck','autoCapitalize','autoCorrect','required',
    'onFocus', 'onKeyUp', 'onKeyDown', 'onBlur', 'onChange', 'data', 'disabled', 'maxLength', 'minLength'
  ].reduce( (prev, key) => {
    if ( custom[key] ) {
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
    }
    return prev;
  }, {});

  let remain = source.maxLength && source.remainCharacterText ?
    (custom.maxLength - (input.value || '').length) : null;

  if ( source.detailDescription || source.description ) {
    rest['aria-describedby'] = fieldId + '-description';
  }


  return (
  	<div className={classes}>
      {custom.label && source.popupInfo ? (
          <div className="input-label-popup-wrapper">
            <div>
              <label htmlFor={fieldId} className={'input-label' + (custom.required ? ' -required' : '')}>
                <span>{ custom.label } </span>
                {!!source.labelNote && <span className="input-label-note">{source.labelNote}</span>}
              </label>
              <PopupInfo info={source.popupInfo} collection={custom.appCollection} tabIndex={false}/>
            </div>
          </div>
        ) : (custom.label ? <label htmlFor={fieldId} className={'input-label' + (custom.required ? ' -required' : '')}>
            <span>{ custom.label } </span>
            {!!source.labelNote && <span className="input-label-note">{source.labelNote}</span>}
          </label>
        : null )
      }

      {!! source.description && <div id={fieldId + '-description'} className="input-label-description" dangerouslySetInnerHTML={{'__html': source.description}}></div>}
      <textarea {...input} id={fieldId} aria-invalid={isInvalid} {...rest} className={inputStyle}/>
      {remain !== null && <div className="textarea-remain-character">{source.remainCharacterText + ' ' +remain}</div> }
			{isInvalid && <div className="input-error-message" role="alert">{meta.error || meta.warning}</div>}
      {source.autoVerticle && <div id={fieldId+'-autoVerticle'} className="auto-verticle-holder"/>}
	  </div>
	);
};

export default Textarea;
