import { Reducer } from 'redux'
import { Ean } from 'src/models/BookModel'
import { SET_BOOKS_BY_INTEREST_ACTION } from 'src/redux/actions/book/booksByInterestAction'
import { HOME_DISCOVERY_CLEAR_CONTENT_SOURCE } from 'src/redux/actions/legacyHome/discoveryActions'
import { LoggedInPayload, USER_SESSION_ESTABLISHED } from 'src/redux/actions/login/basicActionsPayloads'

export type BooksByInterestState = Record<number, Record<string, Ean[]>>

const DEFAULT: BooksByInterestState = {}

const booksByInterest: Reducer<BooksByInterestState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BOOKS_BY_INTEREST_ACTION: {
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

export default booksByInterest
