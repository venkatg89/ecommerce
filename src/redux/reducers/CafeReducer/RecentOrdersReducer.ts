import { Reducer } from 'redux'

import { CafeRecentOrder } from 'src/models/CafeModel/OrderModel'

import { SET_CAFE_RECENT_ORDERS } from 'src/redux/actions/cafe/orderAction'

export type RecentOrdersState = Record<string, CafeRecentOrder>

const DEFAULT: RecentOrdersState = {}

const _recentOrders: Reducer<RecentOrdersState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CAFE_RECENT_ORDERS: {
      const { orders } = action.payload

      return orders
    }

    default:
      return state
  }
}

export default _recentOrders
