import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'

export const SET_NOTIFICATIONS_DATA = 'SET_NOTIFICATIONS_DATA'
export const SET_NOTIFICATIONS_FALLBACK_ACTION = 'SET_NOTIFICATIONS_FALLBACK_ACTION'

export const setNotificationData = makeActionCreator(SET_NOTIFICATIONS_DATA)
export const setNotificationsFallbackAction = makeActionCreator(SET_NOTIFICATIONS_FALLBACK_ACTION)

export const myNotificationsApiActions = makeApiActions('homeSocrialMyNotifications', 'HOME__SOCIAL_NOTIFICATIONS')
export const historyApiAction = makeApiActions('historyApiAction', 'HOME__SOCIAL_NOTIFICATION_HISTORY')
