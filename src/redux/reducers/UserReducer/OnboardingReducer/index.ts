import { combineReducers } from 'redux'
import bookLists, { OnboardingBookLists } from './OnboardingBookLists'
import steps, { OnboardingMovedPastStepsState } from './Steps'
import push, { OnboardingPushState } from './Push'

export interface OnboardingState {
  bookLists: OnboardingBookLists
  steps: OnboardingMovedPastStepsState
  push: OnboardingPushState
}

// For community interests selected during onboarding see
// 'src/redux/reducers/UserReducer/FavoritesReducer'
// This data lives in the same place for a logged-in user as well.

export default combineReducers<OnboardingState>({
  bookLists,
  steps,
  push,
})
