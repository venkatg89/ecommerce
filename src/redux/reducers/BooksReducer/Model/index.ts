import { Reducer } from 'redux'

import { Ean, BookModel } from 'src/models/BookModel'

export type BooksModelState = Record<Ean, BookModel>

// test data
const DEFAULT: BooksModelState = {}

const BooksModel: Reducer<BooksModelState> = (state = DEFAULT, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default BooksModel
