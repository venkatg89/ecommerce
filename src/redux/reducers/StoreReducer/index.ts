import { combineReducers } from 'redux'

import events, { StoreEventsState } from './EventsReducer'
import storeDetails, { StoreDetailsState } from './StoreDetailsReducer'
import coupons, { CouponsState } from './CouponsReducer'

export interface StoreState {
  events: StoreEventsState
  storeDetails: StoreDetailsState
  coupons: CouponsState
}

export default combineReducers({
  events,
  storeDetails,
  coupons,
})
