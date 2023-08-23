import { Reducer } from 'redux'

import { AnswerModel } from 'src/models/Communities/AnswerModel'
import { SET_ANSWERS_ACTION, SET_ANSWERS_AND_BOOKS_ACTOIN } from 'src/redux/actions/book/fetchAnswersForQuestionAction'
import {
  SET_SEARCH_RESULTS, SET_SEARCH_MORE_RESULTS,
} from 'src/redux/actions/legacySearch/searchResultsAction'
import { DELETE_ANSWER_ACTION } from 'src/redux/actions/communities/deleteContentActions'
import { SET_HOME_FEED_ACTION, SET_MORE_HOME_FEED_ACTION } from 'src/redux/actions/communities/fetchFeedhomeQuestionsAction'
import { SET_NOTIFICATIONS_FALLBACK_ACTION, SET_NOTIFICATIONS_DATA } from 'src/redux/actions/legacyHome/social/notificationsActions'


export type AnswersListState = Record<string, AnswerModel>

const DEFAULT: AnswersListState = {}

const _answers: Reducer<AnswersListState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_ANSWERS_ACTION: {
      return { ...state, ...action.payload } as AnswersListState
    }

    case DELETE_ANSWER_ACTION: {
      const { answerId } = action.payload
      const { [answerId]: value, ...restAnswers } = state
      return { ...restAnswers }
    }

    case SET_NOTIFICATIONS_FALLBACK_ACTION:
    case SET_MORE_HOME_FEED_ACTION:
    case SET_HOME_FEED_ACTION:
    case SET_ANSWERS_AND_BOOKS_ACTOIN:
    case SET_NOTIFICATIONS_DATA:
    case SET_SEARCH_RESULTS:
    case SET_SEARCH_MORE_RESULTS: {
      const { answers } = action.payload
      if (answers) {
        return ({
          ...state,
          ...answers,
        })
      }
      return state
    }

    default:
      return state
  }
}

export default _answers
