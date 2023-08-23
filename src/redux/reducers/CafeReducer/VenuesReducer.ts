import { Reducer } from 'redux'

import { CafeVenue } from 'src/models/CafeModel/VenueModel'

import {
  SET_CAFE_VENUE, SET_CAFE_SEARCH_VENUE_RESULTS, SET_CAFE_SEARCH_VENUE_MORE_RESULTS,
} from 'src/redux/actions/cafe/venuesAction'
import { SET_CAFE_CURRENT_ORDERS, SET_CAFE_RECENT_ORDERS } from 'src/redux/actions/cafe/orderAction'

export type VenuesState = Record<string, CafeVenue>

const DEFAULT: VenuesState = {}

const _venues: Reducer<VenuesState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CAFE_VENUE: {
      const { venue } = action.payload

      return ({
        ...state,
        [venue.id]: venue,
      })
    }

    case SET_CAFE_CURRENT_ORDERS:
    case SET_CAFE_RECENT_ORDERS:
    case SET_CAFE_SEARCH_VENUE_RESULTS:
    case SET_CAFE_SEARCH_VENUE_MORE_RESULTS: {
      const { venues } = action.payload

      return ({
        ...state,
        ...venues,
      })
    }

    default:
      return state
  }
}

export default _venues
