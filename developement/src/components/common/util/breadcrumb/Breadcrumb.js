import React from 'react';
import './Breadcrumb.scss';

/******************************************************************************
******************************************************************************/
export const Breadcrumb = ({list}) => {
  return (list || []).length > 0 ? <ul className="breadcrumb-list">
    { list.map( (data,i) => {
        return <li key={'breadcrumb-item-'+i}>
          { data.url ? <a href={data.url} className="link breadcrumb-item">{data.name}</a> :
              <div className="breadcrumb-item">{data.name}</div>
          }
        </li>
    }) }
  </ul> : null;
}