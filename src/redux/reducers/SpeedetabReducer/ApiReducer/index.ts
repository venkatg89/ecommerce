import { combineReducers } from 'redux'

import {
  makeDictionaryApiStatusReducerUsingApiAction, makeApiStatusReducerUsingApiAction,
} from 'src/helpers/redux/makeApiStateReducer'
import { ApiStatus } from 'src/models/ApiStatus'

import {
  addOrderToCartApiStatusActions, submitCafeOrderApiStatusActions, cafeCartOrderSummaryApiStatusActions,
} from 'src/redux/actions/cafe/cartAction'
import { addNewPaymentApiActions } from 'src/redux/actions/cafe/paymentsAction'
import { fetchRecentOrdersApiStatusActions, fetchCurrentOrdersActionApiStatusActions } from 'src/redux/actions/cafe/orderAction'
import { cafeSearchVenuesResultsApiStatusActions } from 'src/redux/actions/cafe/venuesAction'

export interface ApiState {
  addToCart: Record<string, ApiStatus>;
  addNewPaymentCard: ApiStatus;
  submitOrder: ApiStatus;
  cartOrderSummary: ApiStatus;
  fetchCurrentOrders: ApiStatus;
  fetchRecentOrders: ApiStatus;
  searchVenues: ApiStatus;
}

export default combineReducers({
  addToCart: makeDictionaryApiStatusReducerUsingApiAction(addOrderToCartApiStatusActions().types),
  addNewPaymentCard: makeApiStatusReducerUsingApiAction(addNewPaymentApiActions.types),
  submitOrder: makeApiStatusReducerUsingApiAction(submitCafeOrderApiStatusActions.types),
  cartOrderSummary: makeApiStatusReducerUsingApiAction(cafeCartOrderSummaryApiStatusActions.types),
  fetchCurrentOrders: makeApiStatusReducerUsingApiAction(fetchCurrentOrdersActionApiStatusActions.types),
  fetchRecentOrders: makeApiStatusReducerUsingApiAction(fetchRecentOrdersApiStatusActions.types),
  searchVenues: makeApiStatusReducerUsingApiAction(cafeSearchVenuesResultsApiStatusActions.types),
})
