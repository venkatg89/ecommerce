import { Reducer } from 'redux'

import { ADD_NEW_PAYMENT_CARD, SET_PAYMENT_CARDS, DELETE_PAYMENT_CARD } from 'src/redux/actions/cafe/paymentsAction'

import { PaymentCard } from 'src/models/PaymentModel'

export type CardsState = Record<string, PaymentCard>

const DEFAULT: CardsState = {}

const paymentCards: Reducer<CardsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case ADD_NEW_PAYMENT_CARD: {
      const { cardId, card } = action.payload
      return ({
        ...state,
        [cardId]: card,
      })
    }

    case SET_PAYMENT_CARDS: {
      return action.payload.cards
    }

    case DELETE_PAYMENT_CARD: {
      const { cardId } = action.payload
      const cards = { ...state }
      delete cards[cardId]
      return cards
    }

    default:
      return state
  }
}

export default paymentCards
