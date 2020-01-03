import React from 'react';
import {Field,change} from 'redux-form';
import {getOffset, clearSelection, getParentScroll} from '../General';
import Textfield from './Textfield';

export class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 'started': null, 'interval': [0,100], 'timer': 0, 'vertical': props.vertical ? true : false};
    this._click     = this._click.bind(this);
    this._downStart = this._downStart.bind(this);
    this._downEnd   = this._downEnd.bind(this);
    this._downMove  = this._downMove.bind(this);

    this._moveIn   = this._moveIn.bind(this);
    this._moveOut   = this._moveOut.bind(this);
    this._keyup     = this._keyup.bind(this);
  }

  render() {
    let {data, properties} = this.props, {interval,vertical} = this.state;

    return (
      <div className={'input-content -slider' + (data.wrapperStyle ? ' '+data.wrapperStyle : '') + (vertical ? ' -vertical' : ' -horizontal')}>
        { ! vertical &&
          <Field id={data.id} name={data.name} label={data.label}
            autoComplete="off" spellCheck="false" autoCapitalize="off" autoCorrect="off" placeholder={data.placeholder}
            component={Textfield} props={{'onKeyUp': this._keyup, ...properties}}/>
        }
        <div ref="wrapper" role="application" className="slider-wrapper" onMouseMove={this._downMove} onMouseOut={this._moveOut} onMouseEnter={this._moveIn}>
          <div className="slider-track" onMouseEnter={this._moveIn}>
            <span role="slider" className="slider-btn" aria-valuenow={'0'} aria-valuemax={interval[1]+''} aria-valuemin={interval[0]+''}
              onMouseDown={this._downStart}  onMouseUp={this._downEnd} onMouseEnter={this._moveIn}
            >{'0'}</span>
            <span className="slider-tail" onMouseEnter={this._moveIn}></span>
          </div>
        </div>
        { !! vertical &&
          <Field id={data.id} name={data.name} label={data.label}
            autoComplete="off" spellCheck="false" autoCapitalize="off" autoCorrect="off" placeholder={data.placeholder}
            component={Textfield} props={{'onKeyUp': this._keyup, ...properties}}/>
        }
      </div>
    );
  }

  componentDidMount() {
    let {data} = this.props, field = data.id ? document.getElementById( data.id ) : null;
    if ( field ) {
      let number = parseInt( field.value );
      if ( ! isNaN(number) ) { this._updateSlider( null, number ); }
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {
    if ( e ) { e.preventDefault(); }
    if ( key && data ) {
    }
  }

  _downStart( e ) {
    this.setState({'started': [e.clientX, e.clientY]});
  }

  _downMove( e ) {
    clearSelection();
    let {started} = this.state, {data} = this.props;
    if ( ! started ) { return; }

    let value = this._updateSlider([e.clientX, e.clientY]);
    if ( this.props.dispatch && this.props.name && data.name ) {
      this.props.dispatch(change(this.props.name, data.name, (value || '') ));
    }
  }

  _downEnd() {
    this.setState({'started': null});
  }

  _moveOut() {
    if ( ! this.state.started ) { return; }
    clearTimeout( this.state.timer || 0 );
    this.state.timer = setTimeout( () => {
      this.setState({'started': null});
    }, 300);
    /*
    let point  = [e.clientX, e.clientY], wrapper = this.refs.wrapper;
    if ( ! wrapper || ! this.state.started ) { return; }
    let offset = getOffset(wrapper), size = [wrapper.clientWidth, wrapper.clientHeight];
    let area = {'left': offset[0], 'top': offset[1], 'right': (offset[0]+size[0]), 'bottom': (offset[1]+size[1]) };
    if (!  isPointWrappedInArea(area,point) ) {
      console.log('=== OUT==');
      console.log( area );
      console.log( point );

      this.setState({'started': null});
    }
    */
  }

  _moveIn() {
    clearTimeout( this.state.timer || 0 );
  }

  _keyup(e) {
    let target = e.currentTarget, value = target.value;
    let number = parseInt( value );
    if ( isNaN(number) ) { return; }
    this._updateSlider( null, number );
  }

  /****************************************************************************
  ****************************************************************************/
  _updateSlider( point, move ) {
    if ( ! this.refs.wrapper ) { return; }
    let {interval,vertical} = this.state;
    let wrapper = this.refs.wrapper, track = wrapper.children[0];
    let btn = track.children[0], tail = track.children[1];
    let info = {
      'offset': getOffset( track ),
      'point' : point,
      'size'  : [track.clientWidth, track.clientHeight],
      'scrolled': vertical ? getParentScroll( wrapper ) : [0,0]
    };

    info.move = typeof(move) === 'number' ? move : ( vertical ?
      (((info.point[1] - (info.offset[1] - info.scrolled[1])) * 100) / info.size[1]) :
      (((info.point[0] - info.offset[0]) * 100) / info.size[0])
    );

    if ( info.move < interval[0]      ) { info.move = interval[0]; }
    else if ( info.move > interval[1] ) { info.move = interval[1]; }

    info.move = parseInt((info.move+''));

    if ( vertical ) {
      btn.style.top     = info.move+'%';
      tail.style.height = info.move+'%';
    } else {
      btn.style.left   = info.move+'%';
      tail.style.width = info.move+'%';
    }
    return info.move;
  }
}