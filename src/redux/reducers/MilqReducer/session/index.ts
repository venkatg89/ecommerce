import { AnyAction } from 'redux'
import { SessionModel, SessionModelDefaults } from 'src/models/SessionModel'
// import { LoggedInPayload, USER_SESSION_ESTABLISHED, USER_MILQ_SESSION_LOST } from 'src/redux/actions/login/basicActionsPayloads'


export interface SessionState extends SessionModel {
  // Add any special variables for milq session here
}

const DEFAULT: SessionState = {
  ...SessionModelDefaults,
}

export default (state: SessionState = DEFAULT, action: AnyAction): SessionState => {
  switch (action.type) {
    // TODO: Remove
    // case USER_SESSION_ESTABLISHED: {
    //   const payload = action.payload as LoggedInPayload
    //   if (payload.milq) {
    //     return { active: true, hash: payload.hash, obtained: payload.obtailed,
    //     }
    //   }
    //   return state
    // }
    //
    // case USER_MILQ_SESSION_LOST: return DEFAULT

    default: return state
  }
}
