import tough from 'tough-cookie'
// This is our config, not npm's config
import config from 'config'

// Our imports
import { atgFetchGuestSession } from './session/atgGw'
import makeApiRequest from 'src/helpers/api/makeApiRequest'
import Logger from 'src/helpers/logger'
import { StoreBackDoor } from 'src/redux/backdoor/interface'
import { AtgUserSession } from 'src/apis/session/sessions'
import { AtgCookiesStore } from 'src/apis/session/sessions'

import { axiosAtgGateway } from './axiosInstances'
import { waitIfLoginInProgress as waitIfUserLoginInProgress } from './session/progress-locks/loginProgress'
import {
  waitIfGuestLoginInProgress,
  setGuestLoginInProgress,
  setGuestLoginHasEnded,
  isGuestLoginInProgress,
} from './session/progress-locks/guestSession'
import { orderClearAction } from 'src/redux/actions/shop/cartAction'

import { atgSessionLost } from './session/lost'
import { GlobalModals } from 'src/constants/globalModals'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import {
  SEARCH_LOOK_AHEAD,
  SEARCH_RESULTS,
} from 'src/endpoints/atgGateway/search'
import {
  navigate,
  Routes,
  getCurrentRoute,
} from 'src/helpers/navigationService'
import { deactiveAtgSessionAction } from 'src/redux/actions/user/sessionsAction'
import { cartItemCountSelector } from 'src/redux/selectors/widgetSelector'
import { setCartItemCountAction } from 'src/redux/actions/shop/cartAction'

const ATG_SESSION_EXPIRY_MINUTES =
  config.api.atgGateway.sessionExpiryInMinutes || 30
const ATG_STALE_SESSION_EXPIRY_MINUTES =
  config.api.atgGateway.staleSessionExpiryInMinutes || 12
const ATG_SESSION_REVIEW_EARLY_TIME_FRACTION = 0.75 // if we're 3/4 into our session - let's refresh it

const ATG_SESSION_EXPIRY_MS =
  ATG_SESSION_EXPIRY_MINUTES *
  ATG_SESSION_REVIEW_EARLY_TIME_FRACTION *
  60 *
  1000 /* now in ms */
const ATG_STALE_SESSION_EXPIRY_MS =
  ATG_STALE_SESSION_EXPIRY_MINUTES * 60 * 1000 /* now in ms */

const ATG_MAX_RETRY_COUNT = 3

let lastApiRequestDate: Nullable<Date> = null

const logger = Logger.getInstance()

let store: Nullable<StoreBackDoor> = null
export const setStoreBackDoor = (storeBackDoor: StoreBackDoor) => {
  store = storeBackDoor
}

const respMsgFromAtg = (response): string => {
  if (
    response &&
    response.data &&
    response.data.response &&
    response.data.response.code
  ) {
    const { code, message } = response.data.response
    return `${code} - ${message} - (${response.error || ')'}`
  }
  return '(no message of code-description returned from ATG)'
}

const atgApiRequest = async (
  optionsIn: RequestOptions,
  tryNo = 1,
): Promise<APIResponse> => {
  const options = { ...optionsIn }
  if (!options.headers) {
    options.headers = {}
  }

  let state = store!.getState()

  let resetRoute = false

  // wait for any logins to complete
  await waitIfUserLoginInProgress()

  // ATG session expires regularly, so check if our session should still be valid
  if (
    state.atg.session.active &&
    state.atg.session.loggedIn &&
    state.atg.session.obtained
  ) {
    const sessionObtained = new Date(state.atg.session.obtained)
    const sessionAge = new Date().getTime() - sessionObtained.getTime()
    const bnSecStatCookies = await AtgCookiesStore.getSpecificKeys!([
      'BN_SEC_STAT',
    ])

    if (bnSecStatCookies === 'BN_SEC_STAT=2') {
      logger.info('BN_SEC_STAT is 2 for logged in user, relog')
      await atgSessionLost()
      state = store!.getState()
    } else if (sessionAge >= ATG_SESSION_EXPIRY_MS) {
      logger.info(`At ${sessionAge / 1000 / 60}min, the atg session is too old`)
      await atgSessionLost()
      state = store!.getState() // Get updated state after possible re
      resetRoute = true
    } else {
      // check for idle sessions
      if (lastApiRequestDate) {
        const lastRequestAge =
          new Date().getTime() - lastApiRequestDate!.getTime()
        if (lastRequestAge >= ATG_STALE_SESSION_EXPIRY_MS) {
          logger.info(
            `At ${lastRequestAge / 1000 / 60}min, the atg session is stale`,
          )
          await atgSessionLost()
          state = store!.getState()
          resetRoute = true
        }
      } else if (sessionAge >= ATG_STALE_SESSION_EXPIRY_MS) {
        logger.info(`At ${sessionAge / 1000 / 60}min, the atg session is stale`)
        await atgSessionLost()
        state = store!.getState()
        resetRoute = true
      }
    }
  } else if (!state.atg.session.active && state.atg.session.loggedIn) {
    logger.info(`Session became inactive, refresh session`)
    await atgSessionLost()
    state = store!.getState()
    resetRoute = true
  }

  // Add client ID to the request
  if (options.method === 'GET') {
    if (!options.params) {
      options.params = {}
    }
    options.params.clientId = config.api.atgGateway.clientId
  } else {
    // a POST
    if (!options.data) {
      options.data = {}
    }
    options.data.clientId = config.api.atgGateway.clientId
  }

  let guestAuthAdded = false
  let authAdded = false

  // Unless this is a login or register call, we need a JWT guest token
  if (
    !options.endpoint.endsWith('/login') ||
    !options.endpoint.endsWith('/createUser')
  ) {
    state = store!.getState()
    // Add ATG UserID and Authorization if we have it
    if (state.atg.session.active && state.atg.session.loggedIn) {
      if (state.atg.session.active) {
        const atgJWToken = await AtgUserSession.get()
        options.headers!.Authorization = `Bearer ${atgJWToken}`
        options.headers!.pId = state.atg.session.pId
        authAdded = true
        const headerCookies = await AtgCookiesStore.get()
        options.headers!.Cookie = headerCookies
      }
    } else if (!state.atg.session.loggedIn) {
      // Check if the guest session is missing, or is expired.
      let obtainSession = false
      if (!state.atg.session.active) {
        logger.info('No atgGuestSession at all - obtaining...')
        obtainSession = true
      } else {
        const guestSessionDurationMs = state.atg.session.obtained
          ? new Date().getTime() -
            new Date(state.atg.session.obtained).getTime()
          : 0
        if (guestSessionDurationMs > ATG_SESSION_EXPIRY_MS) {
          logger.info(
            `At ${
              guestSessionDurationMs / 1000 / 60
            }min, the atgGuestSession is too old, obtaining...`,
          )
          obtainSession = true
        } else {
          // check for idle sessions
          if (lastApiRequestDate) {
            const lastRequestAge =
              new Date().getTime() - lastApiRequestDate!.getTime()
            if (lastRequestAge >= ATG_STALE_SESSION_EXPIRY_MS) {
              logger.info(
                `At ${
                  lastRequestAge / 1000 / 60
                }min, the guest atg session is stale`,
              )
              obtainSession = true
            }
          } else if (guestSessionDurationMs >= ATG_STALE_SESSION_EXPIRY_MS) {
            logger.info(
              `At ${
                guestSessionDurationMs / 1000 / 60
              }min, the guest atg session is stale`,
            )
            obtainSession = true
          }
        }
      }

      if (obtainSession) {
        if (isGuestLoginInProgress()) {
          // Another guest login is in progress now - just wait for it to be completed.
          logger.info('atg guest session in progress')
          await waitIfGuestLoginInProgress()
        } else {
          // Perform the guest login during this call.
          setGuestLoginInProgress()
          await atgFetchGuestSession()
          logger.info('atg guest session NOT IN PROGRESS')
          resetRoute = true
          setGuestLoginHasEnded()
        }
      }

      state = store!.getState() // Get updated state after possible re

      // Attach the guest session, if we obtained it above.
      const atgJWToken = await AtgUserSession.get()
      options.headers!.Authorization = `Bearer ${atgJWToken}`
      options.headers!.pId = state.atg.session.pId
      const headerCookies = await AtgCookiesStore.get()
      options.headers!.Cookie = headerCookies
      guestAuthAdded = true
    }
  }

  console.log(
    `**API REQUEST** - ${options.endpoint} - **Cookies** - ${
      options.headers!.Cookie
    } - **JWT** - ${options.headers!.Authorization} - **PID** - ${
      options.headers!.pId
    }`,
  )
  // Perform the request!
  const response = await makeApiRequest(axiosAtgGateway, options)
  lastApiRequestDate = new Date()

  // Carry over and update cookies
  // For Android, theres a bug with incoming set cookies, so we need to clear and readd cookies
  // instead, we update cookies from incoming response inside makeApiRequest

  // Check for session loss, and re-try if needed
  if (
    (authAdded || guestAuthAdded) &&
    response.status === 401 &&
    response.error &&
    typeof response.error.message === 'string'
  ) {
    const errorMessage = (response.error?.message as string) || ''
    if (errorMessage.toLowerCase().indexOf('no auth') >= 0) {
      if (tryNo <= ATG_MAX_RETRY_COUNT) {
        if (authAdded) {
          logger.info(
            `atgApiRequest reply ${response.status}, '${errorMessage}' on try ${tryNo}, marking logged-in session as lost.`,
          )
          if (await atgSessionLost()) {
            return atgApiRequest(options, tryNo + 1)
          }
        } else if (guestAuthAdded) {
          // Clear the guest credentials - that are out of date
          store!.dispatch(deactiveAtgSessionAction())

          logger.info(
            `atgApiRequest reply ${response.status}, '${errorMessage}' on try ${tryNo}, marking guest session as lost.`,
          )

          // Ret-ry the
          return atgApiRequest(options, tryNo + 1)
        }
        logger.warn('atgApiRequest was not able to get login session back.')
        store!.dispatch(
          setActiveGlobalModalAction({ id: GlobalModals.RELOG_ACCOUNT }),
        )
      } else {
        logger.warn(
          `atgApiRequest reply ${response.status}, '${errorMessage}' on try ${tryNo}, max retries exceeded. Giving up.`,
        )
      }
    } else {
      logger.info(
        `atgApiRequest reply ${response.status}, did not recognize '${errorMessage}'`,
      )
    }
  }

  // a 200 response can have a success false in cases where it didn't return properly
  // fix the response.ok with regards to the success flag
  const replyMessageInText = respMsgFromAtg(response)
  try {
    // include the "success" flag for RenLive recommendations API
    if (response.ok && /^\/ren\/getrecs\//i.test(options.endpoint)) {
      response.data = {
        ...response.data,
        response: {
          success: true,
        },
      }
    }

    // non standard responses
    if (
      response.status === 200 &&
      (options.endpoint === SEARCH_LOOK_AHEAD ||
        options.endpoint === SEARCH_RESULTS)
    ) {
      response.ok = true
    } else if (response.data?.response) {
      if (replyMessageInText.includes('BN316')) {
        // For some missing EAN - other will be present. Action shoud detect if any missing from response.
        // ignore missing eans from ATG QA2
        logger.info(
          'atgApiRequest: returned BN316 - 1+ of the requested EANs are from response.',
          false,
        )
        response.ok = true
      } else if (replyMessageInText.includes('BN2024')) {
        response.ok = true
      } else {
        // All other calls:
        response.ok = response.ok && !!response.data?.response.success
        if (!response.ok) {
          logger.warn(
            `atgApiRequest: not ok - ${options.endpoint} - ${replyMessageInText}`,
          )
        }
      }
    } else if (response.data?.order) {
      logger.info('atgApiRequest: got order details ok', false)
      response.ok = true
    } else if (response.data?.secretQuestion) {
      logger.info('atgApiRequest: got secretQuestion[] ok', false)
      response.ok = true
    } else if (
      options.endpoint.includes('/order-details/getOrderSummary') &&
      response.status === 200
    ) {
      // this one doesnt return default BN payload
      response.ok = true
    } else {
      logger.info(
        `atgApiRequest: not ok - ${options.endpoint} - ${replyMessageInText}`,
      )
      response.ok = false
    }
  } catch (e) {
    const msg = 'atgApiRequest: error processing ATG reply itself'
    logger.warn(`${msg} - ${replyMessageInText} - we threw an exception ${e}`)
    response.ok = false
  }

  // this is for invalid flow scenarios
  if (
    response.status === 403 &&
    response.data?.formExceptions?.[0]?.errorCode
  ) {
    if (response.data?.formExceptions?.[0]?.errorCode === 'invalidSession') {
      store!.dispatch(deactiveAtgSessionAction())
      resetRoute = true
    }
  }

  updateCartItemCount()

  // If we're stale session, then navigate out of checkout if possible
  if (resetRoute) {
    if (getCurrentRoute() === Routes.CART__CHECKOUT) {
      navigate(Routes.HOME__MAIN)
      store!.dispatch(orderClearAction())
    }
  }
  return response
}

const updateCartItemCount = async () => {
  const cartItemCountCookie = await AtgCookiesStore.getSpecificKeys!([
    'CART_ITEM_COUNT',
  ])
  if (cartItemCountCookie) {
    const cookieObj = tough.Cookie.parse(cartItemCountCookie)
    const count = cookieObj?.value
    if (Number(count) !== cartItemCountSelector(store!.getState())) {
      store!.dispatch(setCartItemCountAction(Number(count)))
    }
  }
}

export default atgApiRequest
