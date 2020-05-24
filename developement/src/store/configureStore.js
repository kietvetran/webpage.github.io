import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
//import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';
//import * as sagas from '../sagas';

export default function configureStore(initialState) {
  //const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(
        reduxImmutableStateInvariant(),
        routerMiddleware(),
        //sagaMiddleware,
        thunkMiddleware,
      ),
    ),
  );

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers'); // eslint-disable-line global-require
      store.replaceReducer(nextRootReducer);
    });
  }

  /*
  const initSagas = (saga) => {
    Object.values(sagas).forEach(saga.run.bind(saga));
  };

  initSagas(sagaMiddleware);
  */

  return store;
}
