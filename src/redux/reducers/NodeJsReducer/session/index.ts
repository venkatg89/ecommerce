import { AnyAction } from 'redux'
import { SessionModel, SessionModelDefaults } from 'src/models/SessionModel'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

// For Testing Only
import { NodeJsSession } from 'src/apis/session/sessions'

export interface SessionState extends SessionModel {
 // Add any special variables for NodeJs session here
}

const DEFAULT: SessionState = {
  ...SessionModelDefaults,
}

// For Testing Only
const TEST_NODEJS_LOOSE_SESSION = 'TEST_NODEJS_LOOSE_SESSION'

export default (state: SessionState = DEFAULT, action: AnyAction): SessionState => {
  switch (action.type) {
    case USER_SESSION_ESTABLISHED: {
      const payload = action.payload as LoggedInPayload
      if (payload.nodeJs) {
        return { active: true, hash: payload.hash, obtained: payload.obtailed }
      }
      return state
    }

    // For Testing only
    case TEST_NODEJS_LOOSE_SESSION: {
      // a side-effect, thus poor redux design - for Testing only, however.
      NodeJsSession.set('test_i_am_not_a_valid_nodejs_session')
      return state
    }

    default: return state
  }
}
