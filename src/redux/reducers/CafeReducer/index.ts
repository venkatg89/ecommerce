import { combineReducers } from 'redux'

import cart, { CartState } from './CartReducer'
import currentOrders, { CurrentOrdersState } from './CurrentOrdersReducer'
import checkedInVenue, { CheckedInVenueState } from './CheckedInVenueReducer'
import categories, { CategoriesState } from './CategoriesReducer'
import items, { ItemsState } from './ItemsReducer'
import itemOptions, { ItemOptionsState } from './ItemOptionsReducer'
import payment, { PaymentState } from './PaymentReducer'
import recentOrders, { RecentOrdersState } from './RecentOrdersReducer'
import venues, { VenuesState } from './VenuesReducer'

export interface CafeState {
  cart: CartState;
  currentOrders: CurrentOrdersState
  checkedInVenue: CheckedInVenueState;
  categories: CategoriesState;
  items: ItemsState;
  itemOptions: ItemOptionsState;
  payment: PaymentState;
  recentOrders: RecentOrdersState
  venues: VenuesState;
}

export default combineReducers<CafeState>({
  cart,
  currentOrders,
  checkedInVenue,
  categories,
  items,
  itemOptions,
  payment,
  recentOrders,
  venues,
})
