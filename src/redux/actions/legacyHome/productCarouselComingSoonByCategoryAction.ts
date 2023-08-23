import { State } from 'src/redux/reducers'
import { ContentName, ContentTitle } from 'src/endpoints/nodeJs/books'
import { booksByContentCategorySelector } from 'src/redux/selectors/myBooks/booksSelector'
import { communitiesInterestSelector } from 'src/redux/selectors/communities/interestsListSelector'
import { homeDiscoveryUpdateCardAction } from 'src/redux/actions/legacyHome/discoveryActions'
import { CardIds } from 'src/redux/reducers/LegacyHomeReducer/DiscoveryReducer/CardsReducer'

export const productCarouselComingSoonByCategoryAction: (category: number) => ThunkedAction<State> =
category => async (dispatch, getState) => {
  const state = getState()
  const interest = communitiesInterestSelector(state, { categoryId: category })
  let title: String
  if (Object.keys(interest).length > 0) {
    title = `${interest.name} ${ContentTitle[ContentName.COMING_SOON]}`
  } else {
    title = `${ContentTitle[ContentName.COMING_SOON]} for you`
  }
  const books = Object.values(booksByContentCategorySelector(state, ContentName.COMING_SOON, category))
  await dispatch(homeDiscoveryUpdateCardAction({
    id: CardIds.PRODUCT_CAROUSEL_COMING_SOON_BY_CATEGORY,
    content: books,
    title,
  }))
}
