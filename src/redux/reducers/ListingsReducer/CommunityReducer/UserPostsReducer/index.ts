import { Reducer } from 'redux'
import { Listing } from 'src/models/ListingModel'

import { SET_USER_POSTS_LIST_ACTION, POST_PER_PAGE, SET_MORE_USER_POSTS_LIST_ACTION } from 'src/redux/actions/communities/fetchUserPostAction'

import { getUniqueArray } from 'src/helpers/arrayHelper'

export type UserPostsListState = Record<string, Listing>

const DEFAULT = {} as UserPostsListState


const userPostsList: Reducer<UserPostsListState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_USER_POSTS_LIST_ACTION: {
      const { filter, list } = action.payload
      return {
        ...state,
        [filter]: {
          ids: list,
          skip: 10,
          canLoadMore: list.length >= POST_PER_PAGE,
        },
      }
    }

    case SET_MORE_USER_POSTS_LIST_ACTION: {
      const { filter, list } = action.payload
      return {
        ...state,
        [filter]: {
          ids: getUniqueArray(state[filter].ids.concat(list)),
          skip: state[filter].ids.length + list.length,
          canLoadMore: list.length >= POST_PER_PAGE,
        },
      }
    }


    default:
      return state
  }
}

export default userPostsList
