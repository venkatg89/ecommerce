import { Reducer } from 'redux'

import { BrowseTopNavDetailsModel } from 'src/models/BrowseModel'

import { SET_BROWSE_TOP_NAV_DETAILS } from 'src/redux/actions/browse/categories'

export type TopNavDetailsState = BrowseTopNavDetailsModel[]

const DEFAULT: TopNavDetailsState = []

const topNavDetails: Reducer<TopNavDetailsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BROWSE_TOP_NAV_DETAILS: {
      const topNavDetails = action.payload
      return topNavDetails
    }

    default:
      return state
  }
}

export default topNavDetails
