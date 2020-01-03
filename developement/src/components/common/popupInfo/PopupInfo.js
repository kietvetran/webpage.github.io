import React from 'react';
import {generateId, getClosestParent} from '../General';
import './PopupInfo.scss';

export class PopupInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'id'       : generateId()+'-popup-info',
      'open'     : props.open ? true : false,
      'type'     : props.type || 'info',
      'direction': props.direction || 'right'
    };

    this._click = this._click.bind(this);
    this._clickDocument = this._clickDocument.bind(this);
  }

  render() {
    const {id, open, direction, type} = this.state, {info} = this.props;
    const icon = type.match(/(manual|filter|question|gear)/) ? ('-'+type) : (
      '-information ' + (type == 'error' ? ' -white -static' : '')
    );

    return info ? (
      <div id={id} className={'popup-info-wrapper -'+direction + ' -'+type + (open ? ' -open' : '')}>
        <a href="#" className={'icon-btn -real-small ' + icon + (open ? ' -active' : '')} role="button" onClick={this._click}/>
        <div className="popup-info-widget">
          { info.type == 'affected-variable-defination' ?
              <div className="popup-info-widget-cnt -affected-variable-defination">
                <table>
                  <thead>
                    <tr><th>Variable</th><th>Description</th><th>Example</th><th>Output</th></tr>
                  </thead>
                  <tbody>
                    { info.list.map( (note, i) => {
                        return <tr key={'popup-info-row-'+ i}>
                          <td>{note.id || ''}</td>
                          <td>{note.text || ''}</td>
                          <td>{note.example || ''}</td>
                          <td>
                            {(note.output || []).map((o,j)=> {
                              return <div key={'popup-info-row-'+ i+'-output-'+j} className="info-output">{o}</div>
                            }) }
                          </td>
                        </tr>
                    }) }
                  </tbody>
                </table>
              </div>
            : ( info.type == 'search-field-manual' || info.type == 'option-defination' ?
              <div className={'popup-info-widget-cnt -' +info.type}>
                <table>
                  <thead>
                    <tr><th>Filter string</th><th>Description</th></tr>
                  </thead>
                  <tbody>
                    { info.list.map( (note, i) => {
                        return <tr key={'popup-info-row-'+ i}>
                          <td>{note.example || ''}</td>
                          <td>{note.description || ''}</td>
                        </tr>
                    }) }
                  </tbody>
                </table>
              </div>
              :
              <div className="popup-info-widget-cnt">{info}</div> 
            )
          }
        </div>
      </div>
    ) : null;
  }

  componentDidMount() {
    let {collection} = this.props, {open, id} = this.state;
    if ( open ) {
      collection.documentClickSubscriptions[id] = 1;
      setTimeout( () => { collection.documentClickSubscriptions[id] = this._clickDocument; }, 100);
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e ) {
    if ( e ) { e.preventDefault(); }
    let {collection, verifyClickDocument} = this.props, {open, id} = this.state;

    if ( typeof(verifyClickDocument) === 'function' && verifyClickDocument(e, open) === false ){
      return;
    }

    if ( id && collection && collection.documentClickSubscriptions ) {
      if ( open ) {
        delete( collection.documentClickSubscriptions[id] );
      } else if ( ! collection.documentClickSubscriptions[id] ) {
        collection.documentClickSubscriptions[id] = 1;
        setTimeout( () => { collection.documentClickSubscriptions[id] = this._clickDocument; }, 100);
      }
    }
    this.setState({'open': (! open)});
  }

  _clickDocument( e ) {
    let {collection, verifyClickDocument} = this.props, {id, open} = this.state;
    let target = e.target, parent = getClosestParent( target, '#'+id );

    // hack for form content.
    if ( ! parent ) {
      parent = getClosestParent( target, 'input-label-popup-wrapper' );
    }
    if ( parent ) { return; }


    if ( typeof(verifyClickDocument) === 'function' && verifyClickDocument(e, open) === false ){
      return;
    }

    delete( collection.documentClickSubscriptions[id] );
    this.setState({'open': false});
  }
}
