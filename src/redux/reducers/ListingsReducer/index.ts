import { combineReducers } from 'redux'

import cafe, { CafeState } from './CafeReducer'
import search, { SearchListingsState } from './SearchReducer'
import communityLists, { CommunityListState } from './CommunityReducer'
import bookLists, { BookListsState } from './BooksReducer'
import users, { UsersState } from './UsersReducer'
import store, { StoreState } from './StoreReducer'

export interface ListingsState {
  cafe: CafeState;
  search: SearchListingsState;
  communityLists: CommunityListState;
  bookLists: BookListsState;
  users: UsersState;
  store: StoreState;
}

export default combineReducers<ListingsState>({
  cafe,
  search,
  communityLists,
  bookLists,
  users,
  store,
})
