const initialState = {
  'signIn': {
    'loading': false,
    'error': '',
    'wrongCredentials': false,
  },
  'user': null,
  'dialog': null,
  'contract': {
    'list'   : [],
    'loading': false,
    'edit'   : null,
    'error'  : null
  },
  'appInitialized': null
};

export default initialState;