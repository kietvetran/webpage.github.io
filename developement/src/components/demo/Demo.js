import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {getPagingList} from '../common/Function';

import { Message } from '../common/util/message/Message';
import { Pagination } from '../common/util/pagination/Pagination';
import { Breadcrumb } from '../common/util/breadcrumb/Breadcrumb';
import { Calendar } from '../common/calendar/Calendar';
import { Suggestion } from '../common/suggestion/Suggestion';
import { Chart } from '../common/chart/Chart';

import './Demo.scss';

class Demo extends Component {
  static defaultProps = {'mode': {} }

  constructor(props) {
    super(props);
    this.state = {
      'menuList': [
        {'id': 'suggestion', 'name': 'Suggestion', 'config': {'type':'suggestion'} },
        {'id': 'calendar',   'name': 'Calendar', 'config': {'type':'calendar'} },
        {'id': 'breadcrumb', 'name': 'Breadcrumb', 'config': {'type': 'breadcrumb', 'source': [{'url':'', 'name': 'Alfa'},{'url':'', 'name': 'Beta'}, {'url':'', 'name': 'Gama'}]}},
        {'id': 'pagination', 'name': 'Pagination', 'config': {'type': 'pagination', 'source': {'total': 99, 'from': 40, 'size': 10 }} },
        [
          {'id': 'dialog-info',    'name': 'Info', 'config': {'type': 'message', 'source': {'skin': 'info', 'text': 'test'}} },
          {'id': 'dialog-warning', 'name': 'Warning', 'config': {'type': 'message', 'source': {'skin': 'warning', 'text': 'test'}} },
          {'id': 'dialog-danger',  'name': 'Danger', 'config': {'type': 'message', 'source': {'skin': 'danger', 'text': 'test'}} },
          {'id': 'dialog-success', 'name': 'Auccess', 'config': {'type': 'message', 'source': {'skin': 'success', 'text': 'test'}} },
        ], [
          {'id': 'chart-progress', 'name': 'Chart progress', 'config': {'type': 'chart', 'source': {'data': 40, 'type': 'progress'}}},
          {'id': 'chart-pie',      'name': 'Chart pie', 'config': {'type': 'chart', 'source': {
            'data': [
              {'value': 25, 'text': 'Alfa' },
              // {'value': 50, 'text': 'Beta' },
              // {'value': 90, 'text': 'Gamma'},
              {'value': 75, 'text': 'Delta'}
            ],
            'type': 'pie'
          }}},
          {'id': 'chart-bar', 'name': 'Chart bar', 'config': {'type': 'chart', 'source': {
            'data': [[20,50,90,40], [40,10,70,80], [10,90,20,30]],
            'highest': 120,
            'type': 'bar',
            'fill': true,
            'xAxis': {'grid': 10, 'text': ['1.jan','2.jan','3.jan','4.jan']},
            'yAxis': {'grid': 10, 'separation': 4, 'unit': 'Kr' },
          }}},
          {'id': 'chart-line', 'name': 'Chart line', 'config': {'type': 'chart', 'source': {
            'data': [[20,50,90,40], [40,10,70,80]],
            'highest': 120,
            'type': 'line',
            'fill': true,
            'xAxis': {'grid': 10, 'text': ['1.jan','2.jan','3.jan','4.jan']},
            'yAxis': {'grid': 10, 'separation': 4, 'unit': 'Kr' },
          }}},
        ], [
          {'id': 'profile',        'name': 'Profile',        'path': '/profile'},
          {'id': 'profile-wizard', 'name': 'Profile-wizard', 'path': '/profileWizard'}
        ]
      ]
    };
    this._click  = this._click.bind(this);
    this._calendarCallback   = this._calendarCallback.bind(this);
    this._suggestionCallback = this._suggestionCallback.bind(this);

  }

  render() {
    const {menuList} = this.state;

    return <div className="demo-wrapper">
      <h1>Demo</h1>
      <div className="demo-conttent">
        <ul className="menu-list">
          { menuList.map( (menu,j) => {
              return <li className="menu-item" key={'lab-menu-item-'+j}>
                { (menu instanceof Array ? menu : [menu]).map( (data,i) => (
                    data.path ?
                      <Link to={data.path} key={'lab-menu-item-'+j+'-'+i} className="link">
                        {data.name}
                      </Link> : <a key={'lab-menu-item-'+j+'-'+i} href="#" className="link" role="button"
                        onClick={(e)=>{this._click(e,'menu-item', data)}}
                      >{data.name}</a>
                ))}
              </li>
          })}
        </ul>
      </div>
    </div>
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data) {
    if ( e ) { e.preventDefault(); }

    if ( key === 'menu-item' && data ) {
      this._openDialogBox( data );
    } else if ( key === 'change-page' && data ) {
      let found = this.state.menuList.find((d) => d.id === 'pagination');
      if ( ! found ) { return; }

      let cloned = {...found };
      cloned.config.source = {...found.config.source, ...data};
      this._openDialogBox( cloned );
    } 
  }

  _openDialogBox( data ) {
    let component = null, config = (data || {}).config;
    if ( ! config ) { return; }
    
    if ( config.type === 'message' ) {
      component = <Message {...config.source} />
    } else if ( config.type === 'pagination' ) {
      let list = getPagingList(config.source);
      component = <Pagination pageList={list} click={this._click}/>
    } else if ( config.type === 'breadcrumb' ) {
      component = <Breadcrumb list={config.source} />
    } else if ( config.type === 'calendar' ) {
      component = <div style={{'height': '500px'}}>
        <Calendar clock={true} tabIndex={false} view={2}
          fieldStyle="-normal" legend="Calendar" min={0} max={0} yearNavigation={true}
          placeholder={['from', 'To']} callback={this._calendarCallback} interval=""
          shortcuts={[
            {'id': '-today',         'name': 'Idag'       },
            {'id': '-week',          'name': 'Denne uka'  },
            {'id': '-month',         'name': 'Denne mnd'  },
            {'id': '-1month;month',  'name': 'Forrige mnd'}
          ]}
        />
      </div>
    } else if ( config.type === 'suggestion' ) {
      component = <div style={{'height': '500px'}}>
        <Suggestion placeholder="Search..." callback={this._suggestionCallback} maxSearch={5} searchTimer={30} searchKeys={['id','name']}
          fieldName="my-demo-suggestion" fieldStyle="-normal" inputField={true} asEnterCharacter=',' ignorInnerTabbing={true}
          staticFilter={true} allowFreeTextTag={true} label="Suggestion demo"
          list={[
            {'id':'1', 'name':'Donald Duck'},
            {'id':'2', 'name':'Huey'},
            {'id':'3', 'name':'Dewey'},
            {'id':'4', 'name':'Louie'},
            {'id':'5', 'name':'Daisy Duck'},
            {'id':'6', 'name':'Uncle Scrooge'},
            {'id':'7', 'name':'Beagle Boys'},
            {'id':'8', 'name':'Pluto'},
            {'id':'9', 'name':'Mickey Mouse'}
          ]} 
        />
      </div>
    } else if ( config.type === 'chart' ) {
      component = <Chart {...config.source}/>
    }

    this.props.actions.openDialog({'component': component});
  }


  /****************************************************************************
  ****************************************************************************/
  _calendarCallback( note ) {
  }

  _suggestionCallback( action, suggestion, recognition ) {
  }
}

Demo.propTypes = {
  //'contract' : PropTypes.shape({}).isRequired,
  //'deviation': PropTypes.shape({}).isRequired,
  'actions'  : PropTypes.shape({}).isRequired
};

export default connect((state, props) => {
  return {
    //'deviation': state.deviation
  };
}, null)(Demo);