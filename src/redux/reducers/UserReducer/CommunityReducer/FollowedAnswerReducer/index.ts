import { Reducer } from 'redux'

import { SET_MY_RELATIONS } from 'src/redux/actions/user/community/relationsAction'
import {
  SET_FOLLOW_ANSWER, UNSET_FOLLOW_ANSWER,
} from 'src/redux/actions/user/community/notificationsAction'

export type FollowedAnswerState = string[]

const DEFAULT: FollowedAnswerState = []

const notificationAnswers: Reducer<FollowedAnswerState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_MY_RELATIONS: {
      const { followedAnswers } = action.payload
      return followedAnswers || state
    }
    case SET_FOLLOW_ANSWER: {
      const { answerId } = action.payload
      return ([...state, answerId])
    }

    case UNSET_FOLLOW_ANSWER: {
      const { answerId } = action.payload
      const newState = [...state]
      return newState.filter(id => id !== answerId)
    }

    default:
      return state
  }
}

export default notificationAnswers
