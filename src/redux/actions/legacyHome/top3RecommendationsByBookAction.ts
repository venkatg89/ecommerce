import { State } from 'src/redux/reducers'
import {
  getBooksDetails,
  normalizeAtgBookDetailsToBookModelArray,
} from 'src/endpoints/atgGateway/pdp/booksDetails'
import {
  bookRecommendationsSelector,
  booksDetailsSelector,
  bookSelector,
} from 'src/redux/selectors/booksListSelector'
import { excludeUserBooksSelector } from 'src/redux/selectors/myBooks/booksSelector'
import { Ean } from 'src/models/BookModel'
import { homeDiscoveryUpdateCardAction } from 'src/redux/actions/legacyHome/discoveryActions'
import { CardIds } from 'src/redux/reducers/LegacyHomeReducer/DiscoveryReducer/CardsReducer'
import { fetchBookRecommendationsAction } from './fetchBookRecommendationsAction'

export const top3RecommendationsByBookAction: (
  ean: Ean,
) => ThunkedAction<State> = (ean) => async (dispatch, getState) => {
  let content = []
  let title = 'Similar books'

  if (ean.length) {
    let state = getState()
    let bookDetails: any = bookSelector(state, { ean })
    if (!Object.keys(bookDetails).length) {
      const eanBookDetails = await getBooksDetails([ean])
      if (eanBookDetails.ok && eanBookDetails.data.response.success) {
        bookDetails =
          normalizeAtgBookDetailsToBookModelArray(
            eanBookDetails.data,
          ).shift() || {}
      }
    }

    if (Object.keys(bookDetails).length) {
      title = `Similar to ${bookDetails.name}`
    }

    let eans = bookRecommendationsSelector(state, ean)
    if (!eans.length) {
      await dispatch(fetchBookRecommendationsAction(ean))
    }

    state = getState()
    eans = bookRecommendationsSelector(state, ean)
    if (eans.length) {
      const _booksDetailsSelector = booksDetailsSelector()
      let books = _booksDetailsSelector(state, { eans })
      const _excludeUserBooksSelector = excludeUserBooksSelector()
      books = _excludeUserBooksSelector(state, { books })
      content = Object.values(books)
    }
  }

  await dispatch(
    homeDiscoveryUpdateCardAction({
      id: CardIds.TOP_3_RECOMMENDATIONS_BY_BOOK,
      content,
      title,
    }),
  )
}
