import { combineReducers } from 'redux'
import notifications, { MyNotificationsState } from './MyNotificationsReducer'

export interface SocialState {
  notifications: MyNotificationsState
}

export default combineReducers<SocialState>({
  notifications,
})
