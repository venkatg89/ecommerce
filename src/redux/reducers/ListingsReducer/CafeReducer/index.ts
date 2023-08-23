import { combineReducers } from 'redux'

import categories, { CategoriesState } from './CategoriesReducer'
import items, { ItemsState } from './ItemsReducer'
import itemOptions, { ItemOptionsState } from './ItemOptionsReducer'
import venues, { VenuesState } from './VenuesReducer'

export interface CafeState {
  categories: CategoriesState;
  items: ItemsState;
  itemOptions: ItemOptionsState;
  venues: VenuesState;
}

export default combineReducers<CafeState>({
  categories,
  items,
  itemOptions,
  venues,
})
