import { combineReducers } from 'redux'

import model, { BooksModelState } from './Model'

export interface BooksState {
  model: BooksModelState
}

export default combineReducers<BooksState>({
  model,
})
