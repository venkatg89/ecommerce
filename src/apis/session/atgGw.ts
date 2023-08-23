// This is our config, not npm's config
import config from 'config'

import makeApiRequest from 'src/helpers/api/makeApiRequest'
import { normalizeAtgUserDetails } from 'src/helpers/api/atg/normalizeAccount'

import {
  AtgLoggedInPayload,
  guestUserSessionEstablishedAction,
  GuestLoggedInPayload,
} from 'src/redux/actions/login/basicActionsPayloads'

import { axiosAtgGateway } from 'src/apis/axiosInstances'
import { StoreBackDoor } from 'src/redux/backdoor/interface'
import { AtgUserSession } from './sessions'
// import { AtgCookiesStore } from 'src/apis/session/sessions'
import Logger from 'src/helpers/logger'
import { GlobalModals } from 'src/constants/globalModals'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { orderClearAction } from 'src/redux/actions/shop/cartAction'

const logger = Logger.getInstance()

let store: Nullable<StoreBackDoor> = null
export const setStoreBackDoor = (storeBackDoor: StoreBackDoor) => {
  store = storeBackDoor
}

const LOGIN_ENDPOINT = '/my-account/login'
const GUEST_SESSION_ENDPOINT = '/generateToken'

// BN1039 - OK - success: true
// BN1041 - Fail - success": false
const atgGuestSessionCall = async () => {
  // TODO: pass the anonymousOrder only?
  // const headerCookies = await AtgCookiesStore.get() // stateless call for now
  const data = { clientId: config.api.atgGateway.clientId }
  return makeApiRequest(axiosAtgGateway, {
    method: 'POST',
    endpoint: GUEST_SESSION_ENDPOINT,
    data,
    // headers: {
    //   Cookie: headerCookies,
    // },
  })
}

export const atgFetchGuestSession = async () => {
  try {
    // clear cart data on new guest session
    await store!.dispatch(orderClearAction())
    const response = await atgGuestSessionCall()
    if (response && response.data && response.data.response) {
      const responseData = response.data.response
      if (responseData.success && responseData.jResponse) {
        const result: GuestLoggedInPayload = {
          obtained: new Date(),
          atg: {
            pId: responseData.jResponse.profileId,
          },
        }
        await AtgUserSession.set(responseData.jResponse.jtId)
        // atg cookies management is called within makeApiRequest for atgGw Requests
        await store!.dispatch(guestUserSessionEstablishedAction(result))
        return
      }
      logger.warn(
        `ATG Guest session: Unable to get - ${responseData.code} - ${responseData.message}`,
      )
      return null
    }
    logger.warn('ATG Guest session: No response')
    return null
  } catch (e) {
    logger.warn(`atgFetchGuestSession - threw ${e && e.message}}`)
    return null
  }
}

const atgLoginCall = async (login: string, password: string) => {
  // The login session sometimes do not return new sessions when we pass the old cookies
  // lets pass no cookies for now unless there are specific cookies we need to send
  // const headerCookies = await AtgCookiesStore.get()
  const data = {
    login,
    password,
    autoLogin: true,
    clientId: config.api.atgGateway.clientId,
  }

  return makeApiRequest(axiosAtgGateway, {
    method: 'POST',
    endpoint: LOGIN_ENDPOINT,
    data,
    // headers: {
    //   Cookie: headerCookies,
    // },
  })
}

export const atgGwIsLoginRequired = async (
  newHash: string,
): Promise<boolean> => {
  const atgSession = store!.getState().atg.session

  // No session? We should make one
  if (!atgSession.active) {
    logger.info(
      'atgGwIsLoginRequired: atgSession is not active. Re-login *is* required',
    )
    return true
  }

  // A new user? A re-login is required
  if (atgSession.hash !== newHash) {
    logger.info(
      'atgGwIsLoginRequired: Redux store user/pw hash vs keystore user/pw hash mis-match. Re-login *is* required',
    )
    return true
  }

  // No session cookie? Need one
  const atgSessionPresent = !!(await AtgUserSession.get())
  if (!atgSessionPresent) {
    logger.info(
      'atgGwIsLoginRequired: no ATG session in the Keychain. Re-login *is* required',
    )
    return true
  }

  logger.info('atgGwIsLoginRequired: all good - no re-login is required.')
  return false // all ok
}

export const atgGwLogin = async (
  username: string,
  password: string,
): Promise<Nullable<AtgLoggedInPayload>> => {
  const response = await atgLoginCall(username, password)
  if (response.ok) {
    if (
      !response.data ||
      !response.data.response ||
      !response.data.response.userDetails
    ) {
      return null
    }

    const atgJWToken = response.data.response.userDetails.userInfo.jtId
    logger.info(atgJWToken)
    await AtgUserSession.set(atgJWToken)
    // atg cookies management is called within makeApiRequest for atgGw Requests

    const atgLoggedInPayload: AtgLoggedInPayload = {
      atgAccount: normalizeAtgUserDetails(response.data.response.userDetails),
    }
    return atgLoggedInPayload
  } else {
    // Login failed
    store!.dispatch(
      setActiveGlobalModalAction({ id: GlobalModals.RELOG_ACCOUNT }),
    )
    return null
  }
}
