import { Reducer } from 'redux'

import { ShopOrderSummaryModel } from 'src/models/ShopModel/CheckoutModel'
import { GET_CART_ORDER_SUMMARY, E_COMMERCE_ORDER_CLEAR } from 'src/redux/actions/shop/cartAction'

export type ShopOrderSummaryState = Nullable<ShopOrderSummaryModel>

const DEFAULT: ShopOrderSummaryState = null

const ShopOrderSummary: Reducer<ShopOrderSummaryState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case GET_CART_ORDER_SUMMARY: {
      return action.payload
    }

    case E_COMMERCE_ORDER_CLEAR: {
      return DEFAULT
    }

    default:
      return state
  }
}

export default ShopOrderSummary
