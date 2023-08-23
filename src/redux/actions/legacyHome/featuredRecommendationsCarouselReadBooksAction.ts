import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import { homeDiscoveryUpdateCardAction } from 'src/redux/actions/legacyHome/discoveryActions'
import { getReadingListBooksSelector, excludeUserBooksSelector } from 'src/redux/selectors/myBooks/booksSelector'
import {
  booksByInterestSelector,
  featuredRecommendationsSelector,
  booksDetailsSelector,
} from 'src/redux/selectors/booksListSelector'
import { myInterestCommunities } from 'src/redux/selectors/userSelector'
import { ContentName } from 'src/endpoints/nodeJs/books'
import { CardIds } from 'src/redux/reducers/LegacyHomeReducer/DiscoveryReducer/CardsReducer'
import { setBooksAction } from 'src/redux/actions/book/searchBookAction'
import { fetchBookRecommendationsAction } from './fetchBookRecommendationsAction'
import { ReadingStatus } from 'src/models/ReadingStatusModel'
import { shuffleArray } from 'src/helpers/shuffleHelper'

export const SET_FEATURED_RECOMMENDATIONS_ACTION = 'SET_FEATURED_RECOMMENDATIONS_ACTION'

export const setFeaturedRecommendationsAction = makeActionCreator(SET_FEATURED_RECOMMENDATIONS_ACTION)

export const getRecommendedProductsActions = makeApiActions(
  'featuredRecommendations',
  'HOME__FEATURED_RECOMMENDATIONS',
)

export const featuredRecommendationsCarouselReadBooksAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    let state = getState()
    let eans = featuredRecommendationsSelector(state)
    let content = []
    if (!eans.length) {
      const _getReadingListBooksSelector = getReadingListBooksSelector()
      const ean = shuffleArray(Object.keys(_getReadingListBooksSelector(state, { status: ReadingStatus.FINISHED })))
      if (ean.length) {
        await dispatch(fetchBookRecommendationsAction(ean))
      }
    }

    state = getState()
    eans = featuredRecommendationsSelector(state)
    if (eans.length) {
      const _booksDetailsSelector = booksDetailsSelector()
      content = Object.values(_booksDetailsSelector(state, { eans }))
    } else {
    // fallback to user's first interest books, when no recommendations found
      state = getState()
      const interests = myInterestCommunities(state)
      if (interests.length) {
        eans = booksByInterestSelector(state, interests[0], ContentName.BESTSELLERS)
        if (eans.length) {
          const _booksDetailsSelector = booksDetailsSelector()
          let books = _booksDetailsSelector(state, { eans })
          const _excludeUserBooksSelector = excludeUserBooksSelector()
          books = _excludeUserBooksSelector(state, { books })
          content = Object.values(books)
          await dispatch(setFeaturedRecommendationsAction(eans))
          await dispatch(setBooksAction(books))
        }
      }
    }

    await dispatch(homeDiscoveryUpdateCardAction({
      content,
      id: CardIds.FEATURED_RECOMMENDATIONS,
    }))
  }
