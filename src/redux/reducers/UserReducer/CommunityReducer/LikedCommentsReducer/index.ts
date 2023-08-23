import { Reducer } from 'redux'

import { SET_MY_RELATIONS } from 'src/redux/actions/user/community/relationsAction'
import {
  SET_LIKE_COMMENT, UNSET_LIKE_COMMENT,
} from 'src/redux/actions/user/community/likeCommentsAction'

export type LikedCommentsState = number[]

const DEFAULT: LikedCommentsState = []

const _likedComments: Reducer<LikedCommentsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_MY_RELATIONS: {
      const { likedComments } = action.payload
      return likedComments || state
    }

    case SET_LIKE_COMMENT: {
      const { commentId } = action.payload
      return ([
        ...state,
        commentId,
      ])
    }

    case UNSET_LIKE_COMMENT: {
      const { commentId } = action.payload
      const newState = [...state]
      return newState.filter(e => e !== commentId)
    }

    default:
      return state
  }
}

export default _likedComments
