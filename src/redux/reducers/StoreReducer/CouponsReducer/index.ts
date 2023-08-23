import { Reducer } from 'redux'

import { CouponModel } from 'src/models/StoreModel/CouponModel'

import { SET_STORES_COUPONS, SET_STORES_MORE_COUPONS } from 'src/redux/actions/store/coupons'

export type CouponsState = Record<string, CouponModel>

const DEFAULT: CouponsState = {}

const _coupons: Reducer<CouponsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_STORES_COUPONS:
    case SET_STORES_MORE_COUPONS: {
      const { coupons } = action.payload
      return {
        ...state,
        ...coupons,
      }
    }

    default:
      return state
  }
}

export default _coupons
