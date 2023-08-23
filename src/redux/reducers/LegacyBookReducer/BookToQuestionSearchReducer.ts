
import { Reducer } from 'redux'

import { Ean } from 'src/models/BookModel'
import { SET_BOOKS_EAN_LIST_ACTION, RESET_BOOKS_EAN_LIST_ACTION,
  SearchBooksForEansPayload } from 'src/redux/actions/book/searchBookAction'
import { QuestionId } from 'src/models/Communities/QuestionModel'


export type BookToQuestionSearchResults = Record<QuestionId, Ean[]>

const DEFAULT: BookToQuestionSearchResults = {}

const bookToQuestionSearchReducer: Reducer<BookToQuestionSearchResults> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BOOKS_EAN_LIST_ACTION: {
      const payload = action.payload as SearchBooksForEansPayload
      if (payload.name === 'search_result') {
        return {
          ...state,
          [payload.questionId]: payload.eans! || [],
        }
      }
      return state
    }

    case RESET_BOOKS_EAN_LIST_ACTION: {
      const payload = action.payload as SearchBooksForEansPayload
      if (payload.name === 'search_result') {
        const newState: BookToQuestionSearchResults = { ...state }
        delete newState[payload.questionId]
        return newState
      }
      return state
    }

    default: return state
  }
}

export default bookToQuestionSearchReducer
