import { createSelector } from 'reselect'

import { State } from 'src/redux/reducers'
import { getReadingListBooksSelector } from 'src/redux/selectors/myBooks/booksSelector'
import { ReadingStatus } from 'src/models/ReadingStatusModel'

const _getReadingListBooksSelector = getReadingListBooksSelector()

export const onboardingBookListEansSelector = () => createSelector(
  (state: State, ownProps?) => _getReadingListBooksSelector(state, { status: ((ownProps && ownProps.status) || ReadingStatus.FINISHED) }),
  (_, ownProps?) => ((ownProps && ownProps.status) || ReadingStatus.FINISHED),
  (books, status) => Object.keys(books).reduce((acc, val) => ({
    ...(acc || {}),
    [val]: status,
  }), {}),
)
