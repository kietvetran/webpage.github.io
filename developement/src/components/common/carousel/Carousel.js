import React from 'react';
import './Carousel.scss';

/******************************************************************************
******************************************************************************/
export class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this._click = this._click.bind(this);
  }

  render() {
    return <div className="carousel-wrapper">
      <div className="carousel-cnt">

      </div>
    </div>
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {
    if ( e ) { e.preventDefault(); }

    if ( key === 'close' ) {
    }
  }
}