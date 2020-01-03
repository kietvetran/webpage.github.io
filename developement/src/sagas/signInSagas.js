import { put, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/signInActions';
import * as actionsTypes from '../actions/actionTypes';
import * as ajax from '../ajax/base';

function* sendCredentials(data) {
  const response = yield ajax.post('login', data);
  const user = (response || {}).result, error = (response || {}).error;

  if ( error || ! user ) {
    yield put(actions.credentialsInvalid( error || 'Finner ikke sluttbruker.' ));
  } else {
		yield put(actions.userDataValid(user));
	}
}

export function* sendCredentialsSaga() { // eslint-disable-line
  yield takeEvery(actionsTypes.AUTHENTICATION_SEND_CREDENTIALS, sendCredentials);
}
