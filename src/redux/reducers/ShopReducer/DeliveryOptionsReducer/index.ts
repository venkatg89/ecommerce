import { Reducer } from 'redux'

import { ShopDeliveryOptionsModel } from 'src/models/ShopModel/DeliveryOptionsModel'
import { GET_CART_DELIVERY_OPTIONS } from 'src/redux/actions/shop/deliveryAction'
import { E_COMMERCE_ORDER_CLEAR } from 'src/redux/actions/shop/cartAction'

export type ShopDeliveryOptionsState = ShopDeliveryOptionsModel

const DEFAULT: ShopDeliveryOptionsState = {}

const ShopDeliveryOptions: Reducer<ShopDeliveryOptionsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case GET_CART_DELIVERY_OPTIONS: {
      return action.payload
    }

    case E_COMMERCE_ORDER_CLEAR: {
      return DEFAULT
    }

    default:
      return state
  }
}

export default ShopDeliveryOptions
