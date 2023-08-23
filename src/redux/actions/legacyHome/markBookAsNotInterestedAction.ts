import { State } from 'src/redux/reducers'

import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import { myNotInterestedList } from 'src/redux/selectors/userSelector'

import { updateNotInterestedList } from 'src/endpoints/nodeJs/profile'
import { setNotInterestedAction } from '../user/nodeProfileActions'
import { Ean } from 'src/models/BookModel'

import {
  homeDiscoveryCardFilterBookAction,
  homeDiscoveryCardRestoreBooksAction,
} from './discoveryActions'

import { CardIds } from 'src/redux/reducers/LegacyHomeReducer/DiscoveryReducer/CardsReducer'

export const SET_BOOK_AS_NOT_INTERESTED = 'SET_BOOK_AS_NOT_INTERESTED'
export const setBookAsNotInterested = makeActionCreator(
  SET_BOOK_AS_NOT_INTERESTED,
)

export const FILTER_FEATURE_RECOMMENDATIONS = 'FILTER_FEATURE_RECOMMENDATIONS'
export const filterFeatureRecommendationsAction = makeActionCreator(
  FILTER_FEATURE_RECOMMENDATIONS,
)

export const RESTORE_FEATURE_RECOMMENDATIONS = 'RESTORE_FEATURE_RECOMMENDATIONS'
export const restoreFeatureRecommendationsActions = makeActionCreator(
  RESTORE_FEATURE_RECOMMENDATIONS,
)

export const CLEAR_NOT_INTERESTED = 'CLEAR_NOT_INTERESTED'
export const clearNotInterestedActions = makeActionCreator(CLEAR_NOT_INTERESTED)

export const setBookAsNotInterestedActions = makeApiActions(
  'setBookAsNotInterested',
  'HOME__SET_BOOK_AS_NOT_INTERESTED',
)

export const clearNotInterestedList = makeApiActions(
  'clearNotInterested',
  'CLEAR__NOT_INTERESTED',
)

export const setBookAsNotInterestedAction: (
  ean: Ean,
) => ThunkedAction<State> = (ean) => async (dispatch, getState) => {
  const response = await actionApiCall(
    dispatch,
    setBookAsNotInterestedActions,
    () => updateNotInterestedList({ [ean]: {} }),
  )

  if (response.ok) {
    await dispatch(setNotInterestedAction(Object.keys(response.data)))
    await dispatch(filterFeatureRecommendationsAction(ean))
    await dispatch(
      homeDiscoveryCardFilterBookAction({
        ean,
        id: CardIds.FEATURED_RECOMMENDATIONS,
      }),
    )
  }
}

export const clearMyNotInterestedList: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  const state = getState()
  const notInterestedList = myNotInterestedList(state)
  const params = notInterestedList.reduce(
    (result, ean) => ({ ...result, [ean]: null }),
    {},
  )
  const books = state._legacybooks.booksList
  const booksList = notInterestedList
    .map((ean) => books[ean])
    .filter((item) => item)
  try {
    const response = await actionApiCall(dispatch, clearNotInterestedList, () =>
      updateNotInterestedList(params),
    )
    if (response.ok) {
      await Promise.all([
        await dispatch(clearNotInterestedActions()),
        await dispatch(restoreFeatureRecommendationsActions(notInterestedList)),
        await dispatch(
          homeDiscoveryCardRestoreBooksAction({
            id: CardIds.FEATURED_RECOMMENDATIONS,
            books: booksList,
          }),
        ),
      ])
    }
  } catch {
    /* */
  }
}
