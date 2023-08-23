import { Reducer } from 'redux'
import { Ean } from 'src/models/BookModel'
import { SET_BOOKS_BY_CONTENT_ACTION } from 'src/redux/actions/book/booksByContentAction'
import { HOME_DISCOVERY_CLEAR_CONTENT_SOURCE } from 'src/redux/actions/legacyHome/discoveryActions'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

export type BooksByContentState = Record<string, Ean[]>

const DEFAULT: BooksByContentState = {}

const booksByContent: Reducer<BooksByContentState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BOOKS_BY_CONTENT_ACTION: {
      return {
        ...state,
        ...action.payload,
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

export default booksByContent
