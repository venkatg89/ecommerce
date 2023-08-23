import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { NodeProfileModel } from 'src/models/UserModel/NodeProfileModel'
import { NotificationsModel } from 'src/models/UserModel/NotificationsModel'

export const USER_UI_LOGIN_IN_PROGRESS = 'USER__UI_LOGIN_IN_PROGRESS'
export const userUILoginInProgress = makeActionCreator(USER_UI_LOGIN_IN_PROGRESS)

export const USER_UI_LOGIN_ENDED = 'USER__UI_LOGIN_ENDED'
export const userUILoginEnded = makeActionCreator(USER_UI_LOGIN_ENDED)

export const USER_SESSION_ESTABLISHED = 'USER__SESSION_ESTABLISHED'
export const userSessionEstablishedAction = makeActionCreator<LoggedInPayload>(USER_SESSION_ESTABLISHED)

export const GUEST_USER_SESSION_ESTABLISHED = 'GUEST_USER__SESSION_ESTABLISHED'
export const guestUserSessionEstablishedAction = makeActionCreator<GuestLoggedInPayload>(GUEST_USER_SESSION_ESTABLISHED)

export const USER_MILQ_SESSION_LOST = 'USER__MILQ_SESSION_LOST'
export const userMilqSessionLost = makeActionCreator(USER_MILQ_SESSION_LOST)

export interface AtgLoggedInPayload {
  atgAccount: AtgAccountModel // TODO: might need to fix this since we dont pass through node?
}

export interface MilqLoggedInPayload {
  uid: string
  name: string
}

export interface NodeJsLoggedInPayload {
  authorization: string
  nodeProfile: NodeProfileModel
  justRegistered: boolean
}

export interface SpeedEtabLoggedInPayload {
}

export interface NotificationsLoggedInPayload {
  notifications: NotificationsModel
}

export interface LoggedInPayload {
  atg?: AtgLoggedInPayload
  // milq?: MilqLoggedInPayload
  nodeJs?: NodeJsLoggedInPayload
  speedETab?: SpeedEtabLoggedInPayload
  hash: string // username + password hash
  obtailed: Date // date the session was obtained
  notifications?: NotificationsLoggedInPayload
}

export interface GuestAtgLoggedInPayload {
  pId: string
}

export interface GuestLoggedInPayload {
  obtained: Date
  atg?: GuestAtgLoggedInPayload
}
