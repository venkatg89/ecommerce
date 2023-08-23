import { State } from 'src/redux/reducers'
import { ContentName, ContentTitle } from 'src/endpoints/nodeJs/books'
import { booksByContentCategorySelector } from 'src/redux/selectors/myBooks/booksSelector'
import { communitiesInterestSelector } from 'src/redux/selectors/communities/interestsListSelector'
import { homeDiscoveryUpdateCardAction } from 'src/redux/actions/legacyHome/discoveryActions'
import { CardIds } from 'src/redux/reducers/LegacyHomeReducer/DiscoveryReducer/CardsReducer'

export const top3NewReleasesByCategoryAction: (category: number) => ThunkedAction<State> =
category => async (dispatch, getState) => {
  const state = getState()
  const interest = communitiesInterestSelector(state, { categoryId: category })
  let title: String
  if (Object.keys(interest).length > 0) {
    title = `${interest.name} ${ContentTitle[ContentName.NEW_RELEASES]}`
  } else {
    title = `${ContentTitle[ContentName.NEW_RELEASES]} for you`
  }
  const books = Object.values(booksByContentCategorySelector(state, ContentName.NEW_RELEASES, category))
  await dispatch(homeDiscoveryUpdateCardAction({
    id: CardIds.TOP_3_NEW_RELEASES_BY_CATEGORY,
    content: books,
    title,
  }))
}
