import { Reducer } from 'redux'

import { SET_HOME_DETAILS } from 'src/redux/actions/home'
import { HomeDetailsModel } from 'src/models/HomeModel'

export type DetailsState = Nullable<HomeDetailsModel>

const DEFAULT: DetailsState= null

const details: Reducer<DetailsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_HOME_DETAILS: {
      const homeDetails = action.payload
      return homeDetails
    }

    default:
      return state
  }
}

export default details
