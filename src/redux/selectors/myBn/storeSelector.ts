import { State } from 'src/redux/reducers'

import { StoreId, StoreModel } from 'src/models/StoreModel'

export const storesSelector = (stateAny) => {
  const state = stateAny as State
  return state.stores.storeDetails
}
export const eventsSelector = (stateAny) => {
  const state = stateAny as State
  return state.stores.events
}

export const filterStoresByIdsSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const storeIds = ownProps.storeIds as StoreId[]
  const stores = storesSelector(state)
  return storeIds.map((id) => stores[id])
}

export const storeSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const { storeId } = ownProps
  const stores = storesSelector(state)
  return stores[storeId]
}

export const favoriteStoreIdSelector = (stateAny): string => {
  const state = stateAny as State
  return state.user.account && state.user.account.favoriteStoreId || ''
}

export const favoriteStoreSelector = (stateAny): StoreModel | undefined => {
  const state = stateAny as State
  const storeId = favoriteStoreIdSelector(state)
  const stores = storesSelector(state)
  return (storeId && stores[storeId]) || undefined
}

export const storeEventsSelector = (stateAny) => {
  const state = stateAny as State
  return state.stores.events
}

export const storeDetailsApiStatusSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const { storeId } = ownProps
  const apiCall = state.storeGateway.api.storeDetails[storeId]
  return apiCall ? apiCall.requestStatus : null
}

export const getEventByIdSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const { eventId } = ownProps
  const events = storeEventsSelector(state)
  return events[eventId]
}

export const getStoreByEventIdSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const { eventId } = ownProps
  const event = getEventByIdSelector(state, { eventId })
  const { storeId } = event
  return storeSelector(state, { storeId })
}
