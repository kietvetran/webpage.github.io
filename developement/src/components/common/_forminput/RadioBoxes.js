import React from 'react';
import {Field} from 'redux-form';

const RadioBoxes = ({input, meta, ...custom}) => {   // eslint-disable-line no-unused-vars
  let isInvalid = !!((meta.touched || custom.forceTouched) && (meta.error || meta.warning));
  let fieldId = custom.id || 'radioboxes-'+(new Date()).getTime() + '-' + Math.floor((Math.random()*1000) + 1);
  let source = custom.source || {}, labels = source.labels, length = labels.length;
  let values = source.values || [], type = source.type;

  let classes = 'input-content -'+type+' -count-'+length +
    (custom.required ? ' -required' : '') +
    (isInvalid ? ' -invalid' : '') +
    (source.wrapperStyle ? (' '+source.wrapperStyle) : '') +
    (input.value ? (' -selected-'+input.value) : '') +
    (source.popupInfo ? ' -has-popup-info' : '');
  let inputStyle = 'input-radio -'+type + (isInvalid ? ' -invalid': '') + (source.inputStyle ? (' '+source.inputStyle) : '');
  let legend = source.label || custom.legend || source.legend || '';

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

  return (
    <div className={classes}>
      <fieldset>
        {!! legend && <legend className={'input-label'+ (custom.required ? ' -required' : '')}>
            <span>{ legend }</span>
            {!!source.legendNote && <span className="input-label-note"> {source.legendNote}</span>}
          </legend>
        }

        {!! source.description && <div className="input-label-description" dangerouslySetInnerHTML={{'__html': source.description}}></div>}
        {!! source.detailDescription && <BoxExpander content={source.detailDescription} title={legend}/>}

        <div className="input-holder">
          <ul className={'input-'+type+'-list'}>
            { labels.map( (v,i) => {
                let pin = fieldId + '-' + i, value = values[i] || (i === 0 ? 'true' : 'false');
                return <li key={pin}>
                  <Field {...input} {...rest} id={pin} value={value} type="radio" component="input" props={{}} className={inputStyle}/>
                  { v && v.match( /\<[^\>]*\>/) ?
                      <label htmlFor={pin} className='input-label'><span dangerouslySetInnerHTML={{'__html': v}}></span></label>
                      :
                      <label htmlFor={pin} className='input-label'><span>{v}</span></label>
                  }
                </li>
            })}
          </ul>
        </div>
      </fieldset>
      {isInvalid && <div className="input-error-message" role="alert">{meta.error || meta.warning}</div>}
    </div>
  );
};
export default RadioBoxes;