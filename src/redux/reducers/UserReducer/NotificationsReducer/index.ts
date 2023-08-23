import { AnyAction } from 'redux'

import { NotificationsModel } from 'src/models/UserModel/NotificationsModel'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'
import { NotificationSetting } from 'src/constants/notifications'
import { SET_NOTIFICATIONS } from 'src/redux/actions/user/notifications'

export type NotificationsState = Nullable<NotificationsModel>

const DEFAULT: NotificationsState = {
  [NotificationSetting.CAFE_STATUS_PUSH_ENABLED]: false,
  [NotificationSetting.MARKETING_PUSH_ENABLED]: false,
  [NotificationSetting.CAFE_OFFERS_PUSH_ENABLED]: false,
}

export default (state: NotificationsState = DEFAULT, action: AnyAction) => {
  switch (action.type) {
    case USER_SESSION_ESTABLISHED: {
      const payload = action.payload as LoggedInPayload
      if (payload.notifications) {
        return payload.notifications.notifications
      }
      return state
    }

    case SET_NOTIFICATIONS: {
      const notifications = action.payload
      return notifications
    }

    default:
      return state
  }
}
