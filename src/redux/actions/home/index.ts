import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { State } from 'src/redux/reducers'

import { fetchHomeDetails, normalizeHomeDetailsResponseData } from 'src/endpoints/atgGateway/home'
import { HomeDetailsModel } from 'src/models/HomeModel'

export const SET_HOME_DETAILS = 'BROWSE__HOME_DETAILS_SET'
const setHomeDetails = makeActionCreator<HomeDetailsModel>(SET_HOME_DETAILS)

export const getHomeDetailsAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const response = await fetchHomeDetails()
    // if (response.ok) {
    const data = normalizeHomeDetailsResponseData(response.data)
    dispatch(setHomeDetails(data))
    // }
  }
