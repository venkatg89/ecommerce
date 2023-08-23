import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { getContentBooks, ContentName, normalizeContentBooksResponse } from 'src/endpoints/nodeJs/books'
import { setBooksAction } from 'src/redux/actions/book/searchBookAction'

export const SET_BOOKS_BY_CONTENT_ACTION = 'SET_BOOKS_BY_CONTENT_ACTION'

export const setBooksByContentAction = makeActionCreator(SET_BOOKS_BY_CONTENT_ACTION)

export const booksByContentAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const state = getState()
    const contentConfigIds = Object.keys(ContentName).map(item => ContentName[item])
    const contentStateIds = Object.keys(state._legacybooks.booksByContent)
    const empty = contentConfigIds.filter(contentId => !contentStateIds.includes(contentId))

    if (empty.length) {
      const response = await getContentBooks(empty)
      if (response.ok) {
        const { booksDetails, result } = normalizeContentBooksResponse(state, response)
        await dispatch(setBooksAction(booksDetails))
        await dispatch(setBooksByContentAction(result))
      }
    }
  }
