import { Reducer } from 'redux'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import { SET_ADDRESS_DETAILS, E_COMMERCE_ORDER_CLEAR } from 'src/redux/actions/shop/cartAction'

const DEFAULT: ShippingAddress[] = []

const ShopAddress: Reducer<ShippingAddress[]> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_ADDRESS_DETAILS: {
      return [...action.payload]
    }

    case E_COMMERCE_ORDER_CLEAR: {
      return DEFAULT
    }
  }
  return state
}

export default ShopAddress
