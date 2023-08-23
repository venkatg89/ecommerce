import { State } from 'src/redux/reducers'

import { RequestStatus } from 'src/models/ApiStatus'

// api status
export const searchResultsApiStatusSelector = (state, ownProps): Nullable<RequestStatus> => {
  const { searchType } = ownProps
  const apiCall = state.milq.api.search[searchType]
  return apiCall
    ? apiCall.requestStatus
    : null
}

export const isBookSearchBusySelector = (stateAny, props) => {
  const state = stateAny as State
  const searchRequestStatus = searchResultsApiStatusSelector(state, props)
  return searchRequestStatus === RequestStatus.FETCHING
}

export const searchApiStatusSelector = state => state.milq.api.search
