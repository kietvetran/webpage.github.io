import * as actions from '../actions/actionTypes';
import initialState from './initialState';

export default function signInReducer(state = initialState.user, action) {
  switch (action.type) {
    case actions.AUTHENTICATION_USER:
      return { ...action.user };
    case actions.AUTHENTICATION_LOG_OUT:
      return { ...(initialState.user || {}) };
    case actions.AUTHENTICATION_LOADING:
      return { ...(initialState.user || {}) };
    default:
      return state;
  }
}
