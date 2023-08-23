import { combineReducers } from 'redux'

import cards, { CardsState } from './CardsReducer'
import tempPaymentCard, { TempCardState } from './CardsReducer/TempCardReducer'

export interface PaymentState {
  cards: CardsState
  tempPaymentCard: TempCardState
}

export default combineReducers<PaymentState>({
  cards,
  tempPaymentCard,
})
