import { Reducer } from 'redux'

import { CafeCurrentOrder } from 'src/models/CafeModel/OrderModel'

import { SET_CAFE_CURRENT_ORDERS, CLEAR_CAFE_CURRENT_ORDERS } from 'src/redux/actions/cafe/orderAction'

export type CurrentOrdersState = CafeCurrentOrder[]

const DEFAULT: CurrentOrdersState = []

const _currentOrders: Reducer<CurrentOrdersState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CAFE_CURRENT_ORDERS: {
      const { recentOrders } = action.payload
      return recentOrders
    }

    case CLEAR_CAFE_CURRENT_ORDERS: {
      return DEFAULT
    }

    default:
      return state
  }
}

export default _currentOrders
