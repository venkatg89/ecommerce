import { Reducer } from 'redux'

import { SET_STORES_COUPONS, SET_STORES_MORE_COUPONS } from 'src/redux/actions/store/coupons'
import { Listing } from 'src/models/ListingModel'
import { NUMBER_EVENTS_REQUESTED } from 'src/endpoints/storeGateway/coupons'

export type CouponsState = Listing

const DEFAULT: Listing = {
  ids: [],
  skip: 0,
  canLoadMore: false,
}

const coupons: Reducer<CouponsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_STORES_COUPONS: {
      const { couponIds } = action.payload
      return {
        ids: couponIds,
        skip: couponIds.length,
        canLoadMore: couponIds.length === NUMBER_EVENTS_REQUESTED,
      }
    }

    case SET_STORES_MORE_COUPONS: {
      const { couponIds } = action.payload
      return {
        ids: [...(new Set([...state.ids, ...couponIds]))],
        skip: state.skip + couponIds.length,
        canLoadMore: couponIds.length === NUMBER_EVENTS_REQUESTED,
      }
    }

    default:
      return state
  }
}

export default coupons
