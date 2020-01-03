import {readCookie, createCookie, eraseCookie} from '../components/common/General';
import { put, take, takeEvery } from 'redux-saga/effects';
import * as actionsTypes from '../actions/actionTypes';
import * as appActions from '../actions/appActions';
import * as userActions from '../actions/signInActions';
//import * as lineActions from '../actions/lineActions';
//import * as valueActions from '../actions/valueActions';
//import * as operatorActions from '../actions/operatorActions';
import * as ajax from '../ajax/base';

function* setUserData() {
  //yield put(userActions.userDataLoading());

  let code = readCookie('code');
  if ( code ) { eraseCookie('code'); }

  let uri = window.location.origin;
  if ( ! uri.match(/https/i) && ! uri.match(/\/\/localhost\:/i)  ) {
    uri = uri.replace(/http/i, 'https');
  }

  const response = yield ajax.get('getUser?uri='+uri+(code ? ('&code='+code) : ''));
  const result = (response || {}).result || {};

  if (result.redirect ) {
    let href = window.location.href || '';
    if ( ! href.match(/https/i) && ! href.match(/\/\/localhost\:/i)  ) {
      href = href.replace(/http/i, 'https');
    }
    createCookie('localUrl', href, .5 );
    window.location.href = result.redirect;
  } else if ( result.error ) {
    //yield put(userActions.sendCredentials(result));
    yield put(userActions.userDataValid(result));
  } else if ( result.company && result.token && result.name) {
    createCookie('csurf', (result.csurf || ''), 365 );
    yield put(userActions.userDataValid(result));
  }
}

function* getAppEnvironment() {
	const response = yield ajax.get('getEnvironment');
  yield put(appActions.appInitComplete({'environment': response.result}));
}

function* getLine() {
  const response = yield ajax.get('getLine') || {};
  yield put(lineActions.setLineSuccess( (response.result || {}).data ));
}

function* getValue() {
  const response = yield ajax.get('getValue') || {};
  yield put(valueActions.setValueSuccess(response.result));
}

function* getOperator() {
  const response = yield ajax.get('getOperator') || {};
  yield put(operatorActions.setOperatorSuccess(response.result));
}

function* getPSdrilldownURL() {
  const response = yield ajax.get('getPSdrilldownURL');
  yield put(appActions.appInitComplete({'psDrilldownURL': response.result}));
}

function* sleep(time) {
  yield new Promise(resolve => setTimeout(resolve, time));
}

export function* appInitSaga() { // eslint-disable-line
  yield sleep(500);

  //yield setUserData();
  yield getAppEnvironment();
  //yield getPSdrilldownURL();
  //yield getLine();
  //yield getValue();
  //yield getOperator();
  //yield takeEvery(actionsTypes.APP_INIT, getAppEnvironment);
  //yield put(appActions.appInitComplete({'environment': 'kiet'}));
}
