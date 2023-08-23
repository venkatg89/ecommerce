import { Reducer } from 'redux'

import {
  SET_ORDER_HISTORY,
  SET_ORDER_DETAILS,
} from 'src/redux/actions/user/orderHistory'
import {
  OrderHistoryModel,
  OrderDetailsModel,
} from 'src/models/UserModel/AtgAccountModel'

export interface OrderModel {
  orderHistory: OrderHistoryModel[]
  orderDetails: Record<string, OrderDetailsModel> | {}
}

export type OrderHistoryState = OrderModel

const DEFAULT = {
  orderHistory: [],
  orderDetails: [],
}

const accountOrders: Reducer<OrderHistoryState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_ORDER_HISTORY: {
      return {
        ...state,
        orderHistory: action.payload,
      }
    }
    case SET_ORDER_DETAILS: {
      return {
        ...state,
        orderDetails: { ...state.orderDetails, ...action.payload },
      }
    }

    default:
      return state
  }
}

export default accountOrders
