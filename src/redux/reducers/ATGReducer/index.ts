import { combineReducers } from 'redux'
import api, { ApiState } from './api'
import session, { AtgSessionState } from './session'

export interface ATGState {
  api: ApiState
  session: AtgSessionState
}

export default combineReducers<ATGState>({
  api,
  session,
})
