import { Reducer } from 'redux'

import { SET_STORES_STORE_EVENTS, SET_STORES_MORE_STORE_EVENTS } from 'src/redux/actions/store/events'
import { Listing } from 'src/models/ListingModel'
import { NUMBER_EVENTS_REQUESTED } from 'src/endpoints/storeGateway/events'

export type StoreEventsState = Record<string, Listing>

const DEFAULT = {} as StoreEventsState

const storeEvents: Reducer<StoreEventsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_STORES_STORE_EVENTS: {
      const { storeId, eventIds } = action.payload
      return {
        ...state,
        [storeId]: {
          ids: eventIds,
          skip: eventIds.length,
          canLoadMore: eventIds.length === NUMBER_EVENTS_REQUESTED,
        },
      }
    }

    case SET_STORES_MORE_STORE_EVENTS: {
      const { storeId, eventIds } = action.payload
      return {
        ...state,
        [storeId]: {
          ids: [...(new Set([...state[storeId].ids, ...eventIds]))],
          skip: state[storeId].skip + eventIds.length,
          canLoadMore: eventIds.length === NUMBER_EVENTS_REQUESTED,
        },
      }
    }

    default:
      return state
  }
}

export default storeEvents
