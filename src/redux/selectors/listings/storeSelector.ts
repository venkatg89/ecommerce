import { State } from 'src/redux/reducers'

import {
  eventsSelector,
  filterStoresByIdsSelector,
} from 'src/redux/selectors/myBn/storeSelector'

export const storeSearchResultsSelector = (stateAny) => {
  const state = stateAny as State
  const storeIds = state.listings.store.storeSearch
  return filterStoresByIdsSelector(state, { storeIds })
}

export const eventsByStoreIdSelector = (stateAny, props) => {
  const state = stateAny as State
  const { storeId } = props
  const eventIds =
    (state.listings.store.storeEvents[storeId] &&
      state.listings.store.storeEvents[storeId].ids) ||
    []
  const events = eventsSelector(state)
  return eventIds.map((id) => events[id]).filter((e) => !!e)
}

export const couponListingSelector = (stateAny) => {
  const state = stateAny as State
  return state.listings.store.coupons.ids
}
