import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { getBrowseDetails } from 'src/endpoints/atgGateway/pdp/browseDetails'
import { normalizeBrowseDetailsToModelArray } from 'src/endpoints/atgGateway/pdp/browseDetails'

import { makeApiActions } from 'src/helpers/redux/makeApiActions'

export const SET_BROWSE_DETAILS = 'SET_BROWSE_DETAILS'
export const setBrowseDetails = makeActionCreator(SET_BROWSE_DETAILS)
export const browseDetailsApiActions = makeApiActions(
  'fetchBrowseDetails',
  'SET_BROWSE_DETAILS',
)

export const getBrowseDetailsAction: (url: string) => ThunkedAction<State> = (
  url,
) => async (dispatch) => {
  await dispatch(browseDetailsApiActions.actions.inProgress)
  const response = await getBrowseDetails(url)

  if (response.ok) {
    if (response.data.response.browseDetails) {
      const browseDetails = normalizeBrowseDetailsToModelArray(
        response.data.response.browseDetails,
      )
      dispatch(setBrowseDetails(browseDetails))
      await dispatch(browseDetailsApiActions.actions.success)
    } else {
      await dispatch(browseDetailsApiActions.actions.failed)
    }
  }
  await dispatch(browseDetailsApiActions.actions.failed)
}
