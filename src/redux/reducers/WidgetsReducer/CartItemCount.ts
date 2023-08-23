import { Reducer } from 'redux'

import { SET_CART_ITEM_COUNT } from 'src/redux/actions/shop/cartAction'

export type CartItemCountState = number

const DEFAULT: CartItemCountState = 0

const cartItemCount: Reducer<CartItemCountState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CART_ITEM_COUNT: {
      const count = action.payload
      return count
    }

    default:
      return state
  }
}

export default cartItemCount
