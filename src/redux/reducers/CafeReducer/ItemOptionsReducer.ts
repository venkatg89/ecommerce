import { Reducer } from 'redux'

import { CafeItemOption } from 'src/models/CafeModel/ItemsModel'

import { SET_CAFE_ITEM_OPTIONS } from 'src/redux/actions/cafe/itemOptionsAction'

export type ItemOptionsState = Record<string, CafeItemOption>

const DEFAULT: ItemOptionsState = {}

const _itemOptions: Reducer<ItemOptionsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CAFE_ITEM_OPTIONS: {
      const { itemOptions } = action.payload

      return ({
        ...state,
        ...itemOptions,
      })
    }

    default:
      return state
  }
}

export default _itemOptions
