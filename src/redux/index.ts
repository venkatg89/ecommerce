import AsyncStorage from '@react-native-async-storage/async-storage'
import { applyMiddleware, compose, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'

import config from 'config'

import storeReducer, { State } from 'src/redux/reducers'
import { StoreBackDoor } from 'src/redux/backdoor/interface'
import { distributeBackdoor } from 'src/redux/backdoor/distribute'

const PERSIST_ENTIRE_STORE = { blacklist: [] }
const PERSIST_USER_DATA_ONLY = { whitelist: ['milq', 'atg', 'nodeJs', 'theme', 'speedetab', 'user'] }

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  ...(config.redux.clearStateOnReset ? PERSIST_USER_DATA_ONLY : PERSIST_ENTIRE_STORE),
}

const persistedReducer = persistReducer(persistConfig, storeReducer)

// @ts-ignore
// eslint-disable-next-line no-undef
const intitialState = __DEV__ ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : {}

const store = createStore<State>(
  persistedReducer,
  intitialState,
  compose(applyMiddleware(thunk)),
)
// Forward the store the files that need it. See backdoor/distribute.ts
const storeBackDoor: StoreBackDoor = { getState: store.getState, dispatch: store.dispatch }
distributeBackdoor(storeBackDoor)

const persistor = persistStore(store)

export {
  persistor,
  store,
}
