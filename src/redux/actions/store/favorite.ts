import { State } from 'src/redux/reducers'

import { atgGwSetFavoriteStore } from 'src/endpoints/atgGateway/accountDetails'

import { setAtgProfileAction } from 'src/redux/actions/user/atgAccountAction'
import { atgUserIdSelector } from 'src/redux/selectors/userSelector'
import { favoriteStoreIdSelector } from 'src/redux/selectors/myBn/storeSelector'
import { fetchStoreDetailsAction } from 'src/redux/actions/store/storeDetails'

import { normalizeAtgUserDetails } from 'src/helpers/api/atg/normalizeAccount'
import {
  getCafeVenueByExternalId,
  normalizeCafeSearchVenueResultsResponseData,
} from 'src/endpoints/speedetab/venues'
import { setCafeSearchCafeVenueResults } from 'src/redux/actions/cafe/venuesAction'

export const setFavoriteStoreAction: (
  storeId: string,
) => ThunkedAction<State, boolean> = (storeId) => async (
  dispatch,
  getState,
) => {
  const atgUserId = atgUserIdSelector(getState())
  if (!atgUserId) {
    return false
  }
  const response = await atgGwSetFavoriteStore({ storeId, atgUserId })

  if (response.ok) {
    const { userDetails } = response.data.response
    const normalizedUserDetails = normalizeAtgUserDetails(userDetails)
    await dispatch(setAtgProfileAction(normalizedUserDetails))
    return true
  }
  return false
}

export const fetchFavoriteStoreAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  const favoriteStoreId = favoriteStoreIdSelector(getState())
  dispatch(fetchStoreDetailsAction(favoriteStoreId))
}

export const fetchFavoriteCafeStoreAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  const favoriteStoreId = favoriteStoreIdSelector(getState())
  const response = await getCafeVenueByExternalId({
    externalVenueId: favoriteStoreId,
  })
  if (response.ok) {
    const results = normalizeCafeSearchVenueResultsResponseData(response.data)
    const { venueIds } = results
    if (venueIds[0]) {
      await dispatch(setCafeSearchCafeVenueResults(results))
    }
  }
}
