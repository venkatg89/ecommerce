import atgApiRequest from 'src/apis/atgGateway'
import bopisApiRequest, { bopisSearchApiRequest } from 'src/apis/bopis'

import {
  StoreSearchSuggestions,
  BopisSearch,
} from 'src/models/StoreModel/SearchModel'

const CONTEXT = {
  session_id: 0,
  client_ip: '0',
  customer_id: '0',
  platform: 'mobile',
}

export interface BopisSearchQueryParams {
  query: string
}

export interface BopisInventoryEnquiry {
  ean: string
}

export const populateStoreDetails = (storeNumber: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: 'my-account/populateStoreDetails',
    data: {
      storeId: storeNumber,
    },
  })
export const bopisInventoryLookupInStore = (storeNumber: string, ean: string) =>
  bopisApiRequest({
    method: 'POST',
    endpoint: '/bopis-api/v1/inventory/lookup/item',
    data: {
      store_num: storeNumber,
      item: { ean: ean },
      ctx: CONTEXT,
    },
  })

export const bopisSearchStoreWithQuery = ({ query }: BopisSearchQueryParams) =>
  bopisApiRequest({
    method: 'POST',
    endpoint: '/bopis-api/v1/store/locate',
    data: {
      params: {
        search_term: query,
      },
      max_radius: 50,
      max_results: 20,
      ctx: CONTEXT,
    },
  })

export interface BopisSearchStoreWithLocationParams {
  geoKey: string
}

export const bopisSearchStoreWithLocation = ({
  geoKey,
}: BopisSearchStoreWithLocationParams) =>
  bopisApiRequest({
    method: 'POST',
    endpoint: '/bopis-api/v1/store/locate',
    data: {
      params: {
        geo_key: geoKey,
      },
      max_radius: 50,
      max_results: 20,
      ctx: CONTEXT,
    },
  })

export const normalizeStoreIdsFromSearchResponseData = (data: any): string[] =>
  data.locations.map((store) => store.location.store_num.toString())

// store suggestions
export const bopisStoreSearchSuggestions = (
  { query }: BopisSearchQueryParams,
  requestKey?,
) =>
  bopisSearchApiRequest({
    method: 'GET',
    endpoint: '/store/search',
    params: {
      term: query,
      'types[]': 'store,location',
      limit: 8,
    },
    requestKey, // for api cancellation
  })

export const normalizeStoreSearchSuggestionsFromResponseData = (
  data: any,
): StoreSearchSuggestions => {
  const stores: BopisSearch[] = data.results.store.map((store) => ({
    term: store.term,
    bopisQuery: store.id,
  }))
  const locations: BopisSearch[] = data.results.location.map((location) => ({
    term: location.term,
    bopisQuery: location.data.zip,
  }))

  return {
    stores,
    locations,
  }
}
