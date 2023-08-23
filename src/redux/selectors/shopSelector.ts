import { State } from 'src/redux/reducers'

export const shopCartSelector = (state: State) => {
  return state.shop.cart
}

export const cartGiftApiStatusSelector = (stateAny) => {
  const state = stateAny as State
  const apiCall = state.storeGateway.api.cartGift
  return apiCall ? apiCall.requestStatus : null
}

export const shopDeliveryOptionsSelector = (state: State) => {
  return state.shop.deliveryOptions
}

export const creditCardsSelector = (state: State) => {
  return state.shop.creditCards
}

export const enteredShippingAddressSelector = (state: State) => {
  return state.shop.cart.enteredShippingAddress
}

export const suggestedShippingAddressListSelector = (state: State) => {
  return state.shop.cart.suggestedShippingAddressList
}

export const addressDetailsSelector = (state: State) => {
  return state.shop.addressList
}

export const editShippingAddressSelector = (state: State) => {
  return state.shop.cart.editShippingAddress
}

export const verifyListFetchingSelector = (state: State) => {
  return state.shop.cart.verifyListFetching
}

export const getAddressErrorSelector = (state: State) => {
  return state.shop.cart.getAddressError
}

export const getVerifyAddressErrorSelector = (state: State) => {
  return state.shop.cart.verifyAddressError
}

export const cartOrderSummarySelector = (state: State) => {
  return state.shop.orderSummary
}
