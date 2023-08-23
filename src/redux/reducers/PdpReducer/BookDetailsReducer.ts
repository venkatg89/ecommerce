import { Reducer } from 'redux'

import { SET_PDP_BOOK_DETAILS } from 'src/redux/actions/book/bookDetails'
import { Ean } from 'src/models/BookModel'
import { BookDetails } from 'src/models/PdpModel'

export interface BookDetailsPayload {
  ean: Ean;
  bookDetails: BookDetails;
}

export type BookDetailsState = Record<string, BookDetails>

const DEFAULT: BookDetailsState = {}

const _bookDetails: Reducer<BookDetailsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_PDP_BOOK_DETAILS: {
      const { ean, bookDetails } = action.payload

      return ({
        ...state,
        [ean]: bookDetails,
      })
    }

    default:
      return state
  }
}

export default _bookDetails
