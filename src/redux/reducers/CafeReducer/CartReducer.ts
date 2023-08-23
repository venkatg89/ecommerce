import { Reducer } from 'redux'

import { CartSummary } from 'src/models/CafeModel/CartModel'

import {
  SET_CAFE_CART,
  CLEAR_CAFE_CART,
} from 'src/redux/actions/cafe/cartAction'

export type CartState = CartSummary

const DEFAULT: CartState = {
  items: [],
  promoCode: undefined,
}

const _cart: Reducer<CartState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CAFE_CART: {
      const { cart } = action.payload
      return cart
    }

    case CLEAR_CAFE_CART: {
      return DEFAULT
    }

    default:
      return state
  }
}

export default _cart
