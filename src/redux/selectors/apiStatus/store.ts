import moment from 'moment'
import { State } from 'src/redux/reducers'

export const storeEventsApiRequestStatusSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const { storeId } = ownProps
  const apiCall = state.storeGateway.api.events[storeId]

  return apiCall
    ? apiCall.requestStatus
    : null
}

export const shouldRefreshStoreSearchSelector = (stateAny) => {
  const state = stateAny as State
  const storeListing = state.listings.store.storeSearch
  if (storeListing.length === 0) {return true}
  const lastCompleted = state.bopis.api.searchStores.dateCompleted
  if (!lastCompleted) {return false}
  return moment(lastCompleted).toDate().getTime() < moment().subtract(30, 'minutes').toDate().getTime()
}

export const storeSearchSuggestionsRequestStatusSelector = (stateAny) => {
  const state = stateAny as State
  return state.bopis.api.searchStoreSuggestions.requestStatus
}

export const couponsApiRequestStatusSelector = (stateAny) => {
  const state = stateAny as State
  return state.storeGateway.api.coupons.requestStatus
}
