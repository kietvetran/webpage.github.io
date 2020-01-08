import React from 'react';

export const CalendarWidget = ( config ) => {
  let { calendar, tabIndex, keydown, keyup, focus, blur, click} = config;

  return <div className="calendar-widget" onBlur={blur} onFocus={focus} tabIndex={tabIndex === false ? '-1' : ''}>
    <div className="collection">
      <ul>
        { calendar.tableList.map( (data, x) => {
            let type = 'calendar-holder' + (x === 0 ? ' -first' : '') + ((x+1) === calendar.tableList.length ? ' -last' : '');
            return <li className={type} key={'calendar-table-'+x}>
              <div className="calendar-view">
                <div className="calendar-header" role="">
                  <div className="calendar-name">{data.name}</div>
                  <a tabIndex={calendar.noTab ? '-1' : ''} href="#" role="button" className="calendar-navigation -previous"
                    data-stamp={data.minStamp} onClick={(e)=>{click(e, 'calendar-navigation', {...data, 'stamp': data.minStamp})}}
                  ><span className="aria-visible">{data.minAria}</span></a>
                  <a tabIndex={calendar.noTab ? '-1' : ''} href="#" role="button" className="calendar-navigation -next"
                    data-stamp={data.maxStamp} onClick={(e)=>{click(e, 'calendar-navigation', {...data, 'stamp': data.maxStamp})}}
                  ><span className="aria-visible">{data.maxAria}</span></a>
                </div>
                <table className="calendar-table" aria-label="Kalender" role="application">
                  <thead>
                    <tr className="calendar-table-header calendar-weak" role="presentation">
                      { data.week.map( (item,i) =>{
                          return <th role="presentation" key={'calendar-table-header-'+i+'-h'}>
                            <span className="aria-visible">{item.aria}</span>
                            <span className="week-name" aria-hidden="true">{item.name}</span>
                          </th>                  
                      }) }
                    </tr>
                  </thead>
                  <tbody>
                    {data.row.map( (row, i) =>{
                      return <tr role="presentation" key={i+'t'}>
                        { row.column.map( function(item, j){
                            let type = 'calendar-item at-row'+i+
                              (item.mode ? ' '+item.mode : '') +
                              (item.selected ? ' selected' : '');

                            return <td key={j+'-c'+'-'+i} className={item.off ? 'off':'on'}>
                              <a href="#" role="button" className={type} aria-selected={item.selected} tabIndex={item.off || calendar.noTab ? '-1': ''}
                                data-stamp={item.stamp} onClick={(e)=>{ click(e,'calendar-item', item)}}
                              >
                                <span className="aria-visible">{item.aria}</span>
                                <span aria-hidden="true">{item.name}</span>
                              </a>
                            </td>
                        }) }
                      </tr>
                    }) }
                  </tbody>
                </table>
              </div>
            </li>;
          })
        }
      </ul>
    </div>
  </div>
};

export const CalendarShortcuts = ( config ) => {
  let {shortcuts, tabIndex, clickShortcut} = config;

  return (shortcuts || []).length > 0 ? <ul className="shortcut-list">
    { shortcuts.map( (data, i) => {
        return <li key={'calendar-shortcut-'+i} className={data.type || ''}>
          <a tabIndex={tabIndex === false ? '-1' : ''} href="#" role="button" className="link" onClick={(e)=>{clickShortcut(e,data);}}>{data.name}</a>
        </li>
    }) }
  </ul> : null;
};


/* Unuse the component, because of "ref" attribute
export const CalendarFieldset = ( config ) => {
  let {
    opt, placeholder, clock, error, fieldStyle, disabled, clearButton, interval,
    keydown, keyup, focus, blur, clearCalendar
  } = config;
  let {fieldA, fieldB, messages, legend, label} = opt;
  let textholder = placeholder || ['',''];
  let maxLength  = clock ? '16' : '10';
  let invalidInputA = (error || {}).index === 0;
  let invalidInputB = (error || {}).index === 1;

  return <fieldset>
    <legend className="input-label">{legend}</legend>
    <ul className="field-list-wrapper">
      <li className="field-list-cell">
        <label htmlFor={fieldA.id} className="input-label">{((label || [])[0] || textholder[0] || 'A' )}</label>
        <div ref="itemA" className="field-list-item">
          <input ref="inputA" name={fieldA.name} id={fieldA.id} type="text" defaultValue={fieldA.defaultValue} maxLength={maxLength}
            placeholder={textholder[0]}
            className={'textfield input-a' + (invalidInputA ? ' -invalid_' : '') + (fieldStyle ? ' '+fieldStyle : '')}
            autoComplete="off" spellCheck="false" autoCapitalize="off" autoCorrect="off"
            aria-label={fieldA.label} aria-invalid={invalidInputA} disabled={disabled ? true : false}
            onBlur={blur} onKeyUp={keyup} onFocus={focus} onKeyDown={keydown}/>
        </div>
      </li>
      <li className="field-list-cell">
        <label htmlFor={fieldB.id} className="input-label">{((label || [])[1] || textholder[1] || 'B' )}</label>
        <div ref="itemB" className="field-list-item">
          <input ref="inputB" name={fieldB.name} id={fieldB.id} type="text" defaultValue={fieldB.defaultValue} maxLength={maxLength}
            placeholder={textholder[1]}
            className={'textfield input-b' + (invalidInputB ? ' -invalid_' : '')  + (fieldStyle ? ' '+fieldStyle : '')}
            autoComplete="off" spellCheck="false" autoCapitalize="off" autoCorrect="off"
            aria-label={fieldB.label} aria-invalid={invalidInputB} disabled={disabled ? true : false}
            onBlur={blur} onKeyUp={keyup} onFocus={focus} onKeyDown={keydown}/>
        </div>
      </li>
      {clearButton && (interval[0] || interval[1]) && <li className="field-list-item -clear-holder">
          <a href="#" role="button" title={typeof(clearButton) === 'string' ? clearButton : ''}
            className="icon-btn -cross -active -ex-small-icon-view clear-btn" onClick={(e)=>{clearCalendar(e)}}>
              <span className="aria-visible">Nullstilt kalendar</span>
          </a>
        </li>
      }
    </ul>
  </fieldset>
};
*/