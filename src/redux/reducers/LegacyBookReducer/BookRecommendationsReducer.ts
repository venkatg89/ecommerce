import { Reducer } from 'redux'
import { Ean } from 'src/models/BookModel'
import { SET_BOOK_RECOMMENDATIONS_ACTION } from 'src/redux/actions/legacyHome/fetchBookRecommendationsAction'
import { HOME_DISCOVERY_CLEAR_CONTENT_SOURCE } from 'src/redux/actions/legacyHome/discoveryActions'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

export type BookRecommendationsState = Record<Ean, Ean[]>

const DEFAULT: BookRecommendationsState = {}

const bookRecommendations: Reducer<BookRecommendationsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BOOK_RECOMMENDATIONS_ACTION: {
      const { ean, books } = action.payload
      return {
        ...state,
        [ean]: books,
      }
    }

    case HOME_DISCOVERY_CLEAR_CONTENT_SOURCE:
      return DEFAULT

    case USER_SESSION_ESTABLISHED:
      return (action.payload as LoggedInPayload).nodeJs ? DEFAULT : state

    default:
      return state
  }
}

export default bookRecommendations
