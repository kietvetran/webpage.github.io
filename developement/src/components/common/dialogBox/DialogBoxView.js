import React from 'react';

import './DialogBox.scss';

export const VehicleInformation = ({source}) => {
  let infoList = [
    {'key': 'vehicleRef',   'label': 'Referanse'},
    {'key': 'fuelType',   'label': 'Drivstoff'},
    {'key': 'dataSource', 'label': 'Datakilde'}
  ];

  return source ? <div className="vehicle-information-wrapper">
    <h1>Kjøretøy informasjon</h1>
    <ul className="vehicle-information-list">
      { infoList.map( (order,i) => {
          return <li className="item-row" key={'vehicle-info-'+i}>
            <div className="item-label">{order.label}</div>
            <div className="item-value">{source[order.key] || '-'}</div>
          </li>
      }) }
    </ul>
  </div>  : <div className="empty">Ingen kjøretøy informasjon</div>
};