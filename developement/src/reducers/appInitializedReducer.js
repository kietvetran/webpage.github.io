import * as actions from '../actions/actionTypes';
import initialState from './initialState';

export default function appInitializedReducer(state = initialState.appInitialized, action) {
  switch (action.type) {
    case actions.APP_INIT_COMPLETE:
      return {
      	'environment'   : action.environment    || '',
      	'psDrilldownURL': action.psDrilldownURL || '',
      	'appKey'        : action.appKey         || ''
     };
    default:
      return state;
  }
}
