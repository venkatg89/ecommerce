import { combineReducers } from 'redux'

import api, { ApiState } from './api'
import session, { SessionState } from './session'

export interface MilqState {
  api: ApiState
  session: SessionState
}

export default combineReducers({
  api,
  session,
})
