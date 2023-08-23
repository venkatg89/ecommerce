import { State } from 'src/redux/reducers'

export const socialNotificationSelector = (stateAny) => {
  const state = stateAny as State
  return state._legacyHome.social.notifications
}
