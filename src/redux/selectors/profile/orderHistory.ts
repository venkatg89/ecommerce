import { State } from 'src/redux/reducers'

export const orderHistorySelector = (stateAny: any) => {
  const state = stateAny as State
  return state.accountOrders.orderHistory
}

export const orderDetailsSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.accountOrders.orderDetails
}

export const orderHistoryApiStatus = (stateAny: any) => {
  const state = stateAny as State
  return state.atg.api.orderHistory.requestStatus
}
