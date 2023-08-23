import { combineReducers } from 'redux'

import {
  makeDictionaryApiStatusReducerUsingApiAction,
  makeApiStatusReducerUsingApiAction,
} from 'src/helpers/redux/makeApiStateReducer'
import { ApiStatus } from 'src/models/ApiStatus'

import { storeEventsApiStatusActions } from 'src/redux/actions/store/events'
import { setStoreDetailsApiStatusActions } from 'src/redux/actions/store/storeDetails'
import { couponsApiStatusActions } from 'src/redux/actions/store/coupons'
import { cartGiftApiStatusActions } from 'src/redux/actions/shop/cartAction'

export interface ApiState {
  events: Record<string, ApiStatus>
  storeDetails: Record<string, ApiStatus>
  coupons: ApiStatus
  cartGift: ApiStatus
}

export default combineReducers<ApiState>({
  events: makeDictionaryApiStatusReducerUsingApiAction(
    storeEventsApiStatusActions().types,
  ),
  storeDetails: makeDictionaryApiStatusReducerUsingApiAction(
    setStoreDetailsApiStatusActions().types,
  ),
  coupons: makeApiStatusReducerUsingApiAction(couponsApiStatusActions.types),
  cartGift: makeApiStatusReducerUsingApiAction(cartGiftApiStatusActions.types),
})
