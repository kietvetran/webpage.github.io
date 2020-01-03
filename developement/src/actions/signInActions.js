import * as actionTypes from './actionTypes';

export function sendCredentials(data) {
  return { type: actionTypes.AUTHENTICATION_SEND_CREDENTIALS, ...data};
}

export function credentialsInvalid() {
  return { type: actionTypes.AUTHENTICATION_CREDENTIALS_INVALID };
}

export function userDataValid(user) {
  return { type: actionTypes.AUTHENTICATION_USER, user };
}

export function userDataLoading() {
  return { type: actionTypes.AUTHENTICATION_LOADING, 'loading': true };
}

export function logOut() {
  return { type: actionTypes.AUTHENTICATION_LOG_OUT };
}