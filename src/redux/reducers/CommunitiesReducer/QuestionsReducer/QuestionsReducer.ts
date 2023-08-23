import { Reducer } from 'redux'

import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { SET_QUESTION_ACTION, SET_QUESTIONS_ACTION } from 'src/redux/actions/communities/recommendationAction'
import { SET_BOOK_RELATED_QUESTIONS } from 'src/redux/actions/book/relatedQuestionsAction'
import {
  SET_SEARCH_RESULTS, SET_SEARCH_MORE_RESULTS,
} from 'src/redux/actions/legacySearch/searchResultsAction'
import { DELETE_QUESTION_ACTION } from 'src/redux/actions/communities/deleteContentActions'
import { SET_HOME_FEED_ACTION, SET_MORE_HOME_FEED_ACTION } from 'src/redux/actions/communities/fetchFeedhomeQuestionsAction'
import { SET_NOTIFICATIONS_FALLBACK_ACTION, SET_NOTIFICATIONS_DATA } from 'src/redux/actions/legacyHome/social/notificationsActions'

export type QuestionsState = Record<number, QuestionModel>

const DEFAULT: QuestionsState = {}

const questionsList: Reducer<QuestionsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_QUESTIONS_ACTION:
      return { ...state, ...action.payload } as QuestionsState

    case DELETE_QUESTION_ACTION: {
      const { questionId } = action.payload
      const { [questionId]: value, ...restQuestions } = state
      return { ...restQuestions }
    }

    case SET_QUESTION_ACTION: {
      const { questionId, question } = action.payload
      return {
        ...state,
        [questionId]: {
          ...state[questionId],
          ...question,
        },
      }
    }

    case SET_BOOK_RELATED_QUESTIONS: {
      const { questions } = action.payload

      const mergedQuestions: QuestionsState = {} // we merge to preserve 'recentAnswers'
      Object.keys(questions).forEach((id) => {
        mergedQuestions[id] = (
          {
            ...state[id],
            ...questions[id],
          }
        )
      })

      return {
        ...state,
        ...mergedQuestions,
      }
    }

    case SET_NOTIFICATIONS_FALLBACK_ACTION:
    case SET_NOTIFICATIONS_DATA:
    case SET_MORE_HOME_FEED_ACTION:
    case SET_HOME_FEED_ACTION:
    case SET_SEARCH_RESULTS:
    case SET_SEARCH_MORE_RESULTS: {
      const { questions } = action.payload
      if (questions) {
        return ({
          ...state,
          ...questions,
        })
      }
      return state
    }

    default:
      return state
  }
}

export default questionsList
