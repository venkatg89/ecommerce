import { Reducer } from 'redux'

import {
  SET_PREFERED_PAYMENT_CARD, ADD_NEW_PAYMENT_CARD,
} from 'src/redux/actions/cafe/paymentsAction'

export type SelectedPaymentCardIdState = Nullable<string>

const DEFAULT: SelectedPaymentCardIdState = null

/*
 * The payment service doesn't keep track of a "favourite" card, so we need to keep track of the user
 */
const selectedPaymentCardId: Reducer<SelectedPaymentCardIdState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_PREFERED_PAYMENT_CARD:
    case ADD_NEW_PAYMENT_CARD: {
      return action.payload.cardId
    }

    // case REMOVE_PAYMENT_CARD: {
    //   const { cardId } = action.payload
    //   return cardId === state
    //     ? DEFAULT
    //     : state
    // }

    default:
      return state
  }
}

export default selectedPaymentCardId
