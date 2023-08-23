import { Reducer } from 'redux'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'
import { SessionModel, SessionModelDefaults } from 'src/models/SessionModel'

export interface SpeedETabSessionState extends SessionModel {
}

const DEFAULT = {
  ...SessionModelDefaults,
}

const speedETabSession: Reducer<SpeedETabSessionState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case USER_SESSION_ESTABLISHED: {
      const payload = action.payload as LoggedInPayload
      if (payload) {
        return {
          active: true,
          hash: payload.hash,
          obtained: payload.obtailed,
        }
      }
      return state
    }

    default:
      return state
  }
}

export default speedETabSession
