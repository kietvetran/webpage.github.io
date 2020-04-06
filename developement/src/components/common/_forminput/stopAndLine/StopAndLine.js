import React from 'react';
import {Suggestion} from '../../suggestion/Suggestion';
import {sortList} from '../../General';
import './StopAndLine.scss';

let moment = require('moment');
export class StopAndLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'selected' : {},
      'timer'    : 0,
      'list'     : this._initSuggestionList( props ) || []
    };

    this._click = this._click.bind(this);
    this._suggestionCallback = this._suggestionCallback.bind(this);
  }

  render() {
    const {list}  = this.state;
    const {label, fieldName, properties} = this.props;
    let source = (properties || {}).source || {};

    return (
      <div className="stop-and-line-wrapper input-content">
        <fieldset>
          <legend className="input-label">{label}</legend>
          <Suggestion list={list} ref="stopAndLineSuggestion" placeholder="Stopp/Linje" callback={this._suggestionCallback}
            maxSearch={10} searchTimer={30} searchKeys={['id','name']} fieldName={fieldName || 'stopAndLine'} fieldStyle="-normal" inputField={true}
            asEnterCharacter=',' ignorInnerTabbing={true} staticFilter={true}
            allowFreeTextTag={source.allowFreeTextTag || false}
          />
        </fieldset>
      </div>
    );
  }

  componentDidMount() {
    let {formData, properties} = this.props, selected = [], pin = {};
    let field = ((properties || {}).source || {}).name || 'lines';

    ((formData || {})[field] ||[]).forEach( (d) => {
      if ( pin[d.id] ) { return; }
      pin[d.id] = d;
      //selected.push({'id': d.id});
      selected.push({'id': d.publicCode, 'name': d.publicCode, 'label': d.publicCode});
    });

    //console.log('=== KIET ==='); console.log( selected );

    if ( selected.length && this.refs.stopAndLineSuggestion ) {
      this.refs.stopAndLineSuggestion.setSelectedList( selected, true, true );
    }
  }

  /****************************************************************************
  ****************************************************************************/
  getReference( key ) {
    return this.refs[key];
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {
    if ( e ) { e.preventDefault(); }
  }

  _suggestionCallback( action, suggestion, recognition ) {
  }

  /****************************************************************************
  ****************************************************************************/
  _initSuggestionList( props ) {
    let {line, properties} = props, list = [];
    let selection = ((properties || {}).source || {}).selection;

    (selection || (line || {}).list || []).forEach((data) => {
      if ( ! data.id ) { return; }
      list.push({...data, 'id': data.id, 'name': data.publicCode, 'unit': data.name});
    });
    return sortList(list, 'name');
  }
}
