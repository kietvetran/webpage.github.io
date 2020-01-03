import React from 'react';
/*import { Link } from 'react-router-dom';*/
import './Message.scss';

/******************************************************************************
******************************************************************************/
export const Message = ({skin, text, title}) => {
  return <div className={'message-wrapper' + (skin ? (' -'+skin) : ' -info')}>
    { !! title && <div className="h2">{title}</div> }
    { !! text && <div className="">{text}</div>}
  </div>
}
