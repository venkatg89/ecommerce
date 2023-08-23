import { Reducer } from 'redux'
import {
  RESET_BOOKS_EAN_LIST_ACTION,
  SET_BOOKS_EAN_LIST_ACTION,
} from 'src/redux/actions/book/searchBookAction'
import { SET_MORE_BOOKS_EAN_LIST_ACTION } from 'src/redux/actions/book/fetchAnswersForQuestionAction'
import { Listing } from 'src/models/ListingModel'

export type BookEANListState = Record<string, Listing>

const DEFAULT:BookEANListState = {} as BookEANListState

const bookEANList:Reducer<BookEANListState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BOOKS_EAN_LIST_ACTION: {
      const { name, eans } = action.payload
      if (!name) {
        return state
      }
      return {
        ...state,
        [name]: {
          ids: eans,
          skip: eans.length,
          canLoadMore: true,
        },
      }
    }

    case SET_MORE_BOOKS_EAN_LIST_ACTION: {
      const { name, eans } = action.payload
      if (!name) {return state}
      return {
        ...state,
        [name]: {
          ids: [...(new Set([...state[name].ids, ...eans]))],
          skip: state[name].ids.length + eans.length,
          canLoadMore: eans.length > 0,
        },
      }
    }

    case RESET_BOOKS_EAN_LIST_ACTION: {
      const { name } = action.payload
      if (!name) {return state}
      return {
        ...state,
        [name]: {
          ids: [],
          skip: 0,
          canLoadMore: false,
        },
      }
    }

    default:
      return state
  }
}

export default bookEANList
