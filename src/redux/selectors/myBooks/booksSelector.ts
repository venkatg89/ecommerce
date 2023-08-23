import { State } from 'src/redux/reducers'
import { myInterestCommunities } from 'src/redux/selectors/userSelector'
import { ContentName } from 'src/endpoints/nodeJs/books'
import { booksByInterestSelector, booksByContentSelector, booksDetailsSelector } from 'src/redux/selectors/booksListSelector'
import { getRandomValue } from 'src/helpers/arrayHelper'
import { ReadingStatus } from 'src/models/ReadingStatusModel'
import { createSelector } from 'reselect'

// LEGACY
/**
 * Books EANs already owned, read, or marked as not-interested by the user
 * @param {Object} state
 * @returns {Set}
 */
export const userExcludedEansSelector = () => createSelector(
  (state: State) => state,
  (state) => ([]))
/**
 * Filters out the user's owned books(collections, reading status, not interested)
 * @param {Object} books
 * @return {Object}
 */
export const excludeUserBooksSelector = () => createSelector(
  (state, ownProps) => state,
  (state) => ({}))

export const booksByContentCategorySelector = (state: State, content: ContentName, category: number) => {
  // debugger
  let eans: any = booksByInterestSelector(state, category, content)
  const _booksDetailsSelector = booksDetailsSelector()
  eans = _booksDetailsSelector(state, { eans })
  const _excludeUserBooksSelector = excludeUserBooksSelector()
  eans = _excludeUserBooksSelector(state, { books: eans })

  return eans
}

export const booksByContentOverallSelector = (state: State, content: ContentName) => {
  // debugger
  let eans: any = booksByContentSelector(state, content)
  const _booksDetailsSelector = booksDetailsSelector()
  eans = _booksDetailsSelector(state, { eans })
  const _excludeUserBooksSelector = excludeUserBooksSelector()
  eans = _excludeUserBooksSelector(state, { books: eans })

  return eans
}

export const getRandomInterest = (state: State) => {
  const interests = myInterestCommunities(state)
  if (interests.length) {
    return getRandomValue(interests, true)
  }

  return 0
}

export const getReadingListBooksSelector = () => createSelector(
  (state: State, ownProps) => state,
  (state) => ({}))


export const getRandomReadBook = (state: State) => {
  const eans = Object.keys((getReadingListBooksSelector()(state, { status: ReadingStatus.FINISHED })))
  if (eans.length) {
    return getRandomValue(eans, true)
  }

  return ''
}

export const getMostRecentReadBookSelector = () => createSelector(
  (state) => state,
  (state) => ({}))

export const getMostRecentReadingBookDateSelector = () => createSelector(
  (state: State) => state,
  (state) => null)

export const getReadBooksAfterDate = () => createSelector(
  (state, ownProps) => state,
  (state) => ([]))

export const isBookInCollectionSelector = (_state, ownProps) => false

export const isBookInReadingStatusSelector = (_state, ownProps) => false

export const isBookInOnboardingListSelector = (_state, ownProps) => false
