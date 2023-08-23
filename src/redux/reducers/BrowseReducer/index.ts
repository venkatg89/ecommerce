import { combineReducers } from 'redux'

import topNavDetails, { TopNavDetailsState } from './TopNavDetailsReducer'

export interface BrowseState {
  topNavDetails: TopNavDetailsState
}

export default combineReducers<BrowseState>({
  topNavDetails,
})
