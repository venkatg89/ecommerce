import { combineReducers } from 'redux'

import api, { ApiState } from './ApiReducer'
import session, { SpeedETabSessionState } from './SessionReducer'

export interface SpeedeTabState {
  api: ApiState;
  session: SpeedETabSessionState;
}

export default combineReducers({
  api,
  session,
})
