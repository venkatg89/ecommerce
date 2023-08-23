import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { State } from 'src/redux/reducers'

import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import {
  makeRequestKeyFromActions,
  cancelApiRequestFromActions,
} from 'src/helpers/redux/cancelTokenSources'

import {
  bopisSearchStoreWithQuery,
  bopisSearchStoreWithLocation,
  normalizeStoreIdsFromSearchResponseData,
  bopisStoreSearchSuggestions,
  normalizeStoreSearchSuggestionsFromResponseData,
} from 'src/endpoints/bopis/stores'
import {
  bopisGenerateUserLocationGeoKey,
  getGeoKeyFromResponseData,
  BopisGenerateUserLocationGeoKeyParams,
} from 'src/endpoints/bopis/userLocation'
import {
  storeGetStoresDetails,
  normalizeStoresDetailsFromResponseData,
} from 'src/endpoints/storeGateway/storeDetails'

import { StoreSearchSuggestions } from 'src/models/StoreModel/SearchModel'

// since graphql gives us back empty stores, filter out the empty ones
const filterOutStoreIdsWithNoData = (storeIds, stores) => {
  const validStoreIds = Object.keys(stores)
  return storeIds.filter((id) => validStoreIds.includes(id))
}

export const storeSearchStoresActions = makeApiActions(
  'storeSearchStores',
  'STORES__SEARCH_STORES',
)

export const SET_STORES_SEARCH_RESULTS = 'STORES__SEARCH_RESULTS_SET'
const setStoresSearchResults = makeActionCreator(SET_STORES_SEARCH_RESULTS)

export const CLEAR_STORES_SEARCH_RESULTS = 'STORES__SEARCH_RESULTS_CLEAR'
export const clearStoresSearchResultsAction = makeActionCreator(
  CLEAR_STORES_SEARCH_RESULTS,
)

export const searchStoreWithQueryAction: (
  query: string,
) => ThunkedAction<State> = (query) => async (dispatch, getState) => {
  const response = await bopisSearchStoreWithQuery({ query })
  if (response.ok && response.data && response.data.locations.length) {
    // careful 200 can return empty
    const storeIds = normalizeStoreIdsFromSearchResponseData(response.data)
    const storesDetailsResponse = await actionApiCall(
      dispatch,
      storeSearchStoresActions,
      () => storeGetStoresDetails({ storeIds }),
    )
    if (storesDetailsResponse.ok) {
      const stores = normalizeStoresDetailsFromResponseData(
        storesDetailsResponse.data,
      )
      const validStoreIds = filterOutStoreIdsWithNoData(storeIds, stores)
      await dispatch(
        setStoresSearchResults({ storeIds: validStoreIds, stores }),
      )
    }
  }
}

const storeResultsBOPISNormalizer = (data) => {
  let storeResults = {}
  for (let i = 0; i < data.locations.length; i++) {
    let store = data.locations[i].location
    storeResults[store.store_num] = {
      id: '' + store.store_num,
      name: store.store_name,
      address: store.address2,
      city: store.city,
      state: store.state,
      zip: store.zip_code,
      phone: store.phone,
      hours: store.hours,
    }
  }
  return storeResults
}

export const searchStoreWithQueryBOPISAction: (
  query: string,
) => ThunkedAction<State> = (query) => async (dispatch, getState) => {
  const response = await bopisSearchStoreWithQuery({ query })
  if (response.ok && response.data && response.data.locations.length) {
    const storeIds = normalizeStoreIdsFromSearchResponseData(response.data)
    const storesBopisResponse = storeResultsBOPISNormalizer(response.data)
    const storesDetailsResponse = await actionApiCall(
      dispatch,
      storeSearchStoresActions,
      () => storeGetStoresDetails({ storeIds }),
    )
    if (storesDetailsResponse.ok) {
      const stores = normalizeStoresDetailsFromResponseData(
        storesDetailsResponse.data,
      )
      await dispatch(
        setStoresSearchResults({
          storeIds: storeIds,
          stores: { ...storesBopisResponse, ...stores },
        }),
      )
    }
  }
}
export type SearchStoreWithLocationActionParams = BopisGenerateUserLocationGeoKeyParams

export const searchStoreWithLocationAction: (
  params: SearchStoreWithLocationActionParams,
) => ThunkedAction<State> = (params) => async (dispatch, getState) => {
  const geoKeyResponse = await bopisGenerateUserLocationGeoKey(params)
  if (geoKeyResponse.ok) {
    const geoKey = getGeoKeyFromResponseData(geoKeyResponse.data)
    const response = await bopisSearchStoreWithLocation({ geoKey })
    if (response.ok) {
      const storeIds = normalizeStoreIdsFromSearchResponseData(response.data)
      const storesDetailsResponse = await actionApiCall(
        dispatch,
        storeSearchStoresActions,
        () => storeGetStoresDetails({ storeIds }),
      )
      if (storesDetailsResponse.ok) {
        const stores = normalizeStoresDetailsFromResponseData(
          storesDetailsResponse.data,
        )
        const validStoreIds = filterOutStoreIdsWithNoData(storeIds, stores)
        await dispatch(
          setStoresSearchResults({ storeIds: validStoreIds, stores }),
        )
      }
    }
  }
}

export const fetchNearestStoreAction: (
  params: SearchStoreWithLocationActionParams,
) => ThunkedAction<State> = (params) => async (dispatch, getState) => {
  const geoKeyResponse = await bopisGenerateUserLocationGeoKey(params)
  if (geoKeyResponse.ok) {
    const geoKey = getGeoKeyFromResponseData(geoKeyResponse.data)
    const response = await bopisSearchStoreWithLocation({ geoKey })
    if (response.ok) {
      return response.data.locations[0]
    }
  }
  return ''
}

export const fetchNearestStoreIdAction: (
  params: SearchStoreWithLocationActionParams,
) => ThunkedAction<State, string> = (params) => async (dispatch, getState) => {
  const geoKeyResponse = await bopisGenerateUserLocationGeoKey(params)
  if (geoKeyResponse.ok) {
    const geoKey = getGeoKeyFromResponseData(geoKeyResponse.data)
    const response = await bopisSearchStoreWithLocation({ geoKey })
    if (response.ok) {
      const storeIds = normalizeStoreIdsFromSearchResponseData(response.data)
      return storeIds[0]
    }
  }
  return ''
}

// create api action for cancel
export const storeSearchSuggestionsApiStatusActions = makeApiActions(
  'storeSearchSuggestions',
  'STORE__SEARCH_SUGGESTIONS',
)

export const storeSearchSuggestionsAction: (
  query: string,
) => ThunkedAction<State, StoreSearchSuggestions | undefined> = (
  query,
) => async (dispatch, getState) => {
  await cancelApiRequestFromActions(storeSearchSuggestionsApiStatusActions)

  const response = await actionApiCall(
    dispatch,
    storeSearchSuggestionsApiStatusActions,
    () =>
      bopisStoreSearchSuggestions(
        { query },
        makeRequestKeyFromActions(storeSearchSuggestionsApiStatusActions),
      ),
  )

  if (response.ok) {
    return normalizeStoreSearchSuggestionsFromResponseData(response.data)
  }
  return undefined
}
