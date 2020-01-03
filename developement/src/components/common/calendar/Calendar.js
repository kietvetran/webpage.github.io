//import React, {Component} from 'react'
//import {connect} from 'react-redux';
import React from 'react';
import './Calendar.scss';

//class Calendar extends Component {
export class Calendar extends React.Component {
  static defaultProps = {
    'mode': {'start': null, 'end': null}
  }

  constructor (props) {
    super(props);
    this.state = {
      'focus': false,
      'value': props.value,
      'interval': [],
      'clock': props.clock ? [[0,0],[23,55]] : null,
      'date': new Date(),
      'error': null,
      'shortcuts': props.shortcuts || null,
      'yearNavigation': props.yearNavigation || false,
      'opt' : {
        'calledBack': false,
        'legend': props.legend || 'Dato',
        'stamp': (new Date).getTime(),
        'keyupTimer':0, 'hideTimer':0, 'reg':null,  'interval': [], 'controller': 2,
        'aDay' : 24*60*60*1000,
        'month' : ['Januar','Februar','Mars','April','Mai','Juni','Juli','August','September','Oktober','November','Desember'],
        'week'  : ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
        'fieldA': {'name': props.fieldNameFrom || 'calendar-A', 'id': 'calendar-A', 'defaultValue': '', 'label': 'Fra dato' },
        'fieldB': {'name': props.fieldNameTo || 'calendar-B', 'id': 'calendar-B', 'defaultValue': '', 'label': 'Til dato' },
        'hours': ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
        'minutes': ['00','05','10','15','20','25','30','35','40','45','50','55'],
        'messages': {
          'INVALID_DATE_TEXT'     : 'Ugyldig dato.',
          'DATE_IS_LESS_THAN_MIN' : 'Ugyldig tidsinterval',
          'DATE_IS_GREAT_THAN_MAX': 'Ugyldig tidsinterval'
        },
        ...this._initCalendarLimit( props )
      }
    };

    this._click = this._click.bind(this);
    this._blur  = this._blur.bind(this);
    this._focus = this._focus.bind(this);
    this._keyup = this._keyup.bind(this);
    this._keydown = this._keydown.bind(this);
    this._clickShortcut = this._clickShortcut.bind(this);

    this.setIntervalDate = this.setIntervalDate.bind(this);
    this.getIntervalDate = this.getIntervalDate.bind(this);
    this.resetIntervalDate = this.resetIntervalDate.bind(this);
  }

  componentWillMount() {
    let {now, view} = this.props, {opt} = this.state;

    opt.view     = typeof(view)==='number' ? parseInt(view,10) : 1;
    opt.now      = typeof(now)==='number' ? (new Date(now)) : (new Date());
    opt.nowYear  = opt.now.getFullYear();
    opt.nowMonth = opt.now.getMonth();
    opt.nowDate  = opt.now.getDate();
    opt.now      = new Date( opt.nowYear,opt.nowMonth, opt.nowDate,0,0,0,0,0);
    opt.nowTime  = opt.now.getTime();
    opt.nowDay   = opt.now.getDay();
    opt.interval = [null,null]; //this.props.interval || [null,null];

    if ( opt.min ) {
      opt.messages['DATE_IS_LESS_THAN_MIN'] = 'Dato kan ikke være mindre enn ' +
        this._convertDateToText( opt.min, null, true);
    }

    if ( opt.max ) {
      opt.messages['DATE_IS_GREAT_THAN_MAX'] = 'Dato kan ikke være støree enn ' +
        this._convertDateToText( opt.max, null, true);
    }
  }

  render() {
    let {disabled, placeholder, singleField, fieldStyle, calendarStyle, single, tabIndex, view} = this.props;
    let {error, focus, clock, opt, shortcuts} = this.state;
    let {fieldA, fieldB, messages, legend} = opt;

    let invalidInputA = (error || {}).index === 0;
    let invalidInputB = (error || {}).index === 1;
    let type = 'calendar-wrapper -stay-open_' + (opt.view > 1 ? ' -multiple' : ' -single') +
      (focus ? ' -on-focus' : '') +
      (error ? ' -has-error' : '') +
      (disabled ? ' -disabled' : '') +
      (shortcuts && shortcuts.length ? ' -has-shortcuts' : '')+
      ((singleField || single) ? ' -single-field' : '') +
      (calendarStyle ? ' '+calendarStyle : '');
    let maxLength = clock ? '16' : '10';
    let textholder = placeholder || ['',''];

    return (
      <div className={type}>
        <div className="calendar-cnt">
          <fieldset>
            <legend className="input-label">{legend}</legend>
            <ul className="field-list-wrapper">
              <li ref="itemA" className="field-list-item">
                <input ref="inputA" name={fieldA.name} id={fieldA.id} type="text" defaultValue={fieldA.defaultValue} maxLength={maxLength}
                  placeholder={textholder[0]}
                  className={'textfield input-a' + (invalidInputA ? ' -invalid' : '') + (fieldStyle ? ' '+fieldStyle : '')}
                  autoComplete="off" spellCheck="false" autoCapitalize="off" autoCorrect="off"
                  aria-label={fieldA.label} aria-invalid={invalidInputA} disabled={disabled ? true : false}
                  onBlur={this._blur} onKeyUp={this._keyup} onFocus={this._focus} onKeyDown={this._keydown}/>
              </li>
              <li ref="itemB" className="field-list-item">
                <input ref="inputB" name={fieldB.name} id={fieldB.id} type="text" defaultValue={fieldB.defaultValue} maxLength={maxLength}
                  placeholder={textholder[1]}
                  className={'textfield input-b' + (invalidInputB ? ' -invalid' : '')  + (fieldStyle ? ' '+fieldStyle : '')}
                  autoComplete="off" spellCheck="false" autoCapitalize="off" autoCorrect="off"
                  aria-label={fieldB.label} aria-invalid={invalidInputB} disabled={disabled ? true : false}
                  onBlur={this._blur} onKeyUp={this._keyup} onFocus={this._focus} onKeyDown={this._keydown}/>
              </li>
            </ul>
          </fieldset>
          { (shortcuts || []).length !== 0 &&
              <ul className="shortcut-list">
                { shortcuts.map( (data) => {
                    return <li key={'shortcut-'+data.id} className={data.type || ''}>
                      <a tabIndex={tabIndex === false ? '-1' : ''} href="#" role="button" className="link" onClick={(e)=>{this._clickShortcut(e,data);}}>{data.name}</a>
                    </li>
                }) }
              </ul>
          }
          <div className="calendar-widget" onBlur={this._blur} onFocus={this._focus} onClick={this._click} tabIndex={tabIndex === false ? '-1' : ''}>
            {this._getCalendar((tabIndex === false))}
          </div>
        </div>
        {error && <div className="input-error-message" role="alert">{messages[error.type] || error.type}</div>}
      </div>
    );
  }

  componentWillUnmount() {
    this.props.mode.unMount = true;
  }

  componentDidMount() {
    let interval = this.props.interval || [null,null], updateField = false;
    if ( typeof(interval) === 'string' ) {
      let tmp = interval;
      interval = this._getShortcutDates( interval ) || [null, null];
      if ( (! interval.length || ! interval[0] || ! interval[1]) && tmp.match(/;/) ) {
        interval = tmp.split(';').map((t)=> {
          return this._convertTextToDate(t,true);
        }).filter( d => !! d );
      }
    }

    if ( interval && interval[0] && typeof(interval[0]) !== 'number' ) {
      if ( typeof(interval[0]) === 'string' ) {
        interval[0] = this._convertTextToDate( interval[0] );
      }
      interval[0] = interval[0].getTime();
    }
    
    if ( interval && interval[1] && typeof(interval[1]) !== 'number' ) {
      if ( typeof(interval[1]) === 'string' ) {
        interval[1] = this._convertTextToDate( interval[1] );
      }
      interval[1] = interval[1].getTime();      
    }

    if ( typeof(interval[0]) === 'number' ) {
      this._updateInterval( interval[0], 0 );
      updateField = true;
    }

    if ( typeof(interval[1]) === 'number' ) {
      this._updateInterval( interval[1], 1 );
      updateField = true;
    }

    if ( updateField ) { this._updateField( true ); }
    setTimeout( () => {
      this.props.mode.unMount = false;
      if ( updateField ) { this._triggerCallback('update-field'); }
    }, 250 );
  }

  /****************************************************************************
    ===  ===
  ****************************************************************************/
  convertDateToText(date, separator, clock ) {
    return this._convertDateToText( date, separator, clock );
  }

  convertTextToDate(text, wantTimestamp) {
    return this._convertTextToDate( text, wantTimestamp );
  }

  hasError() {
    let {error, opt} = this.state;
    return error ? (opt.messages[error.type] || '') : '';
  }

  getIntervalDate() {
    return this.state.interval || [];
  }

  getConfig() {
    return this.state.opt || {};
  }

  getFields() {
    return [this.refs.inputA, this.refs.inputB];
  }

  updateConfig( config ) {
    if ( ! config ) { return; }

    let {opt} = this.state, update = false;

    if ( config.max ) {
      opt.max     = config.max;
      opt.maxTime = opt.max.getTime();
      update      = true;
    }

    if ( config.min ) {
      opt.min      = config.min;
      opt.minTime  = opt.min.getTime();
      update       = true;
    }

    if ( update ) { this.setState({'opt': opt}); }
  }

  updateInterval( stamp, where ) {
    this._updateInterval( stamp, where );
    this._updateField( true );
  }

  setIntervalDate( interval, ignorCallback, updateCalendarView ) {
    let out = false;
    if ( interval && interval[0] && interval[1] ) {
      if ( typeof(interval[0]) === 'number' ) {
        interval[0] = new Date(interval[0]);
      }
      if ( typeof(interval[1]) === 'number' ) {
        interval[1] = new Date(interval[1]);
      }

      this._updateInterval( null, 0 );
      this._updateInterval( null, 1 );

      this._updateInterval( interval[0], 0 );
      this._updateInterval( interval[1], 1 );
      this._updateField( ignorCallback );
      if ( this.state.error ) {
        this._toggleErrorMessage();
      }
      out = true;


      if ( updateCalendarView ) {
        this.setState({'date': interval[0]});
      }
    }
    return out;
  }

  resetIntervalDate( ignorCallback ) {
    this._updateInterval( null, 0 );
    this._updateInterval( null, 1 );
    this._updateField( ignorCallback );
    if ( this.state.error ) {
      this._toggleErrorMessage();
    }
  }

  hideCalendar() {
    if ( this.props.mode.unMount ) { return; }
    this.setState({'focus':false});
    this.state.opt.focusTarget = null;
  }

  showCalendar() {
    clearTimeout( this.state.opt.hideTimer );
    if ( this.state.focus || this.props.mode.unMount ) { return; }

    this.setState({'focus': true});
  }

  changeShortcuts( shortcuts ) {
    this.setState({'shortcuts': shortcuts});
  }

  changeCalendarLimit( config ) {
    if ( ! config ) { return; }
    let {opt} = this.state, src = this._initCalendarLimit( config );
    this.setState({'opt': {...opt, ...src}});
  }

  clickShortcut( key ) {
    this._clickShortcut(null,{'id': key});
  }

  /****************************************************************************
    ===  ===
  ****************************************************************************/
  _initCalendarLimit( config ) {
    let opt = {}, src = config || {};

    opt.max      = (src.max === null || src.max === false) ? null :
      (src.max !== 'today' ? src.max : new Date());
    opt.min      = src.min !== 'today' ? src.min : (new Date());

    if ( src.min === 'today' && ! src.clock ) {
      opt.min.setHours(0);
      opt.min.setMinutes(0);
      opt.min.setSeconds(0);
      opt.min.getMilliseconds(0);
    }

    opt.maxTime  = opt.max ? opt.max.getTime() : -1;
    opt.minTime  = opt.min ? opt.min.getTime() : -1;
    return opt;
  }

  /****************************************************************************
    ===  ===
  ****************************************************************************/
  _getCloneDate( data, resetClock, setEndClock ) {
    let stamp = (new Date()).getTime() + '';

    if ( data !== null && typeof(data) === 'object' ) {
      stamp = data.getTime() + '';
    } else if ( (data+'').match(/^\d+$/) ) {
      stamp = data + '';
    }

    let d = new Date( parseInt(stamp, 10) );
    return resetClock ? new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0) : (
      setEndClock ? new Date(d.getFullYear(),d.getMonth(),d.getDate(),23,59,59,59) : d
    );
  }

  _updateInterval( stamp, where, viewDate ) {
    let {opt} = this.state, interval = opt.interval || [], index = where, tmp = null;
    if ( stamp !== null && typeof(stamp)==='object') {
      stamp = stamp.getTime();
    }

    if ( this.props.single ) { index = 0; }

    interval[index] = stamp;
    opt.active = {};
    if ( interval.length === 1 ) {
      if      ( interval[0] < opt.minTime && opt.minTime > 0) { interval[0] = opt.minTime; }
      else if ( interval[0] > opt.maxTime && opt.maxTime > 0) { interval[0] = opt.maxTime; }
      tmp = this._getCloneDate( interval[0], true );
      //opt.active[ interval[0] ] = true;
    } else if ( interval[0] === null && interval[1] ) {
      if ( interval[1] > opt.maxTime && opt.maxTime > 0 ) { interval[1] = opt.maxTime; }
      tmp = this._getCloneDate( interval[1] );
      //opt.active[ interval[1] ] = true;
    } else if ( interval[0] && interval[1] === null ) {
      if ( interval[0] < opt.minTime && opt.minTime > 0 ) { interval[0] = opt.minTime; }
      tmp = this._getCloneDate( interval[0], true );
      //opt.active[ interval[0] ] = true;
    }

    if ( tmp ) { opt.active[ tmp.getTime() ] = true; }

    if ( interval[0] && interval[1] ) {
      if ( interval[0] < opt.minTime && opt.minTime > 0 ) { interval[0] = opt.minTime; }
      if ( interval[1] > opt.maxTime && opt.maxTime > 0 ) { interval[1] = opt.maxTime; }

      let count = 0;
      if ( interval[0] > interval[1] ) {
        let holder  = interval[1];
        interval[1] = interval[0];
        interval[0] = holder;
      }
      let a = new Date(interval[0]);
      let b = new Date(interval[1]);
      while ( a.getTime()<=b.getTime() && count<1000 ) {
        tmp = this._getCloneDate( a, true );
        opt.active[ tmp.getTime() ] = true;
        //opt.active[c.getTime()] = true;
        a.setDate( a.getDate()+1 );
        count++;
      }
    }

    this.setState({'interval':interval, 'date': viewDate || this.state.date});
  }

  /****************************************************************************
    === EVENT ===
  ****************************************************************************/
  _focus( e ) {
    let target = e.currentTarget, id  = target.getAttribute( 'id' ) || '';

    if ( target.tagName.match( /input/i) ) {
      let aId = this.refs.inputA.getAttribute('id');
      this.state.opt.focusTarget = id === aId ? 0 : 1;
    }

    if ( this.props.mode.unMount ) {
      this.props.mode.unMount = false;
    }

    this.showCalendar();
    this._triggerCallback('focus');
  }

  _blur() {
    if ( this.props.mode.unMount ) { return; }

    clearTimeout( this.state.opt.hideTimer );
    let index = this.state.opt.focusTarget;
    if ( ! isNaN(index) ) { this._toggleErrorMessage( true ); }

    this.state.opt.hideTimer = setTimeout( () => {
      this.hideCalendar();
    }, 200);
    this._triggerCallback('blur');
  }

  _keydown( e ) {
    let code = e.keyCode, field = e.target, value = field.value
    if ( code !== 38 && code !== 40 ||  e.shiftKey || ! value ) { return; }

    let interval = this.getIntervalDate(), {opt} = this.state;
    let index = this.props.single ? 0 : opt.focusTarget;
    if ( ! interval[index] ) { return; }

    e.preventDefault();
    let pos = this._getCursorPosition( field ), mode = code === 38 ? 1 : -1;
    if ( pos < 3 ) { // day adjustment
      interval[index] += (opt.aDay * mode);
    } else if ( pos < 6 ) { // month adjustment
      let date = new Date(interval[index]), cMonth = date.getMonth(), cYear = date.getFullYear();
      let test = new Date(interval[index]), tMonth = cMonth + mode;

      test.setMonth( tMonth );
      if      ( tMonth > 11 ) { tMonth = 0;  }
      else if ( tMonth < 0  ) { tMonth = 11; }

      if ( mode === 1 && tMonth !== test.getMonth() ) {
        test.setDate(0);
      } else if ( mode === -1 && tMonth !== test.getMonth() ) {
        test.setDate(1);
      }

      interval[index] = test.getTime();
    } else { // year adjustment
      interval[index] += (opt.aDay * 365 * mode);
    }

    if ( opt.maxTime !== -1 && opt.maxTime < interval[index] ) { return; }
    if ( opt.minTime !== -1 && opt.minTime > interval[index] ) { return; }

    let date = new Date(interval[index]);
    this._updateInterval( interval[index], index );
    this._updateField();
    this._setCaretPosition( field, pos );

    this.setState({'date': date});
  }

  _keyup( e ) {
    if ( this.props.mode.unMount ) { return; }
    let {opt} = this.state, field = e.target, index = opt.focusTarget;
    let clock = this.state.clock;
    clearTimeout( opt.keyupTimer );
    setTimeout( () => {
      if ( isNaN(index) || this.props.mode.unMount ) { return; }
      
      let date = this._getDateOrErrorByVerifiedText(field.value);
      if ( date && clock && clock[index] ) {
        clock[index][0] = date.getHours();
        clock[index][1] = date.getMinutes();
        this.setState({'clock': clock});
      }

      let invalid = this._toggleErrorMessage();
      this._updateInterval( date, index );
      this._triggerCallback('keyup', invalid );
    }, 100);
  }

  _click( e ) {
    e.preventDefault();
    let type = 'calendar-item', target = e.target;
    let item = this._getClosestParent( target, type );

    if ( item  ) {
      return this._hasClass(item,'-out-of-month') ? null :
        this._clickCalendarDate( item );
    }

    type = 'calendar-navigation';
    item = this._getClosestParent( target, type );
    if ( item ) {
      this._triggerCallback('navigate-calendar');
      return this._hasClass(item,'-disabled') ? null :
        this._clickCalendarNavigation( item );
    }
  }

  _clickCalendarNavigation( item ) {
    let  stamp = item ? parseFloat( item.getAttribute('data-stamp') ) : 0;
    if ( ! stamp || isNaN(stamp) ) { return; }

    let date = new Date( stamp );
    if ( this.state.opt.view > 1 ) {
      let temp = new Date( this.state.date.getTime() );
      let diff = ((temp.getFullYear()*12)+temp.getMonth()) - ((date.getFullYear()*12)+date.getMonth());
      if ( diff > 1 || diff === 0 ) {
        temp.setMonth(temp.getMonth()-(diff-1) );
        date = temp;
      }
    }
    this.setState({'date': date});
  }

  _clickCalendarDate( item ) {
    let stamp = item ? parseFloat( item.getAttribute('data-stamp') ) : 0;
    if ( ! stamp || isNaN(stamp) ) { return; }

    let {opt} = this.state, clock = this.state.clock;
    let isSelected = this._hasClass( item, 'selected' );
    let index = null, date = new Date( stamp );
    let controller = opt.controller, interval = opt.interval || [];

    if ( interval.length === 1 ) {
      index = 0;
    }
    else if ( controller === 2 && interval.length === 2 ) {
      index = isNaN(opt.focusTarget) ?  -1 : opt.focusTarget;
      if ( index  === -1 ) {
        index = 0; //index = controller.eq(0).is(':focus') ? 0 : 1;
      } else if ( index < 0 ) {
        index = 0;
      } else if ( index > 1 ) {
        index = 1;
      }
      if ( isSelected && interval[index] === stamp ) { date = null; }
    }

    if ( date && clock && clock[index] ) {
      date.setHours( clock[index][0] );
      date.setMinutes( clock[index][1] );
    }

    this._updateInterval( date, index );
    this._updateField();

    if ( this.state.error ) {
      this._toggleErrorMessage();
    }

    // Auto set focus to to-date-textfield
    //if ( index === 0 && ! this.props.singleField && this.refs.inputB && ! this.refs.inputB.value ) {
    if ( index === 0 && ! this.props.singleField && ! this.props.single && this.refs.inputB && ! this.refs.inputB.value ) {
      this.refs.inputB.focus();
    }
  }


  _clickShortcut( e, data ) {
    if ( e ) { e.preventDefault(); }

    let dates = this._getShortcutDates( data.id );
    if ( ! dates || ! dates[0] || ! dates[1] ) { return; }

    this._updateInterval( null, 0 );
    this._updateInterval( null, 1 );

    this._updateInterval( dates[0], 0 );
    this._updateInterval( dates[1], 1 );
    this._updateField();
    if ( this.state.error ) {
      this._toggleErrorMessage();
    }
  }

  _changeTimer( value, key, pin ) {
    let {opt} = this.state, {clock, interval} = this.state;
    let index = typeof(pin) === 'number' ? pin : (opt.focusTarget || 0);
    if ( ! clock || ! clock[index] ) { return; }

    let number = parseInt( value.replace(/^0/, ''), 10 );

    if ( key === 'hour') {
      clock[index][0] = number;
      this.setState({'clock': clock});
    } else if ( key === 'minute' ) {
      clock[index][1] = number;
      this.setState({'clock': clock});
    }

    if ( ! interval[index] ) { return; }
    let date = new Date( parseInt((interval[index]+''), 10) );
    date.setHours( clock[index][0] );
    date.setMinutes( clock[index][1] );

    this._updateInterval( date, index );
    this._updateField();
  }

  /****************************************************************************
  ****************************************************************************/
  _getShortcutDates( key ) {
    if ( ! key ) { return []; }

    let now = new Date(), dates = [], aDay = 24*60*60*1000, cloned = null, end = null, start = null;
    let operation = ((key || '').match(/^(\+|\-)/) || [])[1];
    let number = parseInt((((key || '').match(/(\d+)[\w]+/) || [])[1] || '0'));

    if ( key.match(/today/) ) {
      if ( operation === '-' ) {
        start = this._getCloneDate(now,true);      
        dates = [(new Date(start.getTime() - (number*aDay))), now];
      } else if ( operation === '+' ) {
        end = this._getCloneDate(now,null,true);
        dates = [now, (new Date(end.getTime() + (number*aDay)))];
      } else {
        dates = [this._getCloneDate(now,true), this._getCloneDate(now,null,true)];
      }
    } else if ( key.match( /week/) ) {
      let day = now.getDay() || 7, passed = day - 1;
      cloned  = new Date((now.getTime()-(passed*aDay)));
      start   = this._getCloneDate(cloned, true);

      cloned  = new Date((start.getTime() + (6*aDay)));
      end     = this._getCloneDate(cloned,null,true);

      if ( operation === '-' ) {
        dates = [(new Date(start.getTime() - (number*aDay*6))), now];
      } else if ( operation === '+' ) {
        dates = [now, (new Date(end.getTime() + (number*aDay*6)))];
      } else {
        dates = [start, end];
      }
    } else if ( key.match(/month/) ) {
      let splited = key.split(';');
      if ( splited.length === 1 ) {
        if ( operation === '-' ) {
          dates = [this._getShortcutMonth(operation, number), now];
        } else if ( operation === '+' ) {
          dates = [now, this._getShortcutMonth(operation, number)];
        } else {
          dates = [this._getShortcutMonth(null, number), this._getShortcutMonth('+', number)];
        }
      } else {
        dates = splited.map( (v,i) => {
          let o = ((v || '').match(/^(\+|\-)/) || [])[1];
          let n = parseInt((((v || '').match(/(\d+)[\w]+/) || [])[1] || '0'));
          let d = this._getShortcutMonth( o, n );

          if ( i ) { d.setDate(0); }
          return d;
        });
      }
    }
    return dates;
  }

  _getShortcutMonth( operation, number ) {
    if ( ! number || isNaN(number) ) { number = 0; }

    let cloned = new Date();
    cloned.setDate(1);

    let date = this._getCloneDate(cloned, true);
    if ( operation === '-' ) {
      date.setMonth((date.getMonth() - number));
    } else if ( operation === '+' ) {
      date.setMonth( (date.getMonth() + number + 1) );
      date.setDate(0);          
    }
    return date;
  }


  /****************************************************************************
    === OUTPUT ===
  ****************************************************************************/
  _getCalendar( noTab ) {
    let {opt} = this.state, index = opt.focusTarget || 0;
    let clock = this.state.clock || [];
    let date = this.state.date ? new Date( this.state.date.getTime() ) : date;
    let loop = (opt.view || 1) - 1, month = date.getMonth(), tables = [];

    for ( let i = 0; i <= loop; i++ ) {
      date.setMonth((month-i));
      tables.push( this._getCalendarView(date, noTab) );
    }

    let reverse = tables.reverse(), timer = clock[index] ? {
      'hourValue'  : (clock[index][0] < 10 ? ('0'+clock[index][0]) : clock[index][0])+'',
      'minuteValue': (clock[index][1] < 10 ? ('0'+clock[index][1]) : clock[index][1])+'',
      'hours'      : opt.hours,
      'minutes'    : opt.minutes
    } : null;

    return (
      <div className="collection">
        <ul>
          { reverse.map( (table, i) => {
              let type = 'calendar-holder' + (i === 0 ? ' -first' : '') +
                (i === loop ? ' -last' : '');
              return (<li className={type} key={'calendar-table-'+i}>{table}</li>);
            })
          }
        </ul>
        { timer &&
          <div className="calendar-timer">
            <div className="timer-cnt">
              <div className="timer-hour">
                <label htmlFor="calendar-hour">Time</label>
                <select tabIndex={noTab ? '-1' : ''} id="calendar-hour" name="input-hour" className="select-box" value={timer.hourValue}
                  onChange={(e)=> { this._changeTimer(e.target.value,'hour', index); }}>
                  { timer.hours.map( (data, i) => {
                    return <option key={'calendar-hour-'+i} value={data}>{data}</option>
                  }) }
                </select>
              </div>
              <div className="timer-minute">
                <label htmlFor="calendar-minute">Minute</label>
                <select tabIndex={noTab ? '-1' : ''} id="calendar-minute" name="input-minute" className="select-box" value={timer.minuteValue}
                  onChange={(e)=> { this._changeTimer(e.target.value,'minute',index); }}>
                  { timer.minutes.map( (data, i) => {
                    return <option key={'calendar-minute-'+i} value={data}>{data}</option>
                  }) }
                </select>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }

  _getCalendarView( date, noTab ) {
    if ( ! date ) { date = new Date(); }
    let {yearNavigation} = this.state;
    let data  = this._getCalendarData( date, noTab );
    let table = this._getCalendarTable( data, noTab );
    let yearNavigationInfo = [];

    if ( yearNavigation ) {
      let previous = new Date(data.minStamp);
      previous.setDate(1);
      previous.setMonth( (previous.getMonth() + 1));
      previous.setFullYear( previous.getFullYear() - 1 );
      yearNavigationInfo[0] = {'stamp' : previous.getTime(), 'title': previous.getFullYear() };


      let next = new Date(data.maxStamp);
      next.setDate(1);
      next.setMonth( (next.getMonth() - 1));      
      next.setFullYear((next.getFullYear() + 1));
      yearNavigationInfo[1] = {'stamp' : next.getTime(), 'title': next.getFullYear() };
    }

    return (
      <div className="calendar-view">
        <div className="calendar-header" role="">
          <div className="calendar-name">{data.name}</div>
          <div className={'calendar-navigation-holder -previous' + (yearNavigation ? ' -has-year-navigation' : '')}>
            { yearNavigation && <a tabIndex={noTab ? '-1' : ''} href="" className="calendar-navigation -previous -year" title={yearNavigationInfo[0].title} data-stamp={yearNavigationInfo[0].stamp}>
                <span className="aria-visible">{data.minAria}</span>
              </a>
            }
            <a tabIndex={noTab ? '-1' : ''} href="" className="calendar-navigation -previous" title={data.minAria} data-stamp={data.minStamp}>
              <span className="aria-visible">{data.minAria}</span>
            </a>
          </div>
          <div className={'calendar-navigation-holder -next' + (yearNavigation ? ' -has-year-navigation' : '')}>
            <a tabIndex={noTab ? '-1' : ''} href="" className="calendar-navigation -next" title={data.maxAria} data-stamp={data.maxStamp}>
              <span className="aria-visible">{data.maxAria}</span>
            </a>
            { yearNavigation &&  <a tabIndex={noTab ? '-1' : ''} href="" className="calendar-navigation -next -year" title={yearNavigationInfo[1].title} data-stamp={yearNavigationInfo[1].stamp}>
                <span className="aria-visible">{data.minAria}</span>
              </a>
            }
          </div>
        </div>
        {table}
      </div>
    );
  }

  _getCalendarData( date ) {
    if ( ! date ) { return ''; }

    let {opt, clock} = this.state;
    let d = this._getDateAsList( date ), c = null, f = new Date(d[0],d[1],1,0,0,0,0);
    let monthTimestamp = f.getTime(), row = [], count = 0, day = opt.aDay;
    let current = opt.nowTime || 0, i = 0, j = 0;
    let active = opt.active || {}, min = opt.minTime || -1, max = opt.maxTime || -1;
    let focus  = opt.focusItem || {};

    if ( f.getDay() ) {
      f.setDate( 1-(f.getDay()-1) );
    } else {
      f.setDate( 1-6 );
    }

    let minStamp = f.getTime()-day-1000;
    let minMode  = min > -1 ? (f.getTime() <= min ? 'disabled' : '') : '';

    for ( i=0; i<6; i++ ) {
      let column = [];
      for ( j=0; j<7; j++ ) {
        c = new Date( f.getTime() );
        c.setDate( c.getDate()+ (count++) );

        let t = c.getTime(), n = this._getDateAsList(c), tMax = t, tMin = t;
        if ( clock ) { tMin = t - 1 + (24*60*60*1000); }

        let mode = ''+
          (max > -1 ? (max<tMax ? ' -disabled': '') : '' ) +
          (min > -1 ? ((min-1000)>tMin ? ' -disabled': '') : '' ) +
          (n[1] === d[1] ? '' : ' -out-of-month') +
          (current>=t && current<(t+day) ? ' -is-today' : '') +
          (active && active[t] ? ' -selected' : '')+
          (focus && focus[t] ? ' -focus' : '' ) +
          ( j===0 || j===6 ? ' -end-column' : '' );

        column.push({
          'row'   : i+1,
          'aria'  : this._getCalendarDateAriaText( c ),
          'name'  : c.getDate(),
          'mode'  : mode,
          'off'   : mode.match( /out-of-month|disabled/) ? true: false,
          'stamp' : t,
          'date'  : this._convertDateToText(c,''),
          'selected': active && active[t] ? true : false
        });
      }
      row.push({'column':column});
    }

    c.setDate(1);
    if ( c.getMonth() === d[1] ) { c.setMonth(d[1]+1); }

    let maxStamp = c.getTime()+day;
    let maxMode  = max > -1 ? (max<c.getTime() ? 'disabled' : '') : '';

    let loop = opt.week.length, week = [];
    for ( i=0; i<loop; i++ ) {
      j = i===0 ? (loop-1) : i-1;
      week[j] = {
        'aria':opt.week[i],
        'name':opt.week[i].substring(0,2)
      };
    }

    let name  = (opt.month[d[1]] + ' ' +d[0]);
    if ( f.getMonth() === d[1] ) { f.setMonth(d[1]-1); }

    let aPrevious = 'Vis '+this._getCalendarDateAriaText( f, true ).toLowerCase();
    let aNext     = 'Vis '+this._getCalendarDateAriaText( c, true ).toLowerCase();

    return {
      'name'      : name,
      'minMode'   : minMode,
      'minStamp'  : minStamp,
      'minAria'   : aPrevious,
      'maxMode'   : maxMode,
      'maxStamp'  : maxStamp,
      'maxAria'   : aNext,
      'week'      : week,
      'row'       : row,
      'monthStamp': monthTimestamp
    };
  }

  _getCalendarTable( data, noTab ) {
    if ( ! data ) return;

    let week = data.week.map( function(item, i){
      return (
        <th role="presentation" key={i+'-h'}>
          <span className="aria-visible">{item.aria}</span>
          <span className="week-name" aria-hidden="true">{item.name}</span>
        </th>
      );
    });

    let out = data.row.map( function(row, i){
      let column = row.column.map( function(item, j){
        let type = 'calendar-item at-row'+i+
          (item.mode ? ' '+item.mode : '') +
          (item.selected ? ' selected' : '');

        return (
          <td key={j+'-c'} className={item.off ? 'off':'on'}>
            <a href="#" className={type} aria-selected={item.selected} data-stamp={item.stamp} tabIndex={item.off || noTab ? '-1': ''}>
                <span className="aria-visible">{item.aria}</span>
                <span aria-hidden="true">{item.name}</span>
            </a>
          </td>
        );
      });
      return (<tr role="presentation" key={i+'t'}>{column}</tr>);//
    });

    return (
        <table className="calendar-table" aria-label="Kalender" role="application">
          <thead><tr className="calendar-table-header calendar-weak" role="presentation">{week}</tr></thead>
          <tbody>{out}</tbody>
        </table>
    );
  }

  _getDateAsList( date ) {
    return [
      date.getFullYear(), date.getMonth(), date.getDate(),
      date.getHours(), date.getMinutes(), date.getSeconds()
    ];
  }

  _getCalendarDateAriaText( date, onlyMonthAndYear ) {
    if ( ! date ) { return ''; }
    let {opt} = this.state;
    let day   = opt.week[ date.getDay() ];
    let month = opt.month[date.getMonth()];
    return onlyMonthAndYear ? month +' '+date.getFullYear() :
      day + ', '+date.getDate()+'. '+month +' '+date.getFullYear();
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

  _convertTextToDate( text, wantTimestamp ) {
    let r = /^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.](\d{4})(\s+(([0-1]\d)|(2[0-3])):([0-5]\d):([0-5]\d))?/;
    let t = (text ||'').replace( /^\s+/,'').replace( /\s+$/,'');
    let m = t.match( r ), s = null;
    if ( m ) {
      s = [m[3], m[2], m[1], m[5], m[8], (m[9]|| '0'), '0'];
    } else {
      r = /^(\d{4})[\/\-\.](0?[1-9]|1[012])[\/\-\.]([0][1-9]|[12][0-9]|3[01])(\w+(([0-1]\d)|(2[0-3])):([0-5]\d):([0-5]\d))?/;
      m = t.match( r );
      if ( m ) {
        s = [m[1], m[2], m[3], m[5], m[8], (m[9]|| '0'), '0'];
      }
    }

    if ( ! s ) { return; }

    for ( let i=0; i<s.length; i++ ) {
      s[i] = parseInt( ((s[i] || '').replace( /^0/, '' ) || '0'), 10);
    }
    let date = new Date(s[0],s[1]-1,s[2],s[3],s[4],s[5],s[6]);

    if ( text.match( /Z$/i) ) {
      let zone = this._getTimeZone( date ).replace( /\:00/g, '' );
      let number = parseFloat( zone ), hour = date.getHours();
      date.setHours( (hour + number) );
    }

    return wantTimestamp ? date.getTime() : date;
  }

  _getTimeZone( date ) {
    let current =  date || new Date();
    var offset = current.getTimezoneOffset(), o = Math.abs(offset);
    return (offset < 0 ? '+' : '-') + ('00' + Math.floor(o / 60)).slice(-2) + ':' + ('00' + (o % 60)).slice(-2);
  };

  /************************************************************************/
  _toggleErrorMessage( onBlur ) {
    let {error} = this.state;
    let field = [this.refs.inputA, this.refs.inputB], invalid = null;
    for ( let i=0; i<field.length; i++ ) {
      if ( ! field[i] || ! field[i].value ) { continue; }

      //let date = this._getDateOrErrorByVerifiedText( field[i].value );
      let date = this._convertTextToDate( field[i].value );
      if ( date ) {
        if ( this._isDateLessThanMin(date) ) {
          invalid = {'index': i, 'type': 'DATE_IS_LESS_THAN_MIN'};
        } else if ( this._isDateGreatThanMax(date) ) {
          invalid = {'index': i, 'type': 'DATE_IS_GREAT_THAN_MAX'};
        }
      } else {
        invalid ={'index': i, 'type': 'INVALID_DATE_TEXT'};
      }

      if ( onBlur && ! error && invalid ) {
        this.setState({'error': invalid});
      }

      if ( invalid ) { return invalid; }
    }

    if ( error && ! invalid ) {
      this.setState({'error': null});
    }
  }

  _getDateOrErrorByVerifiedText( text ) {
    let date = text ? this._convertTextToDate( text ) : null;
    if ( ! date ) { return null; }

    let invalid = this._isDateLessThanMin( date ) || this._isDateGreatThanMax( date );
    return invalid ? null : date;
  }

  _isDateLessThanMin( date ) {
    if ( ! date ) { return false; }
    let {opt} = this.state,  time = date.getTime();
    return opt.minTime > -1 && (time + 1000) <= opt.minTime;
  }

  _isDateGreatThanMax( date ) {
    if ( ! date ) { return false; }
    let {opt} = this.state,  time = date.getTime();
    return opt.maxTime > -1 && time > opt.maxTime;
  }

  _getDataTextByFieldvalue( value ) {
    let date = value ? this.convertTextToDate(value) : null;
    if ( ! date ) { return ''; }

    let now = new Date();
    if ( now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear() ) {
      return 'I dag';
    }

    let yesterday = new Date( now.getTime() );
    yesterday.setDate( (yesterday.getDate() - 1) );
    if ( yesterday.getDate() === date.getDate() && yesterday.getMonth() === date.getMonth() && yesterday.getFullYear() === date.getFullYear() ) {
      return 'I går';
    }

    let tomorrow = new Date( now.getTime() );
    tomorrow.setDate( (tomorrow.getDate() + 1) );
    if ( tomorrow.getDate() === date.getDate() && tomorrow.getMonth() === date.getMonth() && tomorrow.getFullYear() === date.getFullYear() ) {
      return 'I morgen';
    }

    return '';
  }

  _updateField( ignorCallback ) {
    let {opt} = this.state, interval = opt.interval || [];
    let clock = this.state.clock ? true : false;
    let field = [this.refs.inputA, this.refs.inputB];
    let item  = [this.refs.itemA, this.refs.itemB];
    for ( let i=0; i<field.length; i++ ) {
      if ( ! field[i] ) { continue; }

      let text = ! interval[i] ? '' :
        this._convertDateToText( (new Date(interval[i])), null, clock );
      field[i].value = text;

      if ( item[i] ) {
        let datatext = this._getDataTextByFieldvalue(text);
        item[i].setAttribute('data-fieldtext', datatext);
      }
    }

    if ( ! ignorCallback ) {
      this._triggerCallback('update-field');
    }
  }

  _getCursorPosition( field ) {
    let position = 0;
    if ( field ) {
      if ( 'selectionStart' in field ) {          // Standard-compliant browsers
        position = field.selectionStart;
      } else if ( document.selection ) {
        let sel = document.selection.createRange();
        let selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -field.value.length);
        position =  sel.text.length - selLen;
      }
    }
    return position;
  }

  _setCaretPosition(field, pos) {
    if ( field.setSelectionRange ) { // Modern browsers
      field.focus();
      field.setSelectionRange(pos, pos);
    } else if ( field.createTextRange ) { // IE8 and below
      var range = field.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
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

  _addClass( target, type ){
    if ( ! target ) { return; }

    let v = target.getAttribute('class');
    if ( ! v ) { return target.setAttribute('class', type); }

    let r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
    if ( ! v.match(r) ) { target.setAttribute('class',  this._trim(v+' '+type,true)); }
  }

  _removeClass( target, type ) {
    if ( ! target ) { return; }
    
    let v = target.getAttribute('class');
    if ( ! v ) { return; }

    let r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
    if ( v.match( r ) ) {
      target.setAttribute( 'class', this._trim((v.split(r)).join(' '), true) );
    }
  }

  _trim ( text, multipleWhiteSpace ) {
    let out = (text || '').replace( /^\s+/, '').replace( /\s+$/g, '');
    return multipleWhiteSpace ? out.replace( /\s+/g, ' ' ) : out;
  }

  _triggerCallback( action, invalid ) {
    let {callback} = this.props;
    if ( typeof(callback) !== 'function' ) { return; }

    let inputA = this.refs.inputA || {}, inputB = this.refs.inputB || {};
    callback({
      'action':action,
      'from' : inputA.value,
      'to'   : inputB.value,
      'stampFrom': this._convertTextToDate( inputA.value, true),
      'stampTo': this._convertTextToDate( inputB.value, true),
      'refs': [inputA, inputB],
      'error': invalid || this.state.error,
      'componentId' : this.props.componentId,
      'componentKey': this.props.componentKey
    });
  }
}

/*
CalendarComponent.propTypes = {
};

const Calendar = connect( () => {
  return {};
}, (dispatch) => {
  return {
    dispatch
  };
})(CalendarComponent);

export default Calendar;
*/