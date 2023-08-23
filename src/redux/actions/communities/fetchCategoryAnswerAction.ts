import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { normalizeBooksResult } from 'src/helpers/api/milq/normalizeBookResult'
import { fetchCommunityProducts } from 'src/endpoints/milq/communities/fetchCategoryProducts'

export const SET_BOOKS_ACTION = 'SET_BOOKS_ACTION'
export const SET_BOOKS_EAN_LIST_ACTION = 'SET_BOOKS_EAN_LIST_ACTION'
export const RESET_BOOKS_EAN_LIST_ACTION = 'RESET_BOOKS_EAN_LIST_ACTION'
export const SET_BOOKS_TO_CATEGORY_ACTION = 'SET_BOOKS_TO_CATEGORY_ACTION'
export const RESET_BOOKS_TO_CATEGORY_ACTION = 'RESET_BOOKS_TO_CATEGORY_ACTION'

export const setBooksAction = makeActionCreator(SET_BOOKS_ACTION)
export const setBooksEANListAction = makeActionCreator(SET_BOOKS_EAN_LIST_ACTION)
export const resetBooksEANListAction = makeActionCreator(RESET_BOOKS_EAN_LIST_ACTION)
export const setBooksToCategoryAction = makeActionCreator(SET_BOOKS_TO_CATEGORY_ACTION)
export const resetBooksToCategoryAction = makeActionCreator(RESET_BOOKS_TO_CATEGORY_ACTION)

export const fetchCategoryAnswerAction: (categoryId: string) => ThunkedAction<State> =
  categoryId => async (dispatch, getState) => {
    // TODO implement pagination
    const params = {
      sort: 'recent',
      from: 0,
      limit: 9,
    }
    const response = await fetchCommunityProducts(categoryId, params)
    if (response.ok) {
      const { eans, booksList, bookToAnswer } = normalizeBooksResult(response.data)
      await Promise.all([
        dispatch(setBooksAction(booksList)),
        dispatch(setBooksEANListAction({ name: `category-${categoryId}`, eans })),
      ])
      await dispatch(setBooksToCategoryAction({ interestId: categoryId, bookToAnswer }))
    } else {
      // TODO signal error
    }
  }
