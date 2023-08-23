import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { State } from 'src/redux/reducers'

import { fetchBrowseTopNavDetails, normalizeBrowseTopNavDetailsResponseData } from 'src/endpoints/atgGateway/browse'

export const SET_BROWSE_TOP_NAV_DETAILS = 'BROWSE__TOP_NAV_DETAILS_SETT'
const setBrowseTopNavDetails = makeActionCreator(SET_BROWSE_TOP_NAV_DETAILS)

export const getBrowseTopNavDetailsAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const response = await fetchBrowseTopNavDetails()
    if (response.ok) {
      const data = normalizeBrowseTopNavDetailsResponseData(response.data)
      dispatch(setBrowseTopNavDetails(data))
    }
  }
