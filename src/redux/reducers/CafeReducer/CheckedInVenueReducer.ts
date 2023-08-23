import { Reducer } from 'redux'

import { CHECK_IN_CAFE_USER_VENUE, CHECK_OUT_CAFE_USER_VENUE } from 'src/redux/actions/cafe/checkInAction'

export type CheckedInVenueState = Nullable<string>

const DEFAULT: CheckedInVenueState = null // TODO make this changable default to null

const checkedInVenue: Reducer<CheckedInVenueState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case CHECK_IN_CAFE_USER_VENUE: {
      const { venueId } = action.payload
      return venueId
    }

    case CHECK_OUT_CAFE_USER_VENUE: {
      return DEFAULT
    }

    default:
      return state
  }
}

export default checkedInVenue
