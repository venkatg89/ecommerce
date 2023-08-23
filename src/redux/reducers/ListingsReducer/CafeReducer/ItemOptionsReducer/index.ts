import { Reducer } from 'redux'

import { SET_CAFE_ITEM_OPTIONS } from 'src/redux/actions/cafe/itemOptionsAction'

export type ItemOptionsState = Record<string, string[]>

const DEFAULT: ItemOptionsState = {}

const itemOptions: Reducer<ItemOptionsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CAFE_ITEM_OPTIONS: {
      const { addonGroupId, itemOptionIds } = action.payload

      return {
        ...state,
        [addonGroupId]: itemOptionIds,
      }
    }

    default:
      return state
  }
}

export default itemOptions
