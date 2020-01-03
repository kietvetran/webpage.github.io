import {readCookie, createCookie, eraseCookie} from '../components/common/General';
import { put, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/signInActions';
import * as actionsTypes from '../actions/actionTypes';
import * as ajax from '../ajax/base';

function storeUserDataInSessionStorage(action) {
  //sessionStorage.setItem('psUser', JSON.stringify(action.user));
}

function* removeUserDataFromSessionStorage() {
 	const response = yield ajax.post('logout');
 	return {'logout': true};
}

export function* storeUserDataInSessionStorageSaga() {
  yield takeEvery(actionsTypes.AUTHENTICATION_USER, storeUserDataInSessionStorage);
}

export function* removeUserDataFromSessionStorageSaga() {
  yield takeEvery(actionsTypes.AUTHENTICATION_LOG_OUT, removeUserDataFromSessionStorage);
}
