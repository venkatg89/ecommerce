import { combineReducers } from 'redux'

import account, { AtgAccountState } from './AccountReducer'
import community, { CommunityState } from './CommunityReducer'
import nodeProfile, { NodeProfileState } from './NodeProfileReducer'
import onboarding, { OnboardingState } from './OnboardingReducer'
import profile, { MilqProfileState } from './ProfileReducer'
import tips, { TipsState } from './TipsReducer'
import sessions, { SessionsState } from './SessionsReducer'
import appReview, { AppReviewState } from './AppReviewReducer'
import notifications, { NotificationsState } from './NotificationsReducer'
import encodedUserId from './EncodedUserIdReducer'

export interface UserState {
  account: AtgAccountState;
  community: CommunityState;
  profile: MilqProfileState;
  onboarding: OnboardingState
  nodeProfile: NodeProfileState
  tips: TipsState
  sessions: SessionsState
  appReview: AppReviewState
  encodedUserId?: string
  notifications: NotificationsState
}

export default combineReducers<UserState>({
  account,
  community,
  nodeProfile,
  onboarding,
  profile,
  tips,
  sessions,
  appReview,
  encodedUserId,
  notifications,
})
