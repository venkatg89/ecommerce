import { Reducer } from 'redux'

import {
  SET_AGREE_ANSWERS, SET_AGREE_ANSWER, UNSET_AGREE_ANSWER,
} from 'src/redux/actions/user/community/agreeAnswersAction'

export type AgreedAnswersState = number[]

const DEFAULT: AgreedAnswersState = []

const agreedAnswers: Reducer<AgreedAnswersState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_AGREE_ANSWERS: {
      const { answerIds } = action.payload
      return answerIds
    }

    case SET_AGREE_ANSWER: {
      const { answerId } = action.payload
      return ([
        ...state,
        answerId,
      ])
    }

    case UNSET_AGREE_ANSWER: {
      const { answerId } = action.payload
      const newState = [...state]
      return newState.filter(e => e !== answerId)
    }

    default:
      return state
  }
}

export default agreedAnswers
