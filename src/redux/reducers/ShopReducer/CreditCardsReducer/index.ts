import { Reducer } from 'redux'

import { CreditCardModel } from 'src/models/ShopModel/CreditCardModel'
import { GET_CREDIT_CARDS_LIST } from 'src/redux/actions/shop/creditCardsAction'
import { E_COMMERCE_ORDER_CLEAR } from 'src/redux/actions/shop/cartAction'

export type CreditCardsState = CreditCardModel[]

const DEFAULT: CreditCardsState = []

const CreditCards: Reducer<CreditCardsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case GET_CREDIT_CARDS_LIST: {
      return action.payload
    }

    case E_COMMERCE_ORDER_CLEAR: {
      return DEFAULT
    }

    default:
      return state
  }
}

export default CreditCards
