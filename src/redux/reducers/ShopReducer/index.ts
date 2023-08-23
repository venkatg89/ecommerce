import { combineReducers } from 'redux'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'

import cart, { ShopCartState } from './CartReducer'
import deliveryOptions, {
  ShopDeliveryOptionsState,
} from './DeliveryOptionsReducer'
import orderSummary, { ShopOrderSummaryState } from './OrderSummaryReducer'
import addressList from './AddressReducer'
import creditCards, { CreditCardsState } from './CreditCardsReducer'

export interface ShopState {
  cart: ShopCartState
  deliveryOptions: ShopDeliveryOptionsState
  orderSummary: ShopOrderSummaryState
  addressList: ShippingAddress[]
  creditCards: CreditCardsState
}

export default combineReducers<ShopState>({
  cart,
  deliveryOptions,
  orderSummary,
  addressList,
  creditCards,
})
