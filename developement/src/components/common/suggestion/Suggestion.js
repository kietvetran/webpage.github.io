import React from 'react';
import {SuggestionTagbtn} from './SuggestionTagbtn';
import {Calendar} from '../calendar/Calendar';
import './Suggestion.scss';

export class Suggestion extends React.Component {
  static defaultProps = {
    'mode': {'timerSearch': 0, 'previous': {}, 'timerBlur': {}, 'categoryFilter': {}}
  }

  constructor(props) {
    super(props);
    this.state = {
      'id'          : props.fieldId || 'suggestion-'+(new Date()).getTime(),
      'searchText'  : props.searchText || '',
      'searchKeys'  : props.searchKeys || ['name'],
      'storage'     : {},
      'focusIndex'  : -1,
      'maxSearch'   : props.maxSearch || 8,
      'selectedList': props.selectedList || [],
      'matchedList' : [],
      'matchStart'  : props.matchStart === true   || props.dropdownMenu === true,
      'single'      : props.single === true       || props.dropdownMenu === true,
      'loading'     : false,
      'optionList'  : props.list || [],
      'copyList'    : props.list || [], //JSON.parse(JSON.stringify((props.list || []))),
      'calendarReg' : /(\s+|^)(calendar|date)\:/i,
      'hasCalendar' : false,
      'staticFilter': props.staticFilter ? true : false,
      'hideWidgetOnClickMatchedItem': props.hideWidgetOnClickMatchedItem || false
    };

    this._initOptionCategory();
    
    this._addSuggestion    = this._addSuggestion.bind(this);
    this._removeSuggestion = this._removeSuggestion.bind(this);
    this._clickMatchedItem = this._clickMatchedItem.bind(this);
    this._keydown = this._keydown.bind(this);
    this._keyup   = this._keyup.bind(this);
    this._focus   = this._focus.bind(this);
    this._blur    = this._blur.bind(this);
    this._click   = this._click.bind(this);

    this._calendarCallback = this._calendarCallback.bind(this);

    this.removeSuggestion = this.removeSuggestion.bind(this);
    this.isOpen           = this.isOpen.bind(this);
    this.closeWidget      = this.closeWidget.bind(this);
  }

  render() {
    const {label, placeholder, dropdownMenu, fieldName, fieldStyle, hideWidget, inputField, tagBtnAddition, ignorInnerTabbing, mode, matchedItemDetailClick} = this.props;
    const {id, selectedList, matchedList, storage, focusIndex, searchText, loading, category, originalText, hasCalendar, calendarReg, staticFilter} = this.state;

    let inputName  = fieldName || 'suggestion';
    let tabbing    = ignorInnerTabbing ? {'tabIndex': '-1'} : {};
    let staticList = staticFilter && category && category.list  ? category.list.map( (t) => {
        return mode.categoryFilter[t] ? (' -'+t) : '';
    }).filter( (t) => !! t ) : [];

    let style = 'suggestion-wrapper input-content -fieldset' + (hasCalendar ? ' -has-calendar' : '')+ 
      (staticList.length ? (' -static-category ' + (staticList.length > 1 ? '-multiple' : staticList.join(' '))) : '');

    return (
      <div className={style}>
        {label && <label htmlFor={id}>{label}</label>}
        <div className={'suggestion-cnt' + (dropdownMenu ? ' -dropdown-menu': '')}>
          {selectedList.length > 0 && <div className="selected-wrapper">
              <ul className="suggestion-holder"> {selectedList.map( (suggestion, i) => {
                return <li key={'message-suggestion-'+i} className="inline-block">
                  <SuggestionTagbtn text={suggestion.name || suggestion.text} unit={suggestion.unit} id={suggestion.id} callback={this._click}
                    type="-white" inputField={inputField} category={suggestion.category} tagBtnAddition={tagBtnAddition} inputName={inputName}/>
                </li>
              }) } </ul>
              <a href="#" className="icon-btn -cross -ex-small-icon-view clear-btn -blue" onClick={(e)=>{this._click(e,'clear-all-selection');}} />
            </div>
          }
          <div className={'suggestion-field-wrapper' + (searchText ? ' -has-search-text' : '')}>
            <input type="text" name={inputName} id={id} className={'textfield' + (fieldStyle ? ' '+fieldStyle : '')} ref="searchField"
              spellCheck="false" autoComplete="off" autoCorrect="off" placeholder={placeholder || ''}
              onKeyUp={(e)=>{this._keyup(e);}} onKeyDown={(e)=>{this._keydown(e);}} onFocus={(e)=>{this._focus(e);}} onBlur={(e)=>{this._blur(e);}}/>
            <a href="#" {...tabbing} className="icon-btn -cross -ex-small-icon-view clear-btn" onClick={(e)=>{this._click(e,'clear');}} />
            { hideWidget !== true &&
                <div tabIndex="-1" className="suggestion-widget" onClick={(e)=>{this._click(e, 'click-widget');}}>
                  {loading && <div className="loader-wrapper"><div className="loader -small"></div></div>}
                  {matchedList.length > 0 && ! loading ? <ul ref="matchedList" className="matched-list"> {matchedList.map( (matched, i) => {
                    let itemStye = 'matched-item' +(storage[matched.id] ? ' -selected': '') + (i===focusIndex ? ' -focus': '') +
                      (matched.category ? (' -has-category -'+matched.category) : '') +
                      (matchedItemDetailClick ? ' -next-is-detail' : '');
                    return <li key={'message-matched-'+i}>
                      { matched.disabled ? <div {...tabbing} href="#" className={itemStye + ' -disabled'} title={matched.title || ''}>
                          <span>{matched.name}</span>
                          {matched.unit && <span className="unit-info">{' '+matched.unit}</span>}
                          {matched.reserved && <span className="reserved-info">{matched.reserved}</span>}
                        </div> : <a {...tabbing} href="#" className={itemStye} onClick={(e)=>{this._clickMatchedItem(e,matched);}} title={matched.title || ''}>
                          <span>{matched.name}</span>
                          {matched.unit && <span className="unit-info">{' '+matched.unit}</span>}
                          {matched.reserved && <span className="reserved-info">{matched.reserved}</span>}
                        </a>
                      }
                      {!! matchedItemDetailClick && <a href="#" role="button" className="matched-item-detail icon-btn -more" onClick={(e)=>{matchedItemDetailClick(e,'click-matched-item-detail',matched);}}/> }
                    </li>
                  }) } </ul> : (this.props.mode.previous[this.state.id] && <div ref="matchedList" className="empty-list">No matched</div>)}                  
                  {category.list.length > 0 && ! loading && (matchedList.length > 0 || originalText) && <div className="suggestion-category-wrapper">
                      <ul className="suggestion-category-list">
                        { category.list.map( (text, i) => {
                            return <li key={'suggestion-category-item-'+i}>
                              <a {...tabbing} href="#" role="button" onClick={(e)=>{this._click(e,'click-category',text);}}
                                className={'suggestion-category-btn as-link'+ (staticFilter && mode && mode.categoryFilter && mode.categoryFilter[text] ? ' -active': '')}
                              >{text}</a>
                            </li>
                        }) }
                      </ul>
                    </div>
                  }
                  { hasCalendar && <div className={'suggestion-calendar-wrapper' + (calendarReg.test(originalText || '') ? ' -open' : '')}>
                      <Calendar clock={true} view={2} ref="calendarInterval" calendarStyle={'-stay-open -static-position -small-view'}
                        fieldNameFrom={inputName+'From'} fieldNameTo={inputName+'To'}
                        placeholder={['From date', 'To date']} callback={this._calendarCallback}/>
                    </div>
                  }
                </div>
            }
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    setTimeout( () => { this.props.mode.unMount = false; }, 250 );
  }

  componentWillUnmount() {
    this.props.mode.unMount = true;
  }

  componentDidUpdate(prevProps, prevState) {
    if ( prevProps.dynamicOptionList && ! this.props.mode.unMount ) {
      let aList = JSON.stringify(prevProps.list  || []);
      let bList = JSON.stringify(this.props.list || []); 
      if ( aList !== bList  ) {
        this.state.optionList = JSON.parse(bList);
        this.state.copyList   = this.state.optionList;
        this._search();
      }
    }
  }

  /****************************************************************************
  === INTERNAL FUNCTION ===
  ****************************************************************************/
  _keydown(e) {
    const code = e.keyCode, key = e.key || '';
    if ( code === 13 ) {
      let {focusIndex, matchedList} = this.state;
      if ( matchedList[focusIndex] ) {
        if ( e ) { e.preventDefault(); }
      }
    }
  }

  _keyup(e) {
    const key = e.key || '', target = e.target, value = target.value || '', code = e.keyCode;
    const searchTimer = typeof(this.props.searchTimer) === 'number' ?
      this.props.searchTimer : 200;

    if ( code === 13 ) {
      let {focusIndex, matchedList} = this.state;
      if ( matchedList[focusIndex] ) {
        if ( e ) { e.preventDefault(); }

        if ( e.shiftKey && this.props.matchedItemDetailClick ) {
          this.props.matchedItemDetailClick(e,'click-matched-item-detail',matchedList[focusIndex]);
          let field = this.refs.searchField;
          if ( field ) {
            field.value = '';
            field.blur();
          } else { this._blur( e ); }
        } else {
          let selectedList = this._addSuggestion( matchedList[focusIndex] );
          if ( this.props.dropdownMenu ) {
            let field = this.refs.searchField;
            if ( selectedList && selectedList[0] ) {
              field.value = selectedList[0].name;
              this._selectText(0, selectedList[0].name.length, field );
              this.closeWidget();
              //this._search( selectedList[0].name, true );
            } else {
              field.value = '';
            }
          }
        }
      }
      this._triggerCallback('enter');
    } else if ( code === 38 || code === 40 ) {
      clearTimeout( this.props.mode.timerSearch || 0 );
      let {focusIndex, matchedList } = this.state;
      if ( matchedList.length ) {
        //let next = focusIndex + (code === 40 ? 1 : -1);
        this.setState({'focusIndex': this._getFocusIndex( matchedList, focusIndex, (code === 38))});
      }
    //} else if ( this.props.mode.previous[this.state.id] !== value ) {
    } else if ( key !== 'Escape' ) {
      clearTimeout( this.props.mode.timerSearch || 0 );
      this.props.mode.timerSearch = setTimeout( () => {
        let asEnter = this.props.asEnterCharacter;
        let splited = asEnter ? value.split( asEnter ) : [];
        if ( splited.length > 1 ) {
          this._renderMultipleSelection( splited );
        } else {
          this._search( value );
        }
      }, searchTimer);
    }
  }

  _focus(e) {  
    const target = e.target, value = target.value || '';
    clearTimeout( this.props.mode.timerBlur[this.state.id] || 0 );

    // setTimeout necessary: Set first focus on the suggestion field, click outside from this browser,
    // click back to the page on another element.
    this.props.mode.timerBlur[this.state.id] = setTimeout( () => {
      clearTimeout( this.props.mode.timerBlur[this.state.id] || 0 );
      this._search( value );
    }, 50);
  }

  _blur(e) {
    if ( e ) { e.preventDefault(); }
    clearTimeout( this.props.mode.timerBlur[this.state.id] || 0 );
    this.props.mode.timerBlur[this.state.id] = setTimeout( () => {
      if ( this.props.mode.unMount ) { return; }
      this.closeWidget();
    }, 200 );
  }

  _click( e, key, data ) {
    if ( e ) { e.preventDefault(); }

    if ( key === 'remove-suggestion-tabbtn' ) {
      this._removeSuggestion( data );
    } else if ( key === 'clear' && this.refs.searchField ) {
      this.refs.searchField.value = '';
      this.closeWidget();
      //this.refs.searchField.focus();
    } else if ( key === 'clear-all-selection' ) {
      this.setState({'selectedList': [], 'storage': {}});
      if ( typeof(this.props.callback) === 'function' ) {
        this._triggerCallback( 'clear-all-selection' );
      }
    } else if ( key === 'click-category' && data ) {
      if ( this.state.staticFilter ) {
        if ( this.props.mode.categoryFilter[data] ) {
          delete(this.props.mode.categoryFilter[data]);
        } else {
          this.props.mode.categoryFilter[data] = 1;
        }
        this._search();
      } else {
        let value = data + ':';
        this.refs.searchField.value = value;
      }
      this.refs.searchField.focus();
    } else if ( key === 'click-widget' && e ) {
      let parent = this._getClosestParent( e.target, 'calendar-widget');
      if ( parent ) {
        clearTimeout( this.props.mode.timerBlur[this.state.id] || 0 );
        this.props.mode.timerBlur[this.state.id] = setTimeout( () => {
          if ( this.refs.calendarInterval ) {
            let opt = this.refs.calendarInterval.getConfig();
            let field = opt.focusTarget ? opt.fieldB : opt.fieldA;
            let input = field ? document.getElementById( field.id ) : null;
            if ( input ) { return input.focus(); }
          }
          this.refs.searchField.focus();
        }, 100);
      }
    }
  }

  /****************************************************************************
  === ===
  ****************************************************************************/
  _renderMultipleSelection( list, restText, selected ) {
    if ( ! restText ) { restText = []; }
    if ( ! selected ) { selected = []; }

    if ( (list || []).length ) {
      let value = (list.shift() || '').replace( /^\s+/, '').replace( /\s+$/g, '');
      if ( ! value ) {
        return this._renderMultipleSelection(list, restText, selected);
      }

      this._search( value, null, (result) => {
        let suggestion = ((result || {}).matchedList || [])[0];
        if ( suggestion ) {
          selected.push( suggestion );
        } else {
          restText.push( value );
        }
        this._renderMultipleSelection(list, restText, selected);
      });
    } else {

      if ( selected.length ) { this.setSelectedList( selected ); }
      this.refs.searchField.value = restText.join('. ');
    }
  }

  /****************************************************************************
  === ===
  ****************************************************************************/
  _calendarCallback( info ) {
    if ( info.action === 'blur' ) {
      clearTimeout( this.props.mode.timerBlur[this.state.id] || 0 );
      this.props.mode.timerBlur[this.state.id] = setTimeout( () => {
        this.closeWidget();
      }, 200);
    } else {
      clearTimeout( this.props.mode.timerBlur[this.state.id] || 0 );
      setTimeout( () => {
        clearTimeout( this.props.mode.timerBlur[this.state.id] || 0 );
      }, 100);
    }

    if ( info.action === 'update-field' && this.refs.calendarInterval ) {
      let opt  = this.refs.calendarInterval.getConfig();
      let name = [opt.fieldA, opt.fieldB].map( (d) => {
        let input = document.getElementById(d.id);
        return input ? (input.value || '') : '';
      }).filter( (d) => !! d ).join(' - ');


      let {selectedList, calendarReg} = this.state;
      let found = (selectedList || []).find( (d) => d.category && calendarReg.test((d.category+':')) );
      let renew = found ? found.id : null;

      this._addSuggestion({
        'id':'suggestion-calendar', 'name': name, 'value': opt.interval.join(','), 'category': 'calendar'
      }, null, renew);
    }
  }

  _search( text, ignorDropdownMenu, callbackBeforeIgnorSetState ) {
    if ( ! text ) { text = ''; }

    let {setMatchedListWeight, searchDoubleCheck, searchPrefillMatchedList, mode, allowFreeTextTag} = this.props;
    let searched = (result) => {
      if ( typeof(setMatchedListWeight) === 'function' ) {
        result.matchedList = setMatchedListWeight( result ) || [];
      }

      let state = {
        'matchedList' : result.matchedList,
        'focusIndex'  : text ? 0 : -1,
        'searchText'  : result.text,
        'loading'     : false,
        'originalText': result.originalText
      };

      if ( typeof(callbackBeforeIgnorSetState) === 'function') {
        return callbackBeforeIgnorSetState(state);
      }

      this.setState( state );
      if ( typeof(this.props.callback) === 'function' ) {
        this.props.callback( 'search-suggestion', {
          'text': result.text, 'reg': result.reg, 'matchedList': result.matchedList
        });
      }

      if ( this.props.dropdownMenu && ! ignorDropdownMenu ) {
        this._searchForwardDropdownMenu( text, result );
      }
      this.props.mode.previous[this.state.id] = result.text;
    };

    let originalText = text || '';
    if ( typeof(this.props.searchOverwrite) === 'function' ) {
      let done = this.props.searchOverwrite( text, (response) => { searched(response); });
      if ( done ) { return; }
    }

    let {copyList, maxSearch, searchKeys, matchStart, category, selectedList, blockSuggestionCategory} = this.state;
    let list = copyList;

    let i = 0, j = 0, reg = matchStart ?
      this._createRegexp(text,1,1,2) : this._createRegexp(text,1,1,1);

    /** start verify is category */
    let modeFilter = [];
    for ( j=0; j<category.list.length; j++ ) {
      if ( mode.categoryFilter[category.list[j]] ) {
        modeFilter.push( category.pin[category.list[j]].reg );
      }

      if ( text.match(category.pin[category.list[j]].reg) ) {
        list = JSON.parse( JSON.stringify(category.pin[category.list[j]].options) );
        text = text.replace( category.pin[category.list[j]].reg, '');
        reg  = matchStart ? this._createRegexp(text,1,1,2) : this._createRegexp(text,1,1,1);
        j    = category.list.length;
      }
    }
    /** end verify is category */
    let matchedList = (typeof(searchPrefillMatchedList) === 'function' && ! modeFilter.length ? 
      (searchPrefillMatchedList(text, reg, copyList) || []) : []
    ).filter( (data) => {
      if ( searchDoubleCheck ) {
        let test = searchDoubleCheck(data, searchKeys, {'key': data, 'reg': reg, 'text': text}, selectedList );
        if ( ! test ) { return false; }
      }
      return true;
    });

    let pin = matchedList.reduce((p,d)=> {
      p[d.id] = 1;
      return p;
    }, {});

    while ( i < list.length && matchedList.length < maxSearch ) {
      let data  = list[i] || {}, found = false, category = (data.category || '').toLowerCase();
      let test = modeFilter && modeFilter.length ?
        (mode.categoryFilter[category] ? true : false) : true;

      if ( test && (blockSuggestionCategory || {})[category] ) {
        test = false;
      } else if ( ! test && modeFilter && modeFilter.length && data.category === 'stop' ) {
        test = modeFilter.find( (r) => {
          let t = (data.modeList || []).find( (t) => {
            return t && (t+':').match(r) ? true : false;
          }); 
          return t ? true : false;
        }) ? true : false;
      }

      if ( test ) {
        found = ! text ? true : searchKeys.find( (key) => {
          return ! pin[data.id] && ((data[key] || '')+'').match( reg ) ? true : false;
        });
      }

      if ( searchDoubleCheck && found && ! (blockSuggestionCategory || {})[category] ) {
        found = searchDoubleCheck(data, searchKeys, {'key': found, 'reg': reg, 'text': text}, selectedList );
      }

      if ( found ) {
        data.reg = reg;
        matchedList.push( data );
      }
      i++;
    }

    if ( allowFreeTextTag && text.replace(/\s+/g, '') ) {
      matchedList.push({'id': text, 'name': text, 'label': text, 'value': text, 'reg': reg, 'category': 'freetext'});
    }

    searched({ 'text': text, 'reg': reg, 'matchedList': matchedList, 'originalText': originalText});
  }

  _searchForwardDropdownMenu( text, result ) {
    let name = '';
    if ( text && result.matchedList && result.matchedList[0] ) {
      if ( ! this.state.storage[result.matchedList[0].id] ) {
        this._addSuggestion( result.matchedList[0] );
        name =  result.matchedList[0].name
      }
    } else if ((! text || (result.matchedList||[]).length === 0) && this.state.selectedList && this.state.selectedList[0] ) {
      this._removeSuggestion( this.state.selectedList[0].id );
    }

    if ( name || (this.state.selectedList && this.state.selectedList[0]) ) {
      if ( text.length >= this.props.mode.previous[this.state.id].length ) {
        let field = this.refs.searchField;
        let value = name || this.state.selectedList[0].name;

        field.value = value;
        this._selectText(text.length, value.length, field );
      }
    }
  }

  _clickMatchedItem(e, matched) {
    if ( e )  { e.preventDefault(); }

    const field = this.refs.searchField;
    if ( field && ! this.state.hideWidgetOnClickMatchedItem ) { field.focus(); }

    if ( ! matched ) { return; }

    let {selectedList, calendarReg} = this.state, renew = null, remove = false;
    if ( matched.category && calendarReg && calendarReg.test((matched.category+':')) ) {
      let found = (selectedList || []).find( (d) => d.category && calendarReg.test((d.category+':')) );
      renew = found ? found.id : null;
      remove = renew === matched.id;

      let info = this._getCalendarNameAndValue( matched );
      matched = JSON.parse( JSON.stringify(matched) );

      if ( info.name  ) { matched.name = info.name; }
      if ( info.value ) { matched.value = info.value; }

      if ( this.refs.calendarInterval ) {
        info.dates ? this.refs.calendarInterval.setIntervalDate( info.dates,true) :
          this.refs.calendarInterval.resetIntervalDate();
      }
    } else if ( matched.category && matched.single ) {
      let found = (selectedList || []).find( (d) => d.category === matched.category );
      renew = found ? found.id : null;
      remove = renew === matched.id;
    } else if ( e && e.shiftKey && this.props.matchedItemDetailClick ) {
      return this.props.matchedItemDetailClick(e,'click-matched-item-detail', matched); 
    }

    let sList = remove ? this._removeSuggestion( matched.id ) :
      this._addSuggestion( matched, null, renew);

    if ( this.props.dropdownMenu ) {
      let field = this.refs.searchField;
      if ( sList && sList[0] ) {
        field.value = sList[0].name;
        this._selectText(0, sList[0].name.length, field );
        this.closeWidget();
      } else {
        field.value = '';
        this._search( '' );
      }
    }
  }

  _addSuggestion( suggestion, ignorCallback, renew, recognition ) {
    if ( ! suggestion || ! suggestion.id || ! suggestion.name ) { return; }

    if ( ! ignorCallback && typeof(this.props.beforeAddSuggestion) === 'function' ) {
      let forward = this.props.beforeAddSuggestion( suggestion );
      if ( forward === false ) { return; }
    }

    let {selectedList, storage, single} = this.state, index = null;
    if ( storage[suggestion.id] || storage[renew] ) {
      if ( renew && (selectedList || []).length ) {
        let id = suggestion.id, i = 0, loop = selectedList.length;
        for ( i; i<loop; i++ ) {
          if ( selectedList[i].id === id || selectedList[i].id === renew ) {
            index = i;
            i = loop;
            delete( storage[renew]         );
            delete( storage[suggestion.id] );
          }
        }
        //selectedList = selectedList.filter( (data) => { return data.id !== id; });
      } else {
        return this._removeSuggestion( suggestion.id );
      }
    } else if ( single && selectedList && selectedList[0]  ) {
      this._removeSuggestion( selectedList[0].id, null, true );
      selectedList = [];
      storage = {};
    }

    storage[suggestion.id] = true;
    if ( index === null ) {
      selectedList.push( suggestion );
    } else {
      selectedList[index] = suggestion;
    }
    selectedList = selectedList.filter( (d) => !! d );
    this.setState({'selectedList': selectedList, 'storage': storage});

    if ( ! ignorCallback && typeof(this.props.callback) === 'function' ) {
      this.props.callback( 'add-suggestion', suggestion, recognition );
    }

    this._verifyClearTextfield();
    return selectedList;
  }

  _removeSuggestion( id, ignorCallback, ignorUpdateState ) {
    if ( ! id ) { return; }
    let {selectedList, storage} = this.state;
    delete( storage[id] ); //storage[id] = false;
    let list = selectedList.filter( (data) => { return data.id !== id; });

    if ( ! ignorUpdateState ) {
      this.setState({'selectedList': list, 'storage': storage});
    }

    if ( ! ignorCallback && typeof(this.props.callback) === 'function' ) {
      this.props.callback( 'remove-suggestion', id );
    }

    this._verifyClearTextfield();
    return list;
  }

  /****************************************************************************
  === ===
  ****************************************************************************/
  _fireEvent = (node, eventName) => {
    let doc = null, event = null, eventClass = '';
    if (node.ownerDocument) {
      doc = node.ownerDocument;
    } else if (node.nodeType == 9){
      doc = node;
    } else { return; }

     if (node.dispatchEvent) {
      eventClass = eventName.match( /click|mousedown|mouseup/i ) ? 'MouseEvents' :
        (eventName.match( /focus|change|blur|select/i ) ? 'HTMLEvents' : '');
      if ( ! eventClass ) { return; }

      event = doc.createEvent(eventClass);
      event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.
      event.synthetic = true; // allow detection of synthetic events
      // The second parameter says go ahead with the default action
      node.dispatchEvent(event, true);
    } else  if (node.fireEvent) {
      // IE-old school style, you can drop this if you don't need to support IE8 and lower
      event = doc.createEventObject();
      event.synthetic = true; // allow detection of synthetic events
      node.fireEvent('on' + eventName, event);
    }
  }

  _createRegexp (text, g, i, b, f) {

    //if ( text == '*' ) { return /.*/; }
    //let v = text.replace( /\*/, '.*' ).replace( /\+/g, '\\+' );
    //let m = (g && i) ? 'gi' : ( (g || i) ? (g ? 'g' : 'i') : '' );
    //let s = b ? (b === 2 ? '^' : (b === 3 ? '(^|\/|\\s+|\,)' : '(^|\/|\\s+)')) : '';
    //let e = f ? (f === 2 ? '$' : (f === 3 ? '($|\/|\\s+|\,)' : '($|\/|\\s+)')) : '';
    //return new RegExp( s+'('+v+')'+e, m );

    if ( text == '*' ) { return /.*/; }
    let v = text.replace( /\*/, '.*' ).replace( /\+/g, '\\+' )
      .replace( /\(/g, '\\(' ).replace( /\)/g, '\\)' ).replace( /\?/g, '\\?' ).replace( /\-/g, '\\-' );
      
    let m = (g && i) ? 'gi' : ( (g || i) ? (g ? 'g' : 'i') : '' );
    let s = b ? (b === 2 ? '^' : (b === 3 ? '(^|\/|\\s+|\,|\\()' : '(^|\/|\\s+)')) : '';
    let e = f ? (f === 2 ? '$' : (f === 3 ? '($|\/|\\s+|\,|\\))' : '($|\/|\\s+)')) : '';
    return new RegExp( s+'('+v+')'+e, m );
  }

  _selectText( start, end, field ) {
    if ( ! field ) return;

    var value = field.value || '';
    if ( isNaN(end) ) { end = value.length; }

    var interval = [isNaN(start) ? 0 : start, isNaN(end) ? 0 : end];
    if ( ! isNaN(interval[0]) && ! isNaN(interval[1]) ) {
      if (field.setSelectionRange) { // Firefox and other gecko based browsers
        field.setSelectionRange(interval[0], interval[1]);
      }
      else if (field.createTextRange) { // Internet Explorer
        var range = field.createTextRange();
        range.collapse(true);
        range.moveEnd('character', interval[0]);
        range.moveStart('character', interval[1]);
        range.select();
      }
      else if (field.selectionStart) { // Other browsers
        field.selectionStart = interval[0];
        field.selectionEnd   = interval[1];
      }
    }
  }

  _getClosestParent( dom, what, idTest ) {
    let verify = ( parent, type, specific ) => {
      if ( ! parent || (parent.tagName||'').match(/^html/i) ) { return; }

      if ( specific ) {
        let t = parent.getAttribute('id')==type;
        return t ? parent : verify( parent.parentNode, type, specific );
      }
      return this._hasClass(parent,type) ? parent :
        verify( parent.parentNode, type, specific );
    };
    return what ? verify( dom, what, idTest ) : null;
  }

  _hasClass( target, type ) {
    if ( ! target ) { return; }
    let v = target && target.tagName ? (target.getAttribute('class') || '') : '';
    let r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
    return v.match( r ) != null;
  }

  _getCalendarNameAndValue( data ) {
    if ( ! data || ! data.id ) { return; }

    let now = new Date(), dates = null, aDay = 24*60*60*1000;
    let id  = data.id.replace( /^date/i, '');
    if ( id === '-today' ) {
      dates = [this._getCloneDate(now,true), now];
    } else if ( id === '-yesterday' ) {
      let cloned = this._getCloneDate(now,true);
      let end = new Date( (cloned.getTime()-1) );
      now.setDate( (now.getDate()-1) );
      dates = [this._getCloneDate(now,true), end];
    } else if ( id.match( /\-([1-9]+)hour/i) ) {
      let matched = id.match( /\-([1-9]+)hour/i );
      let n = parseInt( matched[1] );
      let t = now.getTime() - (60*60*1000*n);
      let start = new Date( t );
      dates = [start, now];
    } else if ( id.match( /\-([0-9]+)day(\-now)?/i) ) {
      let matched = id.match( /\-([0-9]+)day(\-now)?/i );
      let n = parseInt( matched[1] );
      let t = now.getTime() - (24*60*60*1000*n);
      let start = new Date( t );
      start.setHours(0); start.setMinutes(0); start.setSeconds(0); start.setMilliseconds(0);
      let end = ! n || matched[2] ? now :
        (new Date((start.getTime()+ (24*60*60*1000))));
      dates = [start, end];
    } else if ( id.match( /\-([0-9]+)?week(\-now)?/) ) {
      let matched = id.match(/\-([0-9]+)?week(\-now)?/);
      let count = parseInt(matched[1] || '0');
      let day   = now.getDay() || 7, passed = day - 1;
      let start = count ?
        (new Date((now.getTime()-(passed*aDay+(count*7*aDay))))) :
        (new Date((now.getTime()-(passed*aDay))));
      let end = ! count || matched[2] ? now :
        (new Date((now.getTime()-(passed*aDay+((count-1)*7*aDay)+aDay))))
      dates = [this._getCloneDate(start, true), this._getCloneDate(end, true)];
    } else if ( id.match( /\-([0-9]+)?month(\-now)?/) ) {
      let matched = id.match(/\-([0-9]+)?month(\-now)?/);
      let count = parseInt(matched[1] || '0');
      let start = this._getCloneDate( now, true );
      let end   = this._getCloneDate( now, true );
 
      start.setDate(1);
      let month = start.getMonth() - count;
 
      if ( count ) {
        start.setMonth( month );
      }

      if ( count && ! matched[2] ) {
        end = new Date( start.getTime() );
        end.setMonth( month + 1 );
        end.setDate( 0 );
      }
      dates = [start, end];
    } else if ( id.match( /\-([0-9]+)?year(\-now)?/) ) {
      let matched = id.match(/\-([0-9]+)?year(\-now)?/);
      let count = parseInt(matched[1] || '0');
      let start = this._getCloneDate(now,true);
      start.setMonth(0); start.setDate(1);
      start.setFullYear( start.getFullYear() - count );

      let end = ! count || matched[2] ? now : null;
      if ( end === null ) {
        end = new Date( start.getTime() );
        end.setFullYear( end.getFullYear() + 1 );
      }

      dates = [start, end];
    }

    if ( ! dates[0] || ! dates[1] ) { return;}

    let names = dates.map( (d) => {return this._convertDateToText(d,null,true); });
    return {
      'name': data.name + ' ['+names.join(',')+']',
      'value': dates.map( (d) => { return d.getTime(); }).join(','),
      'dates': dates
    };
  }

  _convertDateToText( date, separator, clock ) {
    let s = typeof(separator)==='undefined' || separator === null ? '.' : separator;
    let l = [date.getDate(),date.getMonth()+1,date.getFullYear()], i = 0;
    for ( i=0; i<l.length; i++ ) {
      if ( l[i] < 10 ) { l[i] = '0'+l[i]; }
    }

    let out = l.join( s );
    if ( ! clock ) { return out; }

    l = [date.getHours(), date.getMinutes()];
    for ( i=0; i<l.length; i++ ) {
      if ( l[i] < 10 ) { l[i] = '0'+l[i]; }
    }
    return out + ' ' + l.join(':');
  }

  _getCloneDate( data, resetClock ) {
    let stamp = (new Date()).getTime() + '';

    if ( data !== null && typeof(data) === 'object' ) {
      stamp = data.getTime() + '';
    } else if ( (data+'').match(/^\d+$/) ) {
      stamp = data + '';
    }

    let d = new Date( parseInt(stamp, 10) );
    return resetClock ?
      new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0) : d;
  }

  _getFocusIndex( matchedList, current, up ) {
    let i = 0, length = (matchedList || []).length, index = -1;

    if ( up === true || up === false ) {
      let pin = {},  previous = null, first = null;
      for ( i=0; i<length; i++ ) {
        if ( ! matchedList[i] || matchedList[i].disabled ) { continue; }

        pin[i] = {};
        if ( previous === null ) {
          first = i;
        } else {
          pin[previous].next = i;
          pin[i].previous = previous;
        }
        previous = i;
      }

      if ( first !== null && previous !== null ) {
        pin[previous] = first;
      }

      index = current === -1 ? (up ? previous : first) :
        (pin[current] ? (up ? pin[current].previous : pin[current].next) : -1);
    } else {
      for ( i=0; i<length; i++ ) {
        if ( ! matchedList[i] || matchedList[i].disabled ) { continue; }
        index = i;
        i = length;
      }
    }
    return index === null || index === undefined ? -1 : index;
  }

  _triggerCallback( action) {
    let {callback} = this.props;
    if ( typeof(callback) !== 'function' ) { return; }
    callback({'action':action});
  }

  _verifyClearTextfield() {
    let field = this.refs.searchField;
    if ( ! field ) { return; }

    field.value = '';
  }

  _initOptionCategory( nextState ) {
    let state = nextState || this.state;

    state.category = {'list': [], 'pin': {} };
    (state.optionList || []).forEach( (d) => {
      if ( ! d.category ) { return; }
      if ( ! state.category.pin[d.category] ) {
        state.category.list.push(d.category);
        state.category.pin[d.category] = {
          'reg': this._createRegexp((d.category+':'),1,1,2), 'options': []
        };
        
        if ( state.calendarReg.test((d.category+':')) ) {
          state.hasCalendar = true;
        }
      }
      state.category.pin[d.category].options.push(d);
    });
  }

  /****************************************************************************
  === PUBLIC FUNCTION ===
  ****************************************************************************/
  keydown(e) { this._keydown(e); }
  keyup(e) { this._keyup(e); }
  focus(e) { this._focus(e); }
  blur(e)  { this._blur(e);  }
  search(text) { this._search(text); }
  setLoading( loading ) { this.setState({'loading': (loading || false)}); }
  updateList( list ) { this.setState({'optionList': (list || []), 'copyList': JSON.parse(JSON.stringify((list || []))), 'ignorWillUpate': true}); }
  updateState( state ) { 
    if ( state ) { this.setState(state); }
  }

  getSearchField() {
    return this.refs.searchField;
  }

  isOpen() {
    return this.refs.matchedList ? true : false;
  }

  closeWidget() {
    this.props.mode.previous[this.state.id] = '';
    this.setState({'matchedList': [], 'focusIndex': -1, 'originalText': '', 'searchText': '', 'copyList': this.state.optionList});
    //this.setState({'matchedList': [], 'focusIndex': -1});
  }

  getState( key ) {
    return key ? this.state[key] : this.state;
  }

  getSelectedList() {
    return this.state.selectedList || [];
  }

  reset( ignorCallback ) {
    this.setState({'selectedList': [], 'storage': {}});
    if ( ! ignorCallback && typeof(this.props.callback) === 'function' ) {
      this._triggerCallback( 'clear-all-selection' );
    }
  }

  setSelectedList( list, ignorCallback, forceToAddWhenNotExist, recognition, renew ) {
    if ( (list || []).length === 0 ) { return; }

    let pin = {}, {optionList, storage} = this.state;
    optionList.forEach( (src) => { pin[src.id || src.ID] = src; });

    //console.log('=== set selection ==='); console.log( list );

    let {calendarReg} = this.state;
    (list || []).forEach( (data) => {
      let id  = data.id || data.ID;
      let src = storage[id] ? null : pin[id];

      if ( src && src.category && calendarReg && calendarReg.test((src.category+':')) ) {
        let info = this._getCalendarNameAndValue( src );
        src = JSON.parse( JSON.stringify(src) );

        if ( info.name  ) { src.name = info.name; }
        if ( info.value ) { src.value = info.value; }

        if ( this.refs.calendarInterval ) {
          info.dates ? this.refs.calendarInterval.setIntervalDate( info.dates,true) :
            this.refs.calendarInterval.resetIntervalDate();
        }
      } else if ( data.category && calendarReg && calendarReg.test((data.category+':')) && data.value ) {
        let dates = data.value.split(',').map( (v) => {
          return new Date(parseInt(v));
        });
        if ( this.refs.calendarInterval ) {
          this.refs.calendarInterval.setIntervalDate(dates,true);

          let name = dates.map( (d) => {return this._convertDateToText(d,null,true); }).join( ' - ');
          src = {'id':'suggestion-calendar', 'name': name, 'value': data.value, 'category': 'calendar'};
        }
      } else if ( forceToAddWhenNotExist ) {
        src = { ...(pin[data.id] || {}), ...data};
        if ( pin[src.id] ) {
          ['name','category'].forEach((field) => {
            if ( pin[src.id][field] && pin[src.id][field] !== src[field] ) {
              src[field] = pin[src.id][field];
            }
          });
        }
      }
      if ( src ) { this._addSuggestion(src, ignorCallback, (renew || null), recognition); }
    });
  }

  addSuggestion( suggestion ) {
    if ( suggestion ) {
      this._addSuggestion( suggestion );
    }
  }

  removeSuggestion( id ) {
    if ( id && typeof(id) === 'string') {
      this._removeSuggestion(id);
    }
  }
}