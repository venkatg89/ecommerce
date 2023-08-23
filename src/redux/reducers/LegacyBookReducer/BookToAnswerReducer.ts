import { Reducer } from 'redux'

import { BookToAnswerRecord } from 'src/models/BookModel'
import { AnswerId } from 'src/models/Communities/AnswerModel'
import {
  RESET_BOOKS_TO_ANSWER_ACTION,
  SET_BOOKS_TO_ANSWER_ACTION,
} from 'src/redux/actions/communities/fetchCommentAction'
import { DELETE_ANSWER_ACTION } from 'src/redux/actions/communities/deleteContentActions'

export type BookToAnswerState = Record<AnswerId, BookToAnswerRecord>

const DEFAULT: BookToAnswerState = {} as BookToAnswerState

const bookToAnswer: Reducer<BookToAnswerState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BOOKS_TO_ANSWER_ACTION: {
      const { questionId, bookToAnswerList } = action.payload
      return {
        ...state,
        [questionId]: { ...state[questionId], ...bookToAnswerList },
      }
    }

    case DELETE_ANSWER_ACTION: {
      const { answerId, questionId } = action.payload
      return {
        ...state,
        [questionId]: Object.keys(state[questionId]).reduce((acc, val) => {
          if (state[questionId][val] !== answerId) {
            acc[val] = state[questionId][val]
          }
          return acc
        }, {}),
      }
    }

    case RESET_BOOKS_TO_ANSWER_ACTION: {
      const { questionId } = action.payload

      return {
        ...state,
        [questionId]: {},
      }
    }

    default:

      return state
  }
}

export default bookToAnswer
