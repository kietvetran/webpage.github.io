import React from 'react';
import PropTypes from 'prop-types';

export const SuggestionTagbtn = ({id, text, unit, callback, title, type, inputField, value, category, inputName, deleteText}) => {
  let pin = id + '_tag_' + (new Date()).getTime() + Math.floor((Math.random() * 10000) + 1);
  let tag = 'tag-btn' + (type ? ' '+ type : '') + (category ? ' -has-category -'+category : '');

  return (
    <div className={tag}>
      <span id={pin} className="tag-cnt" title={title || ''}>
        <span>{text}</span>
        {unit && <span className="unit-info hide">{' '+unit}</span>}
      </span>
      <a role="button" aria-labelledby={pin} href="#" className="icon-btn -cross -small-view tag-closer"
         onClick={(e)=>{callback(e, 'remove-suggestion-tabbtn', id)}}
      ><span className="aria-visible">{deleteText}</span></a>
      {(inputField === true || value) && <input name={inputName || 'suggestion'} type="hidden" value={value || id}/>}
    </div>
  );
};

SuggestionTagbtn.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired
};