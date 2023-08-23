import { Reducer } from 'redux'

import { VENUE_COUNT_PER_SEARCH } from 'src/endpoints/speedetab/venues'
import { Listing } from 'src/models/ListingModel'
import {
  SET_CAFE_SEARCH_VENUE_RESULTS, SET_CAFE_SEARCH_VENUE_MORE_RESULTS,
} from 'src/redux/actions/cafe/venuesAction'

export type VenuesState = Listing

const DEFAULT: VenuesState = {
  ids: [],
  skip: 0,
  canLoadMore: false, // first load prevent load more
}

const venues: Reducer<VenuesState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CAFE_SEARCH_VENUE_RESULTS: {
      const { venueIds } = action.payload

      return {
        ids: venueIds,
        skip: venueIds.length,
        canLoadMore: (venueIds.length >= VENUE_COUNT_PER_SEARCH),
      }
    }

    case SET_CAFE_SEARCH_VENUE_MORE_RESULTS: {
      const { venueIds } = action.payload

      return {
        ids: [...(new Set([...state.ids, ...venueIds]))], // remove duplicates
        skip: (state.skip + venueIds.length),
        canLoadMore: (venueIds.length >= VENUE_COUNT_PER_SEARCH),
      }
    }

    default:
      return state
  }
}

export default venues
