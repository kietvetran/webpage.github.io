import { push } from 'react-router-redux';

export function gotoRoot() {
  return push('/');
}

export function gotoSignIn() {
  return push('/signin');
}

export function gotoDesktop() {
  const action = push('/desktop');
  return action;
}
