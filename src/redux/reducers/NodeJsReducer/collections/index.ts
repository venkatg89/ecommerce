import { combineReducers } from 'redux'

import byMilqUserId, { ByMilqUserIdCollectionsState } from './byMilqUserId'
import localUser, { LocalUserCollectionState } from './localUser'
import list, { ColectionListState } from './list'

export interface CollectionStoreState {
  byMilqUserId: ByMilqUserIdCollectionsState
  localUser: LocalUserCollectionState
  list:ColectionListState
}

export default combineReducers<CollectionStoreState>({
  byMilqUserId,
  list,
  localUser,
})
