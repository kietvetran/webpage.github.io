import React from 'react';
import PropTypes from 'prop-types';

export const SuggestionTagbtn = ({id, text, unit, callback, title, type, inputField, value, category, tagBtnAddition, inputName}) => {
  let pin = id || 'auto_' + (new Date()).getTime() + Math.floor((Math.random() * 10000) + 1);
  let tag = 'tag-btn' + (type ? ' '+ type : '') + (category ? ' -has-category -'+category : '');

  // hack for joueny that shall not diplay any link
  let tagAdditionAction = id.match(/ServiceJourney/) ? [] : tagBtnAddition;
  if ( ! title ) { title = [text, unit || ''].join(' ').replace(/\s+/g,''); }

  return (
    <div className={tag} id={pin}>
      { (tagAdditionAction || []).length === 0 || tagAdditionAction.length > 1 || (tagAdditionAction[0].ignorCategory && category && category.match(tagAdditionAction[0].ignorCategory) && tagAdditionAction[0].click ) ?
        <div className="tag-cnt" title={title || ''}>
          <span>{text}</span>
          {unit && <span className="unit-info hide">{' '+unit}</span>}
          { (tagAdditionAction || []).map( (d,i) => {
              if ( d.ignorCategory && category.match(d.ignorCategory) ) { return null; }
              let style = 'icon-btn '+(d.type || '-none');
              let pin = 'suggestion-tag-btn-addition-'+i;
              return typeof(d.click) !== 'function' ? <span key={pin} href="#" className={style} /> :
                <a key={pin} href="#" className={style} onClick={(e)=>{d.click(e,d.key, {'id': id, 'value': value});}} />
          }) }
        </div>
        :
        ( category ? 
          <a href="#" className={'tag-cnt '+ tagAdditionAction[0].type} title={title || ''} onClick={(e)=>{tagAdditionAction[0].click(e,tagAdditionAction[0].key, {'id': id, 'value': value});}}>
            <span>{
              text.match(/^\d+([a-zA-Z\s]+)?\(/) ? text.split(/[\(\)]/).map((t,x) => {
                let v = t.replace( /^\s+/, '').replace( /\s+$/, '');
                return v ? <span className="name-detail" key={pin+'-tag-'+x}>{v}</span> : null
              }) : text
            }
            </span>
            {unit && <span className="unit-info hide">{' '+unit}</span>}
          </a>
          :
          <span href="#" className={'tag-cnt '+ tagAdditionAction[0].type} title={title || ''}>
            <span>{text}</span>
            {unit && <span className="unit-info hide">{' '+unit}</span>}
          </span>
        )
      }
      <a href="#" className="icon-btn -cross -real-small -ex-small-icon-view tag-closer" aria-hidden="true" title="Slett"
         onClick={(e)=>{callback(e, 'remove-suggestion-tabbtn', id)}}></a>
      {(inputField === true || value) && <input name={inputName || 'suggestion'} type="hidden" value={value || id}/>}
    </div>
  );
};

SuggestionTagbtn.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired
};