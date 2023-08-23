import { combineReducers } from 'redux'
import loading, { LoadingState } from './LoadingReducer'
import discovery, { DiscoveryState } from './DiscoveryReducer'
import social, { SocialState } from './SocialReducer'

export interface HomeState {
  loading: LoadingState
  discovery: DiscoveryState
  social: SocialState
}

export default combineReducers<HomeState>({
  loading,
  discovery,
  social,
})
