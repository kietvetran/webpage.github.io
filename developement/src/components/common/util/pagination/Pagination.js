import React from 'react';
/*import { Link } from 'react-router-dom';*/
import './Pagination.scss';

/******************************************************************************
******************************************************************************/
export const Pagination = ({pages, click}) => {
  return (pages || []).length > 0 && typeof(click) === 'function' ?  <ul className="pagination-list">
    { pages.map( (page,i) => {
        let classes = 'secondary-btn page-item -small ' + (page.active ? ' -blue -fill' : '');
        return <li key={'page-navigation-'+i}>
          { page.trancation ? <div className="page-item -trancation" aria-hidden="ture">...</div> :
              <a href="#" role="button" title={'Til side ' + page.name} className={classes} onClick={(e)=>{click(e,'change-page', page)}}>{page.name}</a>
          }
        </li>
    }) }
  </ul> : null;
}
