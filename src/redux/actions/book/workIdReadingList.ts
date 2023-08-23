import { State } from 'src/redux/reducers'

import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { getCurrentlyReadingUsersFromWorkId } from 'src/endpoints/nodeJs/books'

import { fetchBookFromMilqAction } from 'src/redux/actions/book/bookAction'
import { Ean } from 'src/models/BookModel'

export const SET_BOOK_READING_LIST = 'BOOK__READING_LIST_SET'
const setWorkIdReadingList = makeActionCreator(SET_BOOK_READING_LIST)

export const fetchBookCurrentlyReadingUsersAction: (workId: number) => ThunkedAction<State> =
  workId => async (dispatch, getState) => {
    const response = await getCurrentlyReadingUsersFromWorkId({ workId })

    if (response.ok) {
      const userIds = response.data.milqUserIds
      await dispatch(setWorkIdReadingList({ workId, userIds }))
    }
  }

export const fetchBookCurrentlyReadingUsersWithEanAction: (ean: Ean) => ThunkedAction<State> =
  ean => async (dispatch, getState) => {
    const statePre = getState()
    const bookPre = statePre._legacybooks.booksList[ean]
    // If we need to fetch the book, do so.
    if (!bookPre || !bookPre.workId) {
      await dispatch(fetchBookFromMilqAction(ean))
    }
    const statePost = getState()
    const bookPost = statePost._legacybooks.booksList[ean]
    if (bookPost) {
      await dispatch(fetchBookCurrentlyReadingUsersAction(bookPost.workId || -1))
    }
  }
