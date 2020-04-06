import React from 'react';
import {Suggestion} from '../../suggestion/Suggestion';
import {sortList} from '../../General';
import './EarlyDepartureExclusion.scss';

export class EarlyDepartureExclusion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'selected' : [],
      'lineQuays': JSON.parse( JSON.stringify((props.formData || {}).lineQuays || {}) )
    };

    this.state.storage = this._initStorage( props, this.state.lineQuays ) || [];

    this._click = this._click.bind(this);
    this._suggestionCallback = this._suggestionCallback.bind(this);
  }

  componentWillMount() {
    let {formData, properties} = this.props, {storage, selected} = this.state;

    let index = 0;
    ((formData || {}).earlydepartureExclusionView ||[]).forEach( (d) => {
      if ( ! (d.suggestion || []).length || ! d.suggestion[0] || ! d.suggestion[0].id ) { return; }

      storage.list[index]      = {};
      storage.list[index].id   = d.suggestion[0].id;
      storage.list[index].line = JSON.parse(JSON.stringify(d.suggestion[0]) );
      if ( ! storage.list[index].line.name ) {
        storage.list[index].line.name = storage.list[index].line.id || storage.list[index].id;
      }

      index++;
      selected.push( d.suggestion );
    });


    if ( index > 0 ) {
      this.state.storage = this._updateStorageOptionList( storage );
    }
  }


  render() {
    const {storage}  = this.state;
    const {label, fieldName, properties} = this.props;
    let source = (properties || {}).source || {};
    return (
      <div className="early-depature-exclusion-wrapper">
        <fieldset>
          <legend className="input-label">{label}</legend>
          { storage.loading ? <div className="loading"></div> : <div className="suggestion-list-holder">
              {storage.list.map( (info, i) => {
                return <div key={'early-depature-exclusion-suggestion-'+i}>
                  <Suggestion list={info.optionList || []} ref={'suggestion'+i} placeholder="" callback={(a,s,c)=>{ return this._suggestionCallback(a,s,c,i);}}
                    maxSearch={10} searchTimer={30} searchKeys={['id','name']} fieldStyle="-normal" inputField={true} matchStart={true}
                    ignorInnerTabbing={true} staticFilter={true} fieldName={source.name || 'earlyDepartureExclusion'} dynamicOptionList={true}
                  />            
                </div>
              }) }
              <div className="early-depature-exclusion-tool-row">
                <button className="secondary-btn -blue" onClick={(e)=>{this._click(e,'add-exclusion-row')}}>Legg til</button>
              </div>
            </div>
          }
        </fieldset>        
      </div>
    );
  }

  componentDidMount() {
    let {selected, storage} = this.state;
    (selected || []).forEach( (list,i) => {
      let suggestion = this.refs['suggestion'+i];
      if ( ! suggestion ) { return; }
      suggestion.setSelectedList( list, true, true );
    });
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

    if ( key === 'add-exclusion-row' && this.state.storage ) {
      let storage = this._updateStorageOptionList( null, true );
      this.setState({'storage': storage});
    }
  }

  _suggestionCallback( action, suggestion, recognition, index ) {
    let key = typeof(action) === 'string' ? action : action.action;
    let {storage} = this.state, update = false;

    if ( key === 'add-suggestion' ) {
      if ( suggestion.id.match(/line/i) || suggestion.id.match(/^([a-z])?[1-9]([0-9]+)?/i) ) {
        storage.list[index].id   = suggestion.id;
        storage.list[index].line = suggestion;

        storage = this._updateStorageOptionList( storage );
        update = true;
      }
    } else if ( key === 'clear-all-selection' && index  ) {
      storage.list = storage.list.filter((d,i) => i !== index );
      update = true;
    //} else if ( key === 'remove-suggestion') {
    }
    if ( ! update ) { return; }

    this.setState({'storage': storage});
  }

  _updateStorageOptionList( src, adding, lineQuayList ) {
    let storage = JSON.parse( JSON.stringify(src || this.state.storage) );
    let lineQuays = lineQuayList || this.state.lineQuays || {};

    if ( adding ) { storage.list.push({}); }

    storage.pin = {};
    storage.list.forEach((data) => {
      if ( ! data || ! data.id ) { return; }
      storage.pin[data.id] = data;
    });

    let lineOptionList = storage.lineList.reduce( (prev,line) => {
      if ( line.name ) { prev.push({'id': line.name, 'name': line.name}); }
      return prev;
    }, []);

    storage.list.forEach((data) => {
      data.lineOptionlist = lineOptionList;
      data.stopOptionlist = [];

      if ( data.id || data.line ) {
        if ( ! data.id && data.line && data.line.id ) {
          data.id = data.line.id;
        }
        //data.optionList = [{'id':'kietvetran', 'name': 'abcde...'}];
        data.optionList = (lineQuays[data.line.name] || lineQuays[data.line.id] || {}).quayList || [];
      } else {
        data.optionList = data.lineOptionlist;
      }
    });
    return storage;
  }

  /****************************************************************************
  ****************************************************************************/
  _getFormSelected() {

  }

  /****************************************************************************
  ****************************************************************************/
  _initStorage( props, lineQuayList ) {
    let {properties, formData} = props, storage = {'list': [], 'pin': {}, 'loading': false};
    let selection = ((properties || {}).source || {}).selection;

    storage.lineList = (formData.lines || []).reduce( (prev,data) => {
      prev.push({'id': data.id, 'name': data.publicCode});
      return prev;
    }, []);

    storage.linePin  = storage.lineList.reduce( (prev,data) => {
      prev[data.id] = data;
      return prev;
    }, {});

    return this._updateStorageOptionList( storage, true );
  }
}
