import { Reducer } from 'redux'

import { SET_MY_RELATIONS } from 'src/redux/actions/user/community/relationsAction'
import {
  FOLLOW_USER, UNFOLLOW_USER,
} from 'src/redux/actions/user/community/followingAction'

export type FollowedUsersState = string[]

const DEFAULT: FollowedUsersState = []

const _followedUsers: Reducer<FollowedUsersState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_MY_RELATIONS: {
      const { followedMembers } = action.payload
      return followedMembers
    }

    case FOLLOW_USER: {
      const { uid } = action.payload
      return ([
        ...state,
        uid,
      ])
    }

    case UNFOLLOW_USER: {
      const { uid } = action.payload
      const newState = [...state]
      return newState.filter(e => e !== uid)
    }

    default:
      return state
  }
}

export default _followedUsers
