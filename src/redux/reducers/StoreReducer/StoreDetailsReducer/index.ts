import { Reducer } from 'redux'

import { StoreModel } from 'src/models/StoreModel'

import { SET_STORES_SEARCH_RESULTS } from 'src/redux/actions/store/search'
import { SET_STORE_DETAILS } from 'src/redux/actions/store/storeDetails'

export type StoreDetailsState = Record<string, StoreModel>

const DEFAULT: StoreDetailsState = {}

const storeDetails: Reducer<StoreDetailsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_STORE_DETAILS:
    case SET_STORES_SEARCH_RESULTS: {
      const { stores } = action.payload
      return {
        ...state,
        ...stores,
      }
    }

    default:
      return state
  }
}

export default storeDetails
