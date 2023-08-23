import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import { shuffleObject } from 'src/helpers/shuffleHelper'
import { fetchRecommendedProducts } from 'src/endpoints/atgGateway/pdp/recommendedProducts'
import {
  getBooksDetails,
  normalizeAtgBookDetailsToBookModelArray,
} from 'src/endpoints/atgGateway/pdp/booksDetails'
import { booksDetailsSelector } from 'src/redux/selectors/booksListSelector'
import { excludeUserBooksSelector } from 'src/redux/selectors/myBooks/booksSelector'
import { Ean } from 'src/models/BookModel'
import {
  setFeaturedRecommendationsAction,
  getRecommendedProductsActions,
} from 'src/redux/actions/legacyHome/featuredRecommendationsCarouselReadBooksAction'
import { setBooksAction } from 'src/redux/actions/book/searchBookAction'

export const SET_BOOK_RECOMMENDATIONS_ACTION = 'SET_BOOK_RECOMMENDATIONS_ACTION'

export const setBookRecommendationsAction = makeActionCreator(
  SET_BOOK_RECOMMENDATIONS_ACTION,
)

export const fetchBookRecommendationsAction: (
  ean: Ean,
) => ThunkedAction<State> = (ean) => async (dispatch, getState) => {
  if (!ean.length) {
    return
  }

  const state = getState()
  const response = await actionApiCall(
    dispatch,
    getRecommendedProductsActions,
    () => fetchRecommendedProducts(ean),
  )
  if (
    !response.ok ||
    !response.data.recommendations ||
    !response.data.recommendations.length
  ) {
    return
  }

  const { recommendations } = response.data
  const eans = recommendations.map((item) => item.ean)
  const _booksDetailsSelector = booksDetailsSelector()
  let books = _booksDetailsSelector(state, { eans })
  const missing = eans.filter((item) => !books[item])
  if (missing.length) {
    const detailsResponse = await getBooksDetails(missing)
    if (detailsResponse.ok && detailsResponse.data.response.success) {
      books = {
        ...books,
        ...normalizeAtgBookDetailsToBookModelArray(detailsResponse.data).reduce(
          (acc, val) => {
            acc[val.ean] = val
            return acc
          },
          {},
        ),
      }
    }
  }
  const _excludeUserBooksSelector = excludeUserBooksSelector()
  books = _excludeUserBooksSelector(state, { books })
  books = shuffleObject(books)
  await dispatch(setBooksAction(books))
  if (ean.length === 1) {
    await dispatch(
      setBookRecommendationsAction({
        ean: ean[0],
        books: Object.keys(books),
      }),
    )
    return
  }

  await dispatch(setFeaturedRecommendationsAction(Object.keys(books)))
}
