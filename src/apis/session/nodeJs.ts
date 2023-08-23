
import { axiosNodeJs } from 'src/apis/axiosInstances'

import { SERVER_LOGIN } from 'src/constants/formErrors'

import { NodeProfileModel } from 'src/models/UserModel/NodeProfileModel'
// import { ReadingStatusListUpdate, ReadingStatus } from 'src/models/ReadingStatusModel'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { NotificationsModel } from 'src/models/UserModel/NotificationsModel'

import makeApiRequest from 'src/helpers/api/makeApiRequest'
import { normalizeNodeJsProfileReply } from 'src/helpers/api/node/profile'
import { NodeJsSession, AtgUserSession, SpeedetabSession, AtgCookiesStore } from './sessions'

// import { OnboardingBookList } from 'src/redux/reducers/UserReducer/OnboardingReducer/OnboardingBookLists'
// import { State } from 'src/redux/reducers'

import { LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'

// import { workIdFromEanSelector } from 'src/redux/selectors/booksListSelector'
import { normalizeAtgUserDetails } from 'src/helpers/api/atg/normalizeAccount'

import { StoreBackDoor } from 'src/redux/backdoor/interface'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

let store: Nullable<StoreBackDoor> = null
export const setStoreBackDoor = (storeBackDoor: StoreBackDoor) => {
  store = storeBackDoor
}

export interface NodeJsLoginData {
  // milqUserId: string
  username: string
  password: string
  cookies?: string

  // Used on Registration to load the initial reading lists.
  // readingStatusUpdates?: ReadingStatusListUpdate
}

interface NodeJsLoginResponse {
  authorization: string
  nodeProfile: NodeProfileModel
  justRegistered: boolean
  atgAccount: AtgAccountModel // forwarded to us by NodeJS from ATG login call.
  atgJWToken: string
  atgLoginSessionCookies: string[]
  speedetabToken: string
  notifications: NotificationsModel
}

const nodeJsLogin = async (loginData: NodeJsLoginData) => {
  const data = loginData
  return makeApiRequest(axiosNodeJs, {
    method: 'POST',
    endpoint: '/v1/profiles/login',
    data,
  })
}

const normalizeNodeJsLoginResponse = (reply: any): NodeJsLoginResponse => ({
  authorization: reply.authorization,
  justRegistered: reply.justResitered || false,
  atgAccount: normalizeAtgUserDetails(reply.atgUserDetails),
  atgJWToken: reply.atgJWToken,
  atgLoginSessionCookies: reply.atgLoginSessionCookies,
  speedetabToken: reply.speedetabToken,
  nodeProfile: normalizeNodeJsProfileReply(reply.nodeProfile),
  notifications: reply.notifications,
})

// export const nodeJsBuildPiggyBackReadingStatusList = () => {
//   const addToStatusUpdateList = (readingStatusUpdates: ReadingStatusListUpdate,
//     list: OnboardingBookList, status: ReadingStatus, state: State) => {
//     const ref = readingStatusUpdates // for es-lint no-param-reassign
//     if (!list) {return}
//     Object.keys(list).forEach((ean) => { ref[ean] = { status, workId: workIdFromEanSelector(state, { ean }) } })
//   }
//
//   const stateForNodeLogin = store!.getState()
//
//   // Any books to toss in with registration?
//   const readingStatusUpdates: ReadingStatusListUpdate = {}
//   const onboaringLists = stateForNodeLogin.user.onboarding.bookLists
//   addToStatusUpdateList(readingStatusUpdates, onboaringLists.read, ReadingStatus.FINISHED, stateForNodeLogin)
//   addToStatusUpdateList(readingStatusUpdates, onboaringLists.reading, ReadingStatus.READING, stateForNodeLogin)
//   addToStatusUpdateList(readingStatusUpdates, onboaringLists.wantToRead, ReadingStatus.TO_BE_READ, stateForNodeLogin)
//   return readingStatusUpdates
// }


export const nodeJsIsLoginRequired = async (newHash: string): Promise<boolean> => {
  const state = store!.getState()
  const nodeJsSession = state.nodeJs.session
  if (!nodeJsSession.active) {
    return true
  }

  const secureSessionPresent = !!(await NodeJsSession.get())
  if (!secureSessionPresent) {
    logger.info('nodeJsIsLoginRequired: no Node session in the Keychain. Re-login *is* required')
    return true
  }

  if (nodeJsSession.hash !== newHash) {
    logger.info('nodeJsIsLoginRequired: Redux store user/pw hash vs keystore user/pw hash mis-match. Re-login *is* required')
    return true
  }

  logger.info('nodeJsIsLoginRequired: all good - no re-login is required.')
  return false // everything looks OK.
}

export const nodeJsWithATGAndSpeedETabPerformLogin =
  async (loginData: NodeJsLoginData, newHash: string): Promise<Nullable<LoggedInPayload>> => {
    const response = await nodeJsLogin(loginData)

    if (response.ok) {
      const { authorization, justRegistered, atgAccount, atgLoginSessionCookies, atgJWToken, speedetabToken, nodeProfile, notifications } = normalizeNodeJsLoginResponse(response.data)
      if (authorization && atgJWToken) {
        // TODO: check if we dont need to clear. await AtgCookiesStore.clear() // clear old cookies
        // Set sessions for Node & ATG in secure store
        await Promise.all([
          NodeJsSession.set(authorization),
          AtgUserSession.set(atgJWToken),
          AtgCookiesStore.set(atgLoginSessionCookies),
        ])

        const loggedInPayload: LoggedInPayload = {
          nodeJs: { authorization, nodeProfile, justRegistered },
          atg: { atgAccount },
          hash: newHash,
          obtailed: new Date(),
          notifications: { notifications },
        }

        if (speedetabToken) {
          await SpeedetabSession.set(speedetabToken)
          loggedInPayload.speedETab = {}
        }

        // All Good!
        return loggedInPayload
      }
      // No session or no profile
      return null
    }
    // Reponse was not OK
    if (response.data) {
      const error = /<html|<!?doctype/gi.test(response.data) ? 'Server restarting - please try again in 1-2 minutes' : response.error
      await store!.dispatch(setformErrorMessagesAction(SERVER_LOGIN, [{ formFieldId: 'loginError', error }]))
    }
    return null
  }
