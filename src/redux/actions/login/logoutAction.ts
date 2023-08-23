import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { navigate, Routes } from 'src/helpers/navigationService'
import {
  LoginCredentialStore,
  NodeJsSession,
  AtgUserSession,
  SpeedetabSession,
} from 'src/apis/session/sessions'
import { clearCookies } from 'src/helpers/api/cookieHelper'

// import { milqLogout } from 'src/endpoints/milq/user/logout'
import { atgLogout } from 'src/endpoints/atgGateway/logout'
import { nodeLogout } from 'src/endpoints/nodeJs/logout'

import { State } from 'src/redux/reducers'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

export const USER_LOGGED_OUT = 'LOGGED_OUT__USER'
const loggedOutAction = makeActionCreator(USER_LOGGED_OUT)

export const logoutAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  try {
    // Remove our user assosiation with this phone.

    // Log out of all API services
    // TODO - log out of Node.js
    await Promise.all([
      // TODO REMOVEMILQ
      // milqLogout(),
      atgLogout(getState()),
      nodeLogout(),
    ])
  } catch (e) {
    logger.error(`Unable to logout ${e}`)
  }

  // After log out completed. The clears the redux state
  // Onboarding flag reset automatically.
  // Clear the secure store (keychain) or sessions and stored credentials
  await Promise.all([
    LoginCredentialStore.clear(),
    AtgUserSession.clear(),
    NodeJsSession.clear(),
    SpeedetabSession.clear(),
  ])
  // Clear all cookies
  await clearCookies()

  await dispatch(loggedOutAction())

  navigate(Routes.ONBOARDING)
}
