import { thunk } from 'redux-thunk'
import { applyMiddleware, compose, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storageModule from 'redux-persist/lib/storage'

import rootReducer from './reducer/combineReducer'

const storage = storageModule.default || storageModule

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
)

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  persistedReducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
)

export const persistor = persistStore(store)

export default store