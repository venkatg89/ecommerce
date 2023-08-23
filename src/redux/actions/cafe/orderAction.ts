import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'

import { getRecentOrders, getCurrentOrders, normalizeCurrentOrderResponseData, normalizeRecentOrderResponseData } from 'src/endpoints/speedetab/order'
import { RequestStatus } from 'src/models/ApiStatus'

import { fetchRecentOrdersApiRequestStatusSelector, fetchCurrentOrdersApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/cafe'


export const SET_CAFE_RECENT_ORDERS = 'CAFE__RECENT_ORDERS_SET'
const setCafeRecentOrders = makeActionCreator(SET_CAFE_RECENT_ORDERS)

export const SET_CAFE_CURRENT_ORDERS = 'CAFE__CURRENT_ORDERS_SET'
const setCafeCurrentOrders = makeActionCreator(SET_CAFE_CURRENT_ORDERS)

export const CLEAR_CAFE_CURRENT_ORDERS = 'CAFE__CURRENT_ORDERS_CLEAR'
export const clearCafeCurrentOrders = makeActionCreator(CLEAR_CAFE_CURRENT_ORDERS)

export const fetchRecentOrdersApiStatusActions = makeApiActions('fetchRecentOrders', 'CAFE__RECENT_ORDERS')
export const fetchCurrentOrdersActionApiStatusActions = makeApiActions('fetchCurrentOrdersAction', 'CAFE__CURRENT_ORDERS')

export const fetchRecentOrdersAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    if (fetchRecentOrdersApiRequestStatusSelector(getState()) === RequestStatus.FETCHING) { return }
    await dispatch(fetchRecentOrdersApiStatusActions.actions.inProgress)

    const response = await getRecentOrders({})
    if (response.ok) {
      const data = normalizeRecentOrderResponseData(response.data)
      await dispatch(setCafeRecentOrders(data))
    }

    await dispatch(fetchRecentOrdersApiStatusActions.actions.failed)
  }

export const fetchCurrentOrdersAction: () => ThunkedAction<State, boolean> =
  () => async (dispatch, getState) => {
    if (fetchCurrentOrdersApiRequestStatusSelector(getState()) === RequestStatus.FETCHING) { return true }
    await dispatch(fetchCurrentOrdersActionApiStatusActions.actions.inProgress)

    const response = await getCurrentOrders()
    if (response.ok) {
      const data = normalizeCurrentOrderResponseData(response.data)
      await dispatch(setCafeCurrentOrders(data))

      await dispatch(fetchCurrentOrdersActionApiStatusActions.actions.success)
      return !!data.recentOrders.length
    }

    await dispatch(fetchCurrentOrdersActionApiStatusActions.actions.failed)
    return false
  }
