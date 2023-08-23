import { Reducer } from 'redux'

import { SET_MY_RELATIONS } from 'src/redux/actions/user/community/relationsAction'
import {
  SET_FOLLOW_QUESTION, UNSET_FOLLOW_QUESTION,
} from 'src/redux/actions/user/community/notificationsAction'

export type FollowedQuestionsState = string[]

const DEFAULT: FollowedQuestionsState = []

const notificationQuestions: Reducer<FollowedQuestionsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_MY_RELATIONS: {
      const { followedQuestions } = action.payload
      return followedQuestions || state
    }

    case SET_FOLLOW_QUESTION: {
      const { questionId } = action.payload
      return ([
        ...state,
        questionId,
      ])
    }

    case UNSET_FOLLOW_QUESTION: {
      const { questionId } = action.payload
      const newState = [...state]
      return newState.filter(e => e !== questionId)
    }

    default:
      return state
  }
}

export default notificationQuestions
