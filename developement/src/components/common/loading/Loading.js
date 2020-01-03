import React from 'react';
export const Loading = ({text, type}) => {
  return (
  	<div className={'loading-wrapper ' + (type ? (' -'+type) : '')}>
	    <div className={'loading' + (type ? (' -'+type) : '')}></div>
	    {text ? <div className="loading-text">{text}</div> : null}
	 </div>
  );
};