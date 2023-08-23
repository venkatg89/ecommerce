import { Reducer } from 'redux'
import { ONBOARDING_PUSH_PERMISSIONS_REQUESTED } from 'src/redux/actions/onboarding'

export interface OnboardingPushState {
  askedForPermission: boolean
}

const DEFAULT: OnboardingPushState = {
  askedForPermission: false,
}

const OnboardingPushStateReducer: Reducer<OnboardingPushState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case ONBOARDING_PUSH_PERMISSIONS_REQUESTED: return { ...state, askedForPermission: true }
    default: return DEFAULT
  }
}

export default OnboardingPushStateReducer
