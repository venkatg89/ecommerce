import { State } from 'src/redux/reducers'

import actionApiCall from 'src/helpers/redux/actionApiCall'
import getResponseError from 'src/helpers/api/getResponseError'
import { RequestStatus } from 'src/models/ApiStatus'
import { StoreSearchSuggestions } from 'src/models/StoreModel/SearchModel'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import {
  makeApiActions,
  makeApiActionsWithIdPayloadMaker,
} from 'src/helpers/redux/makeApiActions'

import {
  cancelApiRequestFromActions,
  makeRequestKeyFromActions,
} from 'src/helpers/redux/cancelTokenSources'
import { venueNormalizer } from 'src/helpers/api/cafe/venueNormalizer'

import {
  getCafeVenue,
  getCafeSearchVenueResults,
  getCafeVenueByExternalId,
  normalizeCafeSearchVenueResultsResponseData,
} from 'src/endpoints/speedetab/venues'

import {
  bopisStoreSearchSuggestions,
  bopisSearchStoreWithQuery,
  normalizeStoreIdsFromSearchResponseData,
} from 'src/endpoints/bopis/stores'

import {
  storeGetStoresDetails,
  normalizeStoresDetailsFromResponseData,
} from 'src/endpoints/storeGateway/storeDetails'

import { storeSearchStoresActions } from 'src/redux/actions/store/search'

import { searchVenuesApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/cafe'
import { cafeSearchVenuesSelector } from 'src/redux/selectors/listings/cafeSelector'
import Logger from 'src/helpers/logger'
import { CafeVenue } from 'src/models/CafeModel/VenueModel'

const logger = Logger.getInstance()

export const SET_CAFE_VENUE = 'CAFE__VENUE_SET'
const setCafeVenue = makeActionCreator(SET_CAFE_VENUE)
export const cafeVenueApiStatusActions = makeApiActionsWithIdPayloadMaker(
  'cafeVenue',
  'CAFE__VENUE',
)

export const fetchCafeVenueAction: (venueId: string) => ThunkedAction<State> = (
  venueId,
) => async (dispatch, getState) => {
  const response = await actionApiCall(
    dispatch,
    cafeVenueApiStatusActions(venueId),
    () => getCafeVenue({ venueId }),
  )
  if (response.ok) {
    const venue = venueNormalizer(response.data.venue)
    await dispatch(setCafeVenue({ venue }))
  } else {
    logger.error(
      `fetchCafeVenueAction ${venueId} failed with ${getResponseError(
        response,
      )}`,
    )
  }
}

export const SET_CAFE_SEARCH_VENUE_RESULTS = 'CAFE__SEARCH_VENUE_RESULTS_SET'
export const setCafeSearchCafeVenueResults = makeActionCreator(
  SET_CAFE_SEARCH_VENUE_RESULTS,
)
export const SET_CAFE_SEARCH_VENUE_MORE_RESULTS =
  'CAFE__SEARCH_VENUE_MORE_RESULTS_SET'
const setCafeSearchCafeVenueMoreResults = makeActionCreator(
  SET_CAFE_SEARCH_VENUE_MORE_RESULTS,
)

export const cafeSearchVenuesResultsApiStatusActions = makeApiActions(
  'cafeVenues',
  'CAFE__SEARCH_VENUES',
)

export interface FetchCafeSearchVenueResultsActionParams {
  query?: string
  longitude?: number
  latitude?: number
}

export const fetchCafeSearchVenueResultsAction: (
  params: FetchCafeSearchVenueResultsActionParams,
) => ThunkedAction<State> = (params) => async (dispatch, getState) => {
  // eslint-disable-line
  if (
    searchVenuesApiRequestStatusSelector(getState()) === RequestStatus.FETCHING
  ) {
    return
  }
  await dispatch(cafeSearchVenuesResultsApiStatusActions.actions.inProgress)

  const response = await getCafeSearchVenueResults({ ...params })

  if (response.ok) {
    const results = normalizeCafeSearchVenueResultsResponseData(response.data)
    logger.info(
      `fetchCafeSearchVenueResultsAction {${params.latitude}, ${
        params.longitude
      }, ${params.query}} results ${Object.keys(results.venues)}`,
    )
    await dispatch(setCafeSearchCafeVenueResults(results))
  } else {
    logger.error(
      `fetchCafeVenueAction {${params.latitude}, ${params.longitude}, ${
        params.query
      }} failed with ${getResponseError(response)}`,
    )
  }
  await dispatch(cafeSearchVenuesResultsApiStatusActions.actions.success)
}

export const fetchCafeSearchVenueMoreResultsAction: (
  params: FetchCafeSearchVenueResultsActionParams,
) => ThunkedAction<State> = (params) => async (dispatch, getState) => {
  // eslint-disable-line
  const state = getState()
  const { skip, canLoadMore } = cafeSearchVenuesSelector(state)
  if (!canLoadMore) {
    return
  }

  if (searchVenuesApiRequestStatusSelector(state) === RequestStatus.FETCHING) {
    return
  }
  await dispatch(cafeSearchVenuesResultsApiStatusActions.actions.inProgress)

  const response = await getCafeSearchVenueResults({ ...params, skip })

  if (response.ok) {
    const results = normalizeCafeSearchVenueResultsResponseData(response.data)
    logger.info(
      `fetchCafeSearchVenueMoreResultsAction {${params.latitude}, ${
        params.longitude
      }, ${params.query}} results ${Object.keys(results.venues)}`,
    )
    await dispatch(setCafeSearchCafeVenueMoreResults(results))
  } else {
    logger.error(
      `fetchCafeSearchVenueMoreResultsAction {${params.latitude}, ${
        params.longitude
      }, ${params.query}} failed with ${getResponseError(response)}`,
    )
  }
  await dispatch(cafeSearchVenuesResultsApiStatusActions.actions.success)
}

const filterOutIdsWithNoCafe = (ids, stores) => {
  const validIds = Object.keys(stores).filter(
    (store) => ids.includes(stores[store].id) && stores[store].hasCafe === true,
  )
  return validIds
}

export const storeSearchSuggestionsCafeApiStatusActions = makeApiActions(
  'storeSearchSuggestionsCafe',
  'STORE__SEARCH_SUGGESTIONS_CAFE',
)

export const setStoreDetailsSearchApiStatusActions = makeApiActions(
  'storeDetailsSearchCafe',
  'STORE__DETAILS_SEARCH_CAFE',
)

export const storeSearchSuggestionsCafeAction: (
  query: string,
) => ThunkedAction<State, StoreSearchSuggestions | undefined> = (
  query,
) => async (dispatch, getState) => {
  await cancelApiRequestFromActions(storeSearchSuggestionsCafeApiStatusActions)

  const response = await actionApiCall(
    dispatch,
    storeSearchSuggestionsCafeApiStatusActions,
    () =>
      bopisStoreSearchSuggestions(
        { query },
        makeRequestKeyFromActions(storeSearchSuggestionsCafeApiStatusActions),
      ),
  )

  if (response.ok) {
    const storesIds = response.data.results.store.map((store) =>
      store.id.toString(),
    )

    const locationsIds = response.data.results.location.map((location) =>
      location.id.toString(),
    )

    const ids = [...storesIds, ...locationsIds]

    if (ids.length) {
      const storesDetailsResponseStoresIds = await actionApiCall(
        dispatch,
        storeSearchStoresActions,
        () => storeGetStoresDetails({ storeIds: ids }),
      )

      if (storesDetailsResponseStoresIds.ok) {
        const storesDetails = normalizeStoresDetailsFromResponseData(
          storesDetailsResponseStoresIds.data,
        )
        const validStoreIds = filterOutIdsWithNoCafe(storesIds, storesDetails)
        const validLocationIds = filterOutIdsWithNoCafe(
          locationsIds,
          storesDetails,
        )

        const searchSuggestions = {
          stores: validStoreIds.map((id) => ({
            term: storesDetails[id].name,
            bopisQuery: id,
          })),
          locations: validLocationIds.map((id) => ({
            term: `${storesDetails[id].city}, ${storesDetails[id].state}`,
            bopisQuery: storesDetails[id].zip,
          })),
        }

        return searchSuggestions
      }
    }
    return {
      stores: [],
      locations: [],
    }
  }
  return undefined
}

interface CafeVenueResults {
  venueIds: string[]
  venues: Record<string, CafeVenue>
}

export const searchCafeWithQueryAction: (
  query: string,
) => ThunkedAction<State> = (query) => async (dispatch, getState) => {
  let cafeVenueResults: CafeVenueResults = {
    venueIds: [],
    venues: {},
  }
  const response = await bopisSearchStoreWithQuery({ query })

  if (
    searchVenuesApiRequestStatusSelector(getState()) === RequestStatus.FETCHING
  ) {
    return
  }
  await dispatch(cafeSearchVenuesResultsApiStatusActions.actions.inProgress)

  if (response.ok && response.data && response.data.locations.length) {
    const storeIds = normalizeStoreIdsFromSearchResponseData(response.data)

    for (let storeId = 0; storeId < storeIds.length; storeId++) {
      const responseCafe = await getCafeVenueByExternalId({
        externalVenueId: storeIds[storeId],
      })

      if (
        responseCafe.ok &&
        responseCafe.data &&
        responseCafe.data.venues.length
      ) {
        const normalizeCafe = normalizeCafeSearchVenueResultsResponseData(
          responseCafe.data,
        )
        cafeVenueResults = {
          venueIds: [...cafeVenueResults.venueIds, ...normalizeCafe.venueIds],
          venues: { ...cafeVenueResults.venues, ...normalizeCafe.venues },
        }
      }
    }
    if (cafeVenueResults.venueIds.length) {
      await dispatch(cafeSearchVenuesResultsApiStatusActions.actions.success)
      await dispatch(setCafeSearchCafeVenueResults(cafeVenueResults))
    } else {
      await dispatch(cafeSearchVenuesResultsApiStatusActions.actions.failed)
    }
  } else {
    await dispatch(cafeSearchVenuesResultsApiStatusActions.actions.failed)
  }
}
