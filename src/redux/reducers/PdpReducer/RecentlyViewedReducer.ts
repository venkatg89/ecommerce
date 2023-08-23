import { Reducer } from 'redux'

import { SET_RECENTLY_VIEWED } from 'src/redux/actions/pdp/recentlyViewed'

export type RecentlyViewedState = string[]

const DEFAULT: RecentlyViewedState = []

const recentlyViewed: Reducer<RecentlyViewedState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_RECENTLY_VIEWED: {
      const eans = action.payload
      return eans
    }

    default:
      return state
  }
}

export default recentlyViewed
