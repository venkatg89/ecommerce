import { combineReducers } from 'redux'

import followers, { FollowersState } from './FollowersReducer'
import following, { FollowingState } from './FollowingReducer'
import nookLocker, { NookLockerState } from './NookLockerReducer'

export interface UsersState {
  followers: FollowersState
  following: FollowingState
  nookLocker: NookLockerState
}

export default combineReducers<UsersState>({
  followers,
  following,
  nookLocker,
})
