import { Reducer } from 'redux'
import { ONBOARDING_MOVED_PAST_READ_BOOK_SELECTION,
  ONBOARDING_MOVED_PAST_REGISTER_LOGIN,
  SET_ROUTE_TO_REDIRECT_POST_LOGIN, CLEAR_POST_LOGIN_REDIRECT_ROUTE } from 'src/redux/actions/onboarding'
import { NavigationParams } from 'react-navigation'
import { REDUX_APP_START } from 'src/redux/actions/startup/appIsStarting'

interface RouteState{
  route: string
  params: NavigationParams
}
export interface OnboardingMovedPastStepsState {
  readBookSelection: boolean
  loginRegister: boolean
  routeState: Nullable<RouteState>
}

const DEFAULT: OnboardingMovedPastStepsState = {
  readBookSelection: false,
  loginRegister: false,
  routeState: null,
}

const OnboardingMovedPastStepsReducer: Reducer<OnboardingMovedPastStepsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case ONBOARDING_MOVED_PAST_READ_BOOK_SELECTION: return { ...state, readBookSelection: true }
    case ONBOARDING_MOVED_PAST_REGISTER_LOGIN: return { ...state, loginRegister: true }
    case SET_ROUTE_TO_REDIRECT_POST_LOGIN: return { ...state, routeState: action.payload }
    case CLEAR_POST_LOGIN_REDIRECT_ROUTE: return { ...state, routeState: null }
    case REDUX_APP_START: return { ...state, routeState: null } // Otherwise the guest user will be shown "Welcome" on app reload
    default: return state
  }
}

export default OnboardingMovedPastStepsReducer
