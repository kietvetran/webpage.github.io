import * as actions from '../actions/actionTypes';
import initialState from './initialState';

export default function dialogReducer(state = initialState.dialog, action) {
  switch (action.type) {
    case actions.OPEN_DIALOG:
      return { ...state, ...action.source };
    case actions.CLOSE_DIALOG:
    	return null;
    default:
      return state;
  }
}