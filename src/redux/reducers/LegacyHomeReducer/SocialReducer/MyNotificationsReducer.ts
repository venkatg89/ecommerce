import { Reducer } from 'redux'
import { NotificationItem } from 'src/models/SocialModel/NotificationModel'
import { SET_NOTIFICATIONS_FALLBACK_ACTION, SET_NOTIFICATIONS_DATA } from 'src/redux/actions/legacyHome/social/notificationsActions'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

export type MyNotificationsState = NotificationItem[]

const DEFAULT: MyNotificationsState = []

const _notifications: Reducer<MyNotificationsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_NOTIFICATIONS_DATA:
    case SET_NOTIFICATIONS_FALLBACK_ACTION: {
      const { notifications } = action.payload
      return [...notifications]
    }


    case USER_SESSION_ESTABLISHED:
      return (action.payload as LoggedInPayload).nodeJs ? DEFAULT : state

    default:
      return state
  }
}

export default _notifications
