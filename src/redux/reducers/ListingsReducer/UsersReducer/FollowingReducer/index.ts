import { Reducer } from 'redux'

import { SET_USER_FOLLOWING, SET_MORE_USER_FOLLOWING } from 'src/redux/actions/user/community/followingAction'
import { Listing } from 'src/models/ListingModel'

export type FollowingState = Record<string, Listing>

const DEFAULT = {} as FollowingState

const following: Reducer<FollowingState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_USER_FOLLOWING: {
      const { uid, ids } = action.payload
      return {
        ...state,
        [uid]: {
          ids,
          skip: ids.length,
          canLoadMore: ids.length > 0,
        },
      }
    }

    case SET_MORE_USER_FOLLOWING: {
      const { uid, ids } = action.payload
      return {
        ...state,
        [uid]: {
          ids: [...(new Set([...state[uid].ids, ...ids]))],
          skip: state[uid].skip + ids.length,
          canLoadMore: ids.length > 0,
        },
      }
    }

    default:
      return state
  }
}

export default following
