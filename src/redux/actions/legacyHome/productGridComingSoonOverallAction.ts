import { State } from 'src/redux/reducers'
import { ContentName, ContentTitle } from 'src/endpoints/nodeJs/books'
import { booksByContentOverallSelector } from 'src/redux/selectors/myBooks/booksSelector'
import { CardIds } from 'src/redux/reducers/LegacyHomeReducer/DiscoveryReducer/CardsReducer'
import { homeDiscoveryUpdateCardAction } from 'src/redux/actions/legacyHome/discoveryActions'

export const productGridComingSoonOverallAction: () => ThunkedAction<State> =
() => async (dispatch, getState) => {
  const state = getState()
  const books = Object.values(booksByContentOverallSelector(state, ContentName.COMING_SOON))
  await dispatch(homeDiscoveryUpdateCardAction({
    id: CardIds.PRODUCT_GRID_COMING_SOON_OVERALL,
    content: books,
    title: ContentTitle[ContentName.COMING_SOON],
  }))
}
