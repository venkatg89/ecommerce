import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { BookSearchParams, searchBook } from 'src/endpoints/milq/books'
import { Ean, BookEANListName, BookModel } from 'src/models/BookModel'
import { QuestionId } from 'src/models/Communities/QuestionModel'
import { normalizeBooksResult } from 'src/helpers/api/milq/normalizeBookResult'

export const SET_BOOKS_ACTION = 'SET_BOOKS_ACTION'
export const SET_BOOKS_EAN_LIST_ACTION = 'SET_BOOKS_EAN_LIST_ACTION'
export const RESET_BOOKS_EAN_LIST_ACTION = 'RESET_BOOKS_EAN_LIST_ACTION'

export const setBooksAction = makeActionCreator<Record<Ean, BookModel>>(SET_BOOKS_ACTION)
export const setBooksEANListAction = makeActionCreator(SET_BOOKS_EAN_LIST_ACTION)
export const resetBooksEANListAction = makeActionCreator(RESET_BOOKS_EAN_LIST_ACTION)


export interface SearchBooksForEansPayload {
  name: string
  eans?: Ean[]
  questionId: QuestionId
}

export const searchBookAction: (questionId: QuestionId, search: string) => ThunkedAction<State> =
  (questionId, search) => async (dispatch, getState) => {
    const clearSearchResultsPayload: SearchBooksForEansPayload = {
      name: BookEANListName.SEARCH_RESULT,
      questionId,
    }
    await dispatch(resetBooksEANListAction(clearSearchResultsPayload))
    // TODO implement pagination
    const params: BookSearchParams = {
      q: search,
      type: 'book',
      from: 0,
      limit: 20,
    }
    const response = await searchBook(params)
    if (response.ok) {
      const { eans, booksList } = normalizeBooksResult(response.data)
      await dispatch(setBooksAction(booksList))

      const setSearchResultsPayload: SearchBooksForEansPayload = {
        name: BookEANListName.SEARCH_RESULT,
        eans,
        questionId,
      }
      await dispatch(setBooksEANListAction(setSearchResultsPayload))
    } else {
      // TODO signal error
    }
  }
