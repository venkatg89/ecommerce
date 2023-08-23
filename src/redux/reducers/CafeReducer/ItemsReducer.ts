import { Reducer } from 'redux'

import { CafeItem } from 'src/models/CafeModel/ItemsModel'

import { SET_CAFE_ITEMS } from 'src/redux/actions/cafe/itemsAction'

export type ItemsState = Record<string, CafeItem>

const DEFAULT: ItemsState = {}

const _items: Reducer<ItemsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CAFE_ITEMS: {
      const { items } = action.payload

      return ({
        ...state,
        ...items,
      })
    }

    default:
      return state
  }
}

export default _items
