import { Reducer } from 'redux'
import { SessionModel, SessionModelDefaults } from 'src/models/SessionModel'
import {
  GUEST_USER_SESSION_ESTABLISHED, USER_SESSION_ESTABLISHED,
  LoggedInPayload, GuestLoggedInPayload,
} from 'src/redux/actions/login/basicActionsPayloads'
import { USER_LOGGED_OUT } from 'src/redux/actions/login/logoutAction'
import { ATG_USER_DEACTIVATE_SESSION } from 'src/redux/actions/user/sessionsAction'

// For Testing Only
import { AtgUserSession } from 'src/apis/session/sessions'

export interface AtgSessionState extends SessionModel {
  loggedIn: boolean
  pId: string
}

const DEFAULT = {
  loggedIn: false,
  pId: '',
  ...SessionModelDefaults,
}

const TEST_ATG_LOOSE_SESSION = 'TEST_ATG_LOOSE_SESSION'

const atgSessionStateReducer: Reducer<AtgSessionState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case USER_SESSION_ESTABLISHED: {
      const payload = action.payload as LoggedInPayload
      if (payload.atg) {
        return {
          active: true,
          hash: payload.hash,
          obtained: payload.obtailed,
          pId: payload.atg.atgAccount.atgUserId,
          loggedIn: true,
        }
      }
      return state
    }

    case GUEST_USER_SESSION_ESTABLISHED: {
      const payload = action.payload as GuestLoggedInPayload
      if (payload.atg) {
        return {
          active: true,
          hash: '',
          obtained: payload.obtained,
          pId: payload.atg.pId,
          loggedIn: false,
        }
      }
      return state
    }

    // case USER_UI_LOGIN_IN_PROGRESS: login success will override this session, otherwise fallback to current guest session on fail
    case USER_LOGGED_OUT: {
      return DEFAULT
    }

    case ATG_USER_DEACTIVATE_SESSION: {
      return {
        ...state,
        active: false,
      }
    }

    // For Testing Only
    case TEST_ATG_LOOSE_SESSION: {
      // a side-effect, thus poor redux design - for Testing only, however.
      AtgUserSession.set('test_i_am_not_a_valid_jwt_token_and_should_be_rejected')
      return state
    }

    default: return state
  }
}

export default atgSessionStateReducer
