import { State } from 'src/redux/reducers'
import { ContentName, ContentTitle } from 'src/endpoints/nodeJs/books'
import { booksByContentOverallSelector } from 'src/redux/selectors/myBooks/booksSelector'
import { CardIds } from 'src/redux/reducers/LegacyHomeReducer/DiscoveryReducer/CardsReducer'
import { homeDiscoveryUpdateCardAction } from 'src/redux/actions/legacyHome/discoveryActions'

export const productGridNewReleasesOverallAction: () => ThunkedAction<State> =
() => async (dispatch, getState) => {
  const state = getState()
  const books = Object.values(booksByContentOverallSelector(state, ContentName.NEW_RELEASES))
  await dispatch(homeDiscoveryUpdateCardAction({
    id: CardIds.PRODUCT_GRID_NEW_RELEASES_OVERALL,
    content: books,
    title: ContentTitle[ContentName.NEW_RELEASES],
  }))
}
