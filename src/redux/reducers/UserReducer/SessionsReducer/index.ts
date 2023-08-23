import { Reducer } from 'redux'
import moment from 'moment'
import { SET_USER_SESSION } from 'src/redux/actions/user/sessionsAction'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

interface SessionModel {
  id: number;
  startedAt: Date;
  endedAt: Nullable<Date>;
}

export type SessionsState = SessionModel[]

const MIN_DAYS_BETWEEN_SESSIONS = 1

const DEFAULT: SessionsState = []

const sessions: Reducer<SessionsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_USER_SESSION: {
      const newSession = {
        id: new Date().getTime(),
        startedAt: new Date(),
        endedAt: null,
      }

      const currentSession = state.find(item => !item.endedAt)
      // when no current session, create a new one
      if (!currentSession) {
        return [
          ...state,
          newSession,
        ]
      }

      // when more than MIN_DAYS_BETWEEN_SESSIONS passed since the session was started, close it, and create a new one
      if (moment().diff(moment(currentSession.startedAt), 'days') >= MIN_DAYS_BETWEEN_SESSIONS) {
        currentSession.endedAt = new Date()
        return [
          ...state.filter(item => item.id !== currentSession.id),
          currentSession,
          newSession,
        ]
      }

      return state
    }

    case USER_SESSION_ESTABLISHED:
      return (action.payload as LoggedInPayload).nodeJs ? DEFAULT : state

    default:
      return state
  }
}

export default sessions
