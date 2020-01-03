import * as actions from '../actions/actionTypes';
import initialState from './initialState';

export default function signInReducer(state = initialState.signIn, action) {
  switch (action.type) {
    case actions.AUTHENTICATION_SEND_CREDENTIALS:
      return { ...state, loading: true, wrongCredentials: false };
    case actions.AUTHENTICATION_CREDENTIALS_INVALID:
      return { ...state, loading: false, wrongCredentials: true };
    case actions.AUTHENTICATION_USER:
      return { ...state, loading: false, wrongCredentials: false };
    default:
      return state;
  }
}
