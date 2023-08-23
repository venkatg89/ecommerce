import { Reducer } from 'redux'

import { Ean } from 'src/models/BookModel'

import { USER_ONBOARDING_ADD_BOOK, USER_ONBOARDING_DELETE_BOOK,
  USER_ONBOARDING_RESET_BOOKS } from 'src/redux/actions/onboarding'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

export interface OnboardingBook {
  dateAdded: Date;
  changeDate: Date;
}

export type OnboardingBookList = Record<Ean, OnboardingBook>

export interface OnboardingBookLists {
  read: OnboardingBookList

  // These two are unused, but if needed later on...
  reading: OnboardingBookList
  wantToRead: OnboardingBookList
}

const DEFAULT: OnboardingBookLists = {
  read: {},
  reading: {},
  wantToRead: {},
}

const OnboardingBookListsReducer: Reducer<OnboardingBookLists> = (state = DEFAULT, action) => {
  switch (action.type) {
    case USER_ONBOARDING_ADD_BOOK: {
      const ean = action.payload as Ean
      const oboardingBook: OnboardingBook = {
        dateAdded: new Date(),
        changeDate: new Date(),
      }
      return { ...state, read: { ...state.read, [ean]: oboardingBook } }
    }

    case USER_ONBOARDING_DELETE_BOOK: {
      const ean = action.payload as Ean
      // Need object with a new ref for redux to pick up the change
      const read = { ...state.read }
      delete read[ean]
      return { ...state, read }
    }

    case USER_SESSION_ESTABLISHED: // Once Node login is complete, this list is not needed and is cleared.
      return (action.payload as LoggedInPayload).nodeJs ? DEFAULT : state
    case USER_ONBOARDING_RESET_BOOKS:
      return DEFAULT

    default:
      return state
  }
}

export default OnboardingBookListsReducer
