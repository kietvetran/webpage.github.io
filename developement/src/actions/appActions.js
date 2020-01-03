import * as actionTypes from './actionTypes';

export function appInit() {
  return { type: actionTypes.APP_INIT };
}

export function appInitComplete( data ) {
  return { type: actionTypes.APP_INIT_COMPLETE, ...(data || {})};
}
