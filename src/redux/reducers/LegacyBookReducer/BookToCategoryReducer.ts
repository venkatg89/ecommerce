import { Reducer } from 'redux'

import { BookToCategoryRecord } from 'src/models/BookModel'
import {
  SET_BOOKS_TO_CATEGORY_ACTION,
  RESET_BOOKS_TO_CATEGORY_ACTION,
} from 'src/redux/actions/communities/fetchCategoryAnswerAction'
import { InterestId } from 'src/models/Communities/InterestModel'

export type BookToCategoryState = Record<InterestId, BookToCategoryRecord>

const DEFAULT: BookToCategoryState = {} as BookToCategoryState

const bookToCategory: Reducer<BookToCategoryState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BOOKS_TO_CATEGORY_ACTION: {
      const { interestId, bookToAnswer } = action.payload
      return {
        ...state,
        [interestId]: bookToAnswer,
      }
    }

    case RESET_BOOKS_TO_CATEGORY_ACTION: {
      const { interestId } = action.payload

      return {
        ...state,
        [interestId]: {},
      }
    }

    default:

      return state
  }
}

export default bookToCategory
