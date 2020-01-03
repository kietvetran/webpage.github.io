import * as actionTypes from './actionTypes';

export function openDialog(data) {
  return { type: actionTypes.OPEN_DIALOG, 'source': data };
}

export function closeDialog() {
  return { type: actionTypes.CLOSE_DIALOG, 'source': null };
}