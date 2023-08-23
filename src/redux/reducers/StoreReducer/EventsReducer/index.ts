import { Reducer } from 'redux'

import { EventId, EventModel } from 'src/models/StoreModel'

import { SET_STORE_DETAILS } from 'src/redux/actions/store/storeDetails'
import { SET_STORES_STORE_EVENTS, SET_STORES_MORE_STORE_EVENTS } from 'src/redux/actions/store/events'

export type StoreEventsState = Record<EventId, EventModel>

const DEFAULT: StoreEventsState = {}

const storeEvents: Reducer<StoreEventsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_STORES_STORE_EVENTS:
    case SET_STORES_MORE_STORE_EVENTS:
    case SET_STORE_DETAILS: {
      const { events } = action.payload
      return {
        ...state,
        ...events,
      }
    }

    default:
      return state
  }
}

export default storeEvents
