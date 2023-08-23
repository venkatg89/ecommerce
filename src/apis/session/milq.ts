import { Platform } from 'react-native'

import { SERVER_LOGIN } from 'src/constants/formErrors'

import { axiosMilq } from 'src/apis/axiosInstances'
import makeApiRequest from 'src/helpers/api/makeApiRequest'

import { StoreBackDoor } from 'src/redux/backdoor/interface'
import { MilqLoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'
import { setformErrorMessagesAction, clearFormErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

let store: Nullable<StoreBackDoor> = null
export const setStoreBackDoor = (storeBackDoor: StoreBackDoor) => {
  store = storeBackDoor
}

interface MilqLoginData {
  device: string;
  username: string;
  password: string;
}

const milqLoginCall = async (username: string, password: string) => {
  const data: MilqLoginData = {
    device: Platform.OS === 'ios' ? 'ios' : 'android',
    username,
    password,
  }

  return makeApiRequest(axiosMilq, {
    method: 'POST',
    endpoint: '/api/v2/auth/milq',
    data,
  })
}

export const milqIsLoginRequired = async (newHash: string): Promise<boolean> => {
  const milqSession = store!.getState().milq.session

  // No session? We should make on
  if (!milqSession.active) {
    logger.info('milqIsLoginRequired: milqSession is not active. Re-login *is* required')
    return true
  }
  // A new user? A re-login is required
  if (milqSession.hash !== newHash) {
    logger.info('milqIsLoginRequired: Redux store user/pw hash vs keystore user/pw hash mis-match. Re-login *is* required')
    return true
  }

  logger.info('milqIsLoginRequired: all good - no re-login is required.')
  return false // all ok
}

export const milqLogin = async (username: string, password: string): Promise<Nullable<MilqLoggedInPayload>> => {
  try {
    const response = await milqLoginCall(username, password)
    if (response.ok) {
      const loggedInPayload: MilqLoggedInPayload = {
        name: response.data.name,
        uid: response.data.uid,
      }
      await store!.dispatch(clearFormErrorMessagesAction({ formId: SERVER_LOGIN }))

      return loggedInPayload
    }

    const error = /<html|<!?doctype/gi.test(response.data) ? 'Server restarting - please try again in 1-2 minutes' : response.data.message
    await store!.dispatch(setformErrorMessagesAction(SERVER_LOGIN, [{ formFieldId: 'loginError', error }]))
    return null
  } catch (e) {
    // Need a better way to report errors
    /* eslint-disable no-console */
    logger.warn(`milqLoginFetchAction caught ${e || '(null)'} ${e ? e.message : ''}`)
    return null
  }
}
