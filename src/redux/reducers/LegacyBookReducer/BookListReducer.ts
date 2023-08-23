import { BooksList } from 'src/models/BookModel'
import { Reducer } from 'redux'
import { SET_PDP_RECOMMENDED_BOOKS } from 'src/redux/actions/book/bookRecommendedBooks'
import { RESET_BOOKS_EAN_LIST_ACTION, SET_BOOKS_ACTION } from 'src/redux/actions/book/searchBookAction'
import {
  SET_SEARCH_RESULTS, SET_SEARCH_MORE_RESULTS,
} from 'src/redux/actions/legacySearch/searchResultsAction'
import { COLLECTIONS_SET_FOR_LOCAL_USER, COLLECTIONS_SET_FOR_MILQ_USER } from 'src/redux/actions/collections/apiActions'
import { SET_MY_NODE_PROFILE, SET_USER_NOOK_LIBRARY, SET_MILQ_USER_NODE_PROFILE } from 'src/redux/actions/user/nodeProfileActions'
import { SET_ANSWERS_AND_BOOKS_ACTOIN } from 'src/redux/actions/book/fetchAnswersForQuestionAction'
import { SET_NOTIFICATIONS_DATA } from 'src/redux/actions/legacyHome/social/notificationsActions'

export type BooksListState = BooksList

const DEFAULT: BooksListState = {}

const booksList: Reducer<BooksListState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BOOKS_ACTION: {
      return {
        ...state,
        ...action.payload,
      }
    }

    case SET_ANSWERS_AND_BOOKS_ACTOIN:
    case SET_NOTIFICATIONS_DATA:
    case SET_MILQ_USER_NODE_PROFILE:
    case COLLECTIONS_SET_FOR_MILQ_USER:
    case SET_USER_NOOK_LIBRARY:
    case SET_MY_NODE_PROFILE:
    case COLLECTIONS_SET_FOR_LOCAL_USER:
    case SET_PDP_RECOMMENDED_BOOKS:
    case SET_SEARCH_RESULTS:
    case SET_SEARCH_MORE_RESULTS: {
      const { books } = action.payload
      if (books) {
        return ({
          ...state,
          ...books,
        })
      }
      return state
    }

    case RESET_BOOKS_EAN_LIST_ACTION: {
      /*
        Prune the booklist here if necessary
      */
      return state
    }

    default:
      return state
  }
}

export default booksList
