import { Reducer } from 'redux'

import { getResultLimit } from 'src/endpoints/milq/search/results'
import { Listing } from 'src/models/ListingModel'
import {
  SET_SEARCH_RESULTS, SET_SEARCH_MORE_RESULTS, CLEAR_SEARCH_RESULTS,
} from 'src/redux/actions/legacySearch/searchResultsAction'

export type SearchListingsState = Record<string, Listing>

const DEFAULT: SearchListingsState = {}

const _searchListings: Reducer<SearchListingsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS: {
      const { searchType, listings } = action.payload
      const listingLength = listings.length

      const listing: Listing = {
        ids: listings,
        skip: listingLength,
        canLoadMore: listingLength >= getResultLimit(searchType),
      }

      return ({
        ...state,
        [searchType]: listing,
      })
    }

    case SET_SEARCH_MORE_RESULTS: {
      const { searchType, listings } = action.payload
      const listingLength = listings.length
      const currentSearch = state[searchType] || { ids: [], skip: 0 } // prevent undefined

      const listing: Listing = {
        ids: [...currentSearch.ids, ...listings],
        skip: (currentSearch.skip + listingLength),
        canLoadMore: listingLength >= getResultLimit(searchType),
      }

      return ({
        ...state,
        [searchType]: listing,
      })
    }

    case CLEAR_SEARCH_RESULTS: {
      return DEFAULT
    }

    default:
      return state
  }
}

export default _searchListings
