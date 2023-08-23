
import { combineReducers } from 'redux'

import bookEANList, { BookEANListState } from './BookEANListReducer'

export interface BookListsState {
  bookEANList: BookEANListState
}

export default combineReducers<BookListsState>({
  bookEANList,
})
