import { State } from 'src/redux/reducers'

export const myNotificationsApiStatusSelector = (stateAny) => {
  const state = stateAny as State
  const apiCall = state.milq.api.myNotifications
  return apiCall
    ? apiCall.requestStatus
    : null
}

export const historyNotificationsSelector = (stateAny) => {
  const state = stateAny as State
  const apiCall = state.nodeJs.api.historyNotifications
  return apiCall
    ? apiCall.requestStatus
    : null
}
