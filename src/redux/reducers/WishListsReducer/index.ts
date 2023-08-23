import { Reducer } from 'redux'

import { SET_WISH_LISTS, REMOVE_EAN_FROM_WISHLIST } from 'src/redux/actions/wishList/wishListAction'
import { WishListModel } from 'src/models/WishListModel'

export type WishListsState = Record<string, WishListModel>

const DEFAULT: WishListsState = {}

const wishLists: Reducer<WishListsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_WISH_LISTS: {
      return action.payload
    }

    case REMOVE_EAN_FROM_WISHLIST: {
      const { id, ean } = action.payload
      const wishList = state[id]
      const items = wishList.items
      const newItems = items.filter(item => item.ean !== ean)

      return ({
        ...state,
        [id]: {
          ...wishList,
          items: newItems,
        }
      })
    }

    default:
      return state
  }
}

export default wishLists
