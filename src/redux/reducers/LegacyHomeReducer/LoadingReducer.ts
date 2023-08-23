import { Reducer } from 'redux'
import { SET_HOME_SOCIAL_LOADING_ACTION, SET_HOME_DISCOVERY_LOADING_ACTION } from 'src/redux/actions/legacyHome/loadingAction'
import { REDUX_APP_START } from 'src/redux/actions/startup/appIsStarting'

export interface LoadingState {
  discoveryLoading: boolean
  socialLoading: boolean
}

const DEFAULT = {
  discoveryLoading: false,
  socialLoading: false,
}

const loading: Reducer<LoadingState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_HOME_DISCOVERY_LOADING_ACTION:
      return { ...state, discoveryLoading: action.payload }
    case SET_HOME_SOCIAL_LOADING_ACTION:
      return { ...state, socialLoading: action.payload }
    case REDUX_APP_START:
      return DEFAULT
    default:
      return state
  }
}

export default loading
