import { milqBookSearchInstance } from 'src/apis/milq'

import { SearchTypesKeys } from 'src/constants/search'
import { normalizeBook } from 'src/helpers/api/milq/normalizeBookResult'
import { BookModel, BooksList } from 'src/models/BookModel'

export interface BookSearchParams {
  query: string,
  skip?: number;
}

export const getBookModel = ({ query, skip }: BookSearchParams, requestKey?) => milqBookSearchInstance({
  method: 'GET',
  endpoint: '/api/v0/external/barnes',
  params: {
    q: query,
    type: 'book',
    from: skip,
  },
  requestKey,
})

export const normalizeBookModelResponseData = (data: any): Nullable<BookModel> => {
  if (data.length > 0) {
    const book = data[0]
    return normalizeBook(book)
  }
  return null
}

// we need to mirror this api response to the search api response
export const normalizeMilqBookSearchResultsResponseData = (data: any) => {
  const listings: string[] = data.map(book => `${SearchTypesKeys.BOOKS}:${book.ean}`)
  const books: BooksList = data.reduce((object, book) => {
    object[book.ean] = normalizeBook(book) // eslint-disable-line
    return object
  }, {})

  return ({
    listings,
    ...(Object.keys(books).length > 0 && { books }),
  })
}
