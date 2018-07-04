import {applyMiddleware, createStore, compose} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';

import createReducer from 'reducers';
import {localStorageMiddleware, promiseMiddleware} from 'middleware';

export default function configureStore(initialState = {}) {
    // Create the store with two middlewares
    // 1. sagaMiddleware: Makes redux-sagas work
    // 2. routerMiddleware: Syncs the location/URL path to the state
    // const middlewares = [sagaMiddleware, routerMiddleware(history)];  
    // const enhancers = [applyMiddleware(...middlewares)];
    const enhancers = [];
  
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle, indent */
    const composeEnhancers =
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'object' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({            
            shouldHotReload: false,
          })
        : compose;    

    const store = createStore(
      createReducer(),
      composeWithDevTools(applyMiddleware(promiseMiddleware, localStorageMiddleware)),
      // composeEnhancers(...enhancers),
    );
      
    store.injectedReducers = {}; // Reducer registry    
  
    // Make reducers hot reloadable, see http://mxs.is/googmo    
    if (module.hot) {
      module.hot.accept('./reducers', () => {        
        store.replaceReducer(createReducer(store.injectedReducers));
      });
    }
  
    return store;
  }
  