import { State } from 'src/redux/reducers'

import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { fetchRecommendedProducts } from 'src/endpoints/atgGateway/pdp/recommendedProducts'
import {
  getBooksDetails,
  normalizeAtgBookDetailsToBookModelObject,
} from 'src/endpoints/atgGateway/pdp/booksDetails'
import { booksDetailsSelector } from 'src/redux/selectors/booksListSelector'
import { setBooksAction } from 'src/redux/actions/book/searchBookAction'

export const SET_PDP_RECOMMENDED_BOOKS = 'BOOK__RECOMMENDED_BOOKS_SET'
const setPdpRecommededBooks = makeActionCreator(SET_PDP_RECOMMENDED_BOOKS)

export const fetchBookRecommendedBooksAction: (
  ean: string,
) => ThunkedAction<State> = (ean) => async (dispatch, getState) => {
  // TODO Urgent: Quickfixed to silence warnings
  const response = await fetchRecommendedProducts(ean)

  if (response.ok) {
    const { recommendations } = response.data
    const recommendedEanIds = recommendations
      ? recommendations.map((item) => item.ean)
      : []
    const state = getState()
    const _booksDetailsSelector = booksDetailsSelector()
    let books = _booksDetailsSelector(state, { eans: recommendedEanIds })
    const missing = recommendedEanIds.filter((item) => !books[item])
    if (missing.length) {
      const detailsResponse = await getBooksDetails(missing)
      if (detailsResponse.ok && detailsResponse.data.response.success) {
        const missingBooks = normalizeAtgBookDetailsToBookModelObject(
          detailsResponse.data,
        )
        books = {
          ...books,
          ...missingBooks,
        }
        await dispatch(setBooksAction(missingBooks))
      }
    }

    await dispatch(setPdpRecommededBooks({ ean, recommendedEanIds, books }))
  }
}
