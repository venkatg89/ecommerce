import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { getCategoryBooks, normalizeCategoryBooksResponse } from 'src/endpoints/nodeJs/books'
import { myInterestCommunities } from 'src/redux/selectors/userSelector'
import { booksByInterestSelector } from 'src/redux/selectors/booksListSelector'
import { setBooksAction } from 'src/redux/actions/book/searchBookAction'

export const SET_BOOKS_BY_INTEREST_ACTION = 'SET_BOOKS_BY_INTEREST_ACTION'

export const setBooksByInterestAction = makeActionCreator(SET_BOOKS_BY_INTEREST_ACTION)

export const booksByInterestAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const state = getState()
    const interests = myInterestCommunities(state)
    if (!interests.length) {
      return
    }

    const empty = interests.filter((interestId) => {
      const data = booksByInterestSelector(state, interestId)
      return !Object.keys(data).length
    })

    if (empty.length) {
      const response = await getCategoryBooks(empty)
      if (response.ok) {
        const { booksDetails, result } = normalizeCategoryBooksResponse(state, response)
        await dispatch(setBooksAction(booksDetails))
        await dispatch(setBooksByInterestAction(result))
      }
    }
  }
