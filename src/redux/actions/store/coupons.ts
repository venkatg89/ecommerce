import { State } from 'src/redux/reducers'

import { RequestStatus } from 'src/models/ApiStatus'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { storeGetCoupons, normalizeCouponsFromResponseData } from 'src/endpoints/storeGateway/coupons'

import { couponsApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/store'
import { getCustomerKeySelector, isUserLoggedInSelector } from 'src/redux/selectors/userSelector'

export const SET_STORES_COUPONS = 'STORES__COUPONS_SET'
const setCoupons = makeActionCreator(SET_STORES_COUPONS)
export const SET_STORES_MORE_COUPONS = 'STORES__MORE_COUPONS_SET'
const setMoreCoupons = makeActionCreator(SET_STORES_MORE_COUPONS)

export const couponsApiStatusActions = makeApiActions('storeCoupons', 'COUPONS')

export const fetchCouponsAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const state: State = getState()
    if (!isUserLoggedInSelector(state)) {return}
    const status = couponsApiRequestStatusSelector(state)
    if (status === RequestStatus.FETCHING) { return }

    await dispatch(couponsApiStatusActions.actions.inProgress)

    const customerKey = getCustomerKeySelector(state)

    const response = await storeGetCoupons({ customerKey })
    if (response.ok) {
      const payload = normalizeCouponsFromResponseData(response.data)
      await dispatch(setCoupons(payload))
    }

    await dispatch(couponsApiStatusActions.actions.success)
  }

export const fetchMoreCouponsAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const state: State = getState()
    if (!isUserLoggedInSelector(state)) {return}
    const status = couponsApiRequestStatusSelector(state)
    const { skip, canLoadMore } = state.listings.store.coupons
    if (!canLoadMore || status === RequestStatus.FETCHING) { return }

    await dispatch(couponsApiStatusActions.actions.inProgress)

    const customerKey = getCustomerKeySelector(state)
    const params = {
      customerKey,
      skip,
    }

    const response = await storeGetCoupons(params)
    if (response.ok) {
      const payload = normalizeCouponsFromResponseData(response.data)
      await dispatch(setMoreCoupons(payload))
    }

    await dispatch(couponsApiStatusActions.actions.success)
  }
