import { Reducer } from 'redux'

import { SET_CAFE_ITEMS } from 'src/redux/actions/cafe/itemsAction'

// categoryId => items
export type ItemsState = Record<string, string[]>

const DEFAULT: ItemsState = {}

const items: Reducer<ItemsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CAFE_ITEMS: {
      const { categoryId, itemIds } = action.payload

      return ({
        ...state,
        [categoryId]: itemIds,
      })
    }

    default:
      return state
  }
}

export default items
