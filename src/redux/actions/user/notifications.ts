import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { State } from 'src/redux/reducers'

import { fetchGetAccountNotificationSettings } from 'src/endpoints/nodeJs/profile'
import { NotificationsModel } from 'src/models/UserModel/NotificationsModel'

export const SET_NOTIFICATIONS = 'SETTINGS__NOTIFICATIONS_SET'
const setNotifications = makeActionCreator<NotificationsModel>(SET_NOTIFICATIONS)

export const getNotificationsAction: () => ThunkedAction<State, boolean> =
  () => async (dispatch, getState) => {
    const response = await fetchGetAccountNotificationSettings()
    if (response.ok) {
      dispatch(setNotifications(response.data.notifications))
    }
    return true
  }
