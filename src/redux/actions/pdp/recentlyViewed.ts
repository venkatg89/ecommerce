import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { fetchRecentlyViewed } from 'src/endpoints/atgGateway/pdp/recentlyViewed'

export const SET_RECENTLY_VIEWED = 'SET_PDP_RECENTLY_VIEWED'
export const setRecentlyViewed = makeActionCreator<string[]>(
  SET_RECENTLY_VIEWED,
)

export const getRecentlyViewedAction: (ean?: string) => ThunkedAction<State> = (
  ean,
) => async (dispatch, getState) => {
  const response = await fetchRecentlyViewed(ean)

  if (response.ok) {
    if (response.data.response.browsedProducts) {
      const eans = response.data.response.browsedProducts.map(
        (product) => product.eanId,
      )
      dispatch(setRecentlyViewed(eans))
    }
  }
}
