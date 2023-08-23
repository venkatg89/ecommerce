import { Reducer } from 'redux'

import { SET_STORES_SEARCH_RESULTS } from 'src/redux/actions/store/search'

export type StoreSearchResultsState = string[]

const DEFAULT: StoreSearchResultsState = []

const storeSearchResults: Reducer<StoreSearchResultsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_STORES_SEARCH_RESULTS: {
      const { storeIds } = action.payload
      return storeIds
    }

    default:
      return state
  }
}

export default storeSearchResults
