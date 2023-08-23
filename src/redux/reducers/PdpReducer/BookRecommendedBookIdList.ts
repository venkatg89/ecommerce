import { Reducer } from 'redux'

import { SET_PDP_RECOMMENDED_BOOKS } from 'src/redux/actions/book/bookRecommendedBooks'
import { Ean } from 'src/models/BookModel'

export type BookRecommendedBookIdListState = Record<Ean, Ean[]>

const DEFAULT: BookRecommendedBookIdListState = {}

const bookRecommendedBookIdList: Reducer<BookRecommendedBookIdListState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_PDP_RECOMMENDED_BOOKS: {
      const { ean, recommendedEanIds } = action.payload
      return {
        ...state,
        [ean]: recommendedEanIds,
      }
    }

    default:
      return state
  }
}

export default bookRecommendedBookIdList
