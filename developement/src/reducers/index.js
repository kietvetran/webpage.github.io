import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import signInReducer from './signInReducer';
import userReducer from './userReducer';
import appInitiliazedReducer from './appInitializedReducer';
import dialogReducer from './dialogReducer';

const rootReducer = combineReducers({
  'routing'       : routerReducer,
  'form'          : formReducer,
  'signIn'        : signInReducer,
  'user'          : userReducer,
  'appInitialized': appInitiliazedReducer,
  'dialog'        : dialogReducer
});

export default rootReducer;