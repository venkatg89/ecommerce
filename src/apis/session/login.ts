import { LoginCredentialStore } from 'src/apis/session/sessions'
import {
  isLoginInProgress,
  waitIfLoginInProgress,
  msSinceLastLoginEnd,
  setLoginInProgress,
  setLoginHasEnded,
} from './progress-locks/loginProgress'

import {
  nodeJsIsLoginRequired,
  nodeJsWithATGAndSpeedETabPerformLogin,
} from './nodeJs'

import { logoutAction } from 'src/redux/actions/login/logoutAction'
import hashUsernamePassword from 'src/helpers/api/hashUsernamePassword'
import {
  LoggedInPayload,
  userSessionEstablishedAction,
} from 'src/redux/actions/login/basicActionsPayloads'
import { StoreBackDoor } from 'src/redux/backdoor/interface'

import { navigate, Routes, getCurrentRoute } from 'src/helpers/navigationService'

import Logger from 'src/helpers/logger'
import { atgGwIsLoginRequired, atgGwLogin } from './atgGw'
import { AtgCookiesStore } from 'src/apis/session/sessions'

const logger = Logger.getInstance()

const MIN_TIME_BETWEEN_LOGINS_MS = 1000

export interface ReloginSelection {
  atg?: boolean
  nodeWithAtg?: boolean
  milq?: boolean
}

let store: Nullable<StoreBackDoor> = null
export const setStoreBackDoor = (storeBackDoor: StoreBackDoor) => {
  store = storeBackDoor
}

const whichSessionsNeedToRelogin = async (
  forced: ReloginSelection,
  newHash: string,
): Promise<ReloginSelection> => {
  const nodeWithAtgRequired =
    !!forced.nodeWithAtg || (await nodeJsIsLoginRequired(newHash))
  return {
    nodeWithAtg: nodeWithAtgRequired,
    // TODO REMOVEMILQ add milq substitute
    // milq: !!forced.milq || await milqIsLoginRequired(newHash),
    atg:
      nodeWithAtgRequired ||
      !!forced.atg ||
      (await atgGwIsLoginRequired(newHash)),
  }
}

const currentLoggedOnState = () => {
  const state = store!.getState()
  return (
    state.atg.session.active && state.atg.session.loggedIn &&
    state.milq.session.active &&
    state.nodeJs.session.active
  )
}

// Run to perform a check of the present sessions, and re-establish
export const loginAnewOrRestoreLogin = async (
  forceReloginInto: ReloginSelection,
): Promise<boolean> => {
  logger.info(
    `loginAnewOrRestoreLogin starting with forceReloginInto: ${JSON.stringify(
      forceReloginInto,
    )}`,
  )

  if (isLoginInProgress()) {
    logger.info(
      'loginAnewOrRestoreLogin - waiting for persent login to complete',
    )
    await waitIfLoginInProgress()
    const currentLoggedInState = currentLoggedOnState()
    logger.info(
      `loginAnewOrRestoreLogin - isLoginInProgress was true. Waited and returning currentLoggedInState ${currentLoggedInState}`,
    )
    return currentLoggedInState
  }

  const timeSinceLastLoginEnded = msSinceLastLoginEnd()
  if (msSinceLastLoginEnd() < MIN_TIME_BETWEEN_LOGINS_MS) {
    const currentLoggedInState = currentLoggedOnState()
    logger.info(
      `loginAnewOrRestoreLogin - timeSinceLastLoginEnded too low at ${timeSinceLastLoginEnded}ms. Returning currentLoggedInState ${currentLoggedInState}`,
    )
    return currentLoggedInState
  }

  /*
    Note: don't clearCookies() when running this function alone.
    This function can restore a partially lost session, and clearing all cookies would
    interfere with existing, still running sessions (e.g. - milq)
  */

  // Lock-in the login procedure
  setLoginInProgress()

  // We can't do anything unless credentials are in the keychain.
  const credentials = await LoginCredentialStore.get()
  if (!credentials) {
    setLoginHasEnded()
    store!.dispatch(logoutAction()) // Clear everything out, ask use to re-login
    logger.warn('loginAnewOrRestoreLogin found no credentials in the keychain')
    return false
  }

  // Grab username, password, and make a hash of them
  const { username, password } = credentials!
  const newHash = hashUsernamePassword(username, password)

  const reloginInto = await whichSessionsNeedToRelogin(
    forceReloginInto,
    newHash,
  )

  const loggedInPayload: LoggedInPayload = {
    hash: newHash,
    obtailed: new Date(),
  }

  // TODO REMOVEMILQ figure out what to do with Milq

  // (Re-)login into milq, if required.
  // if (reloginInto.milq) {
  //   // Perform milq Login.
  //   const milqLoggedInPayload = await milqLogin(username, password)
  //   if (!milqLoggedInPayload) {
  //     logger.warn('milq login failed')
  //     setLoginHasEnded()
  //     return false
  //   }
  //   loggedInPayload.milq = milqLoggedInPayload
  // }

  // (Re-)login into Node (gives also ATG), if required.
  // TODO REMOVEMILQ figure out what to do with Milq
  if (reloginInto.nodeWithAtg) {
    // let milqUserId = ''
    // if (loggedInPayload.milq) {
    //   milqUserId = loggedInPayload.milq.uid
    // } else {
    //   const state = store!.getState()
    //   if (state.user.profile) {
    //     milqUserId = state.user.profile.uid
    //   } else {
    //     logger.error('nodeWithAtg - milq User ID is missing for some reason - please investigate')
    //   }
    // }

    const cookies = await AtgCookiesStore.getSpecificKeys!(['anonymousOrder'])

    const nodeJSLoggedInPayload = await nodeJsWithATGAndSpeedETabPerformLogin(
      {
        username,
        password,
        cookies,
      },
      newHash,
    )

    if (!nodeJSLoggedInPayload) {
      // loggin failed
      logger.warn('nodeWithAtg login failed')
      setLoginHasEnded()
      return false
    }

    if (nodeJSLoggedInPayload.atg) {
      loggedInPayload.atg = nodeJSLoggedInPayload.atg
    }
    if (nodeJSLoggedInPayload.nodeJs) {
      loggedInPayload.nodeJs = nodeJSLoggedInPayload.nodeJs
    }
    if (nodeJSLoggedInPayload.speedETab) {
      loggedInPayload.speedETab = nodeJSLoggedInPayload.speedETab
    }
    if (nodeJSLoggedInPayload.notifications) {
      loggedInPayload.notifications = nodeJSLoggedInPayload.notifications
    }
  }

  // (Re-)login into ATG, if required
  // We can skip ATG login if we logged into Node during this session
  if (reloginInto.atg && !loggedInPayload.atg) {
    // Perform ATG login
    const atgLoggedInPayload = await atgGwLogin(username, password)
    if (!atgLoggedInPayload) {
      // loggin failed
      logger.warn('atgGwLogin login failed')
      setLoginHasEnded()
      return false
    }

    loggedInPayload.atg = atgLoggedInPayload
  }

  setLoginHasEnded()

  // Give all the session info to redux
  await store!.dispatch(userSessionEstablishedAction(loggedInPayload))

  // All good
  logger.info('loginAnewOrRestoreLogin - sessions obrained/restored. All good')

  const currentRoute = getCurrentRoute()
  if (currentRoute === Routes.CART__MAIN || currentRoute === Routes.CART__CHECKOUT) {
    navigate(Routes.HOME__MAIN)
  }

  return true
}
