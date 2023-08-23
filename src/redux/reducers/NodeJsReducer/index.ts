import { combineReducers } from 'redux'

import api, { ApiState } from './api'
import session, { SessionState } from './session'
import collections, { CollectionStoreState } from './collections'

export interface NodeJsState {
  api: ApiState
  collections: CollectionStoreState
  session: SessionState
}

export default combineReducers<NodeJsState>({
  api,
  collections,
  session,
})
