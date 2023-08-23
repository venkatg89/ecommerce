import { Reducer } from 'redux'

import {
  ADD_TEMP_PAYMENT_CARD,
  DELETE_TEMP_PAYMENT_CARD,
} from 'src/redux/actions/cafe/paymentsAction'

import { PaymentCard } from 'src/models/PaymentModel'

export type TempCardState = Record<string, PaymentCard>

const DEFAULT: TempCardState = {}

const tempPaymentCard: Reducer<TempCardState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case ADD_TEMP_PAYMENT_CARD: {
      const { cardId, card } = action.payload
      return {
        ...state,
        [cardId]: card,
      }
    }
    case DELETE_TEMP_PAYMENT_CARD: {
      return {}
    }
    default:
      return state
  }
}

export default tempPaymentCard
