import { Reducer } from 'redux'

import { SET_USER_FOLLOWERS, SET_MORE_USER_FOLLOWERS } from 'src/redux/actions/user/community/followersAction'
import { Listing } from 'src/models/ListingModel'

export type FollowersState = Record<string, Listing>

const DEFAULT = {} as FollowersState

const followers: Reducer<FollowersState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_USER_FOLLOWERS: {
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

    case SET_MORE_USER_FOLLOWERS: {
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

export default followers
