import { State } from 'src/redux/reducers'

import { RequestStatus } from 'src/models/ApiStatus'
import { ReadingStatus } from 'src/models/ReadingStatusModel'
import { createSelector } from 'reselect'

// LEGACY
export const myAllReadingStatusBooksEanSelector = (stateAny: any, props: any) => ([])

export const myLibraryBooksAsDictSelector = (stateAny: any) => ({})

export const myBooksWithReadingStatusSelector = (stateAny: any) => ([])

export const singleBookReadingStatusSelector = () => createSelector(
  (state, ownProps) => state,
  (state) => undefined)

export const booksReadingStatusSelector = () => createSelector(
  (state, ownProps) => state,
  (state) => [])

const booksByStatusSelector = (stateAny: any, status: ReadingStatus) => ([])

export const myWantToReadSelector = (state: any) => booksByStatusSelector(state, ReadingStatus.TO_BE_READ)
export const myReadingSelector = (state: any) => booksByStatusSelector(state, ReadingStatus.READING)
export const myReadSelector = (state: any) => booksByStatusSelector(state, ReadingStatus.FINISHED)


export const booksWithReadingStatusSelectorForUserId = (stateAny: any, props: any) => ([])

export const isBusyMyReadingStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  // Profile is in charge of local user's reading status
  return state.nodeJs.api.myProfile.requestStatus === RequestStatus.FETCHING
}

export const getMyBooksEanByReadingStatus = (stateAny: any, props: any) => ([])


export const readingStatusListToEansSelector = (stateAny: any, props) => ([])
