import { combineReducers } from 'redux'

import storeEvents, { StoreEventsState } from './StoreEventsReducer'
import storeSearch, { StoreSearchResultsState } from './StoreSearchReducer'
import coupons, { CouponsState } from './CouponsReducer'

export interface StoreState {
  storeEvents: StoreEventsState,
  storeSearch: StoreSearchResultsState,
  coupons: CouponsState,
}

export default combineReducers({
  storeEvents,
  storeSearch,
  coupons,
})
