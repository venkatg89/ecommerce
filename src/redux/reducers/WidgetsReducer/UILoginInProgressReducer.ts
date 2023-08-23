import { Reducer } from 'redux'

import { USER_UI_LOGIN_IN_PROGRESS, USER_UI_LOGIN_ENDED } from 'src/redux/actions/login/basicActionsPayloads'
import { REDUX_APP_START } from 'src/redux/actions/startup/appIsStarting'

export type UILoginInProgressState = boolean

const DEFAULT: UILoginInProgressState = false

const uiLoginInProgressState: Reducer<UILoginInProgressState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case USER_UI_LOGIN_IN_PROGRESS: return true
    case USER_UI_LOGIN_ENDED: return false
    case REDUX_APP_START: return DEFAULT
    default: return state
  }
}

export default uiLoginInProgressState
