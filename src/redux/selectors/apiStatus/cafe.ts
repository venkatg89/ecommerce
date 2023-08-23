import { State } from 'src/redux/reducers'

export const addToCartApiStatusesSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.speedetab.api.addToCart
}

export const submitOrderApiRequestStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.speedetab.api.submitOrder.requestStatus
}

export const addNewPaymentCardApiRequestStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.speedetab.api.addNewPaymentCard.requestStatus
}

export const cartOrderSummaryApiRequestStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.speedetab.api.cartOrderSummary.requestStatus
}

export const fetchRecentOrdersApiRequestStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.speedetab.api.fetchCurrentOrders.requestStatus
}

export const fetchCurrentOrdersApiRequestStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.speedetab.api.fetchCurrentOrders.requestStatus
}

export const searchVenuesApiRequestStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.speedetab.api.searchVenues.requestStatus
}

export const cafeSearchSuggestionsRequestStatusSelector = (stateAny) => {
  const state = stateAny as State
  return state.bopis.api.searchCafeSuggestions.requestStatus
}
