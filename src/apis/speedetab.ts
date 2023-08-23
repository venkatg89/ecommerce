import makeApiRequest from 'src/helpers/api/makeApiRequest'

import { axiosSpeedETab, axiosSpeedETabPayment, axiosSpreedly } from './axiosInstances'
import { SpeedetabSession } from './session/sessions'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

const AUTHORIZATION = 'Authorization'

const addUserSession = async (options: RequestOptions) => {
  const speedetabSessionToken = await SpeedetabSession.get()

  const speedetabAuthorizationHeaders = {}
  if (speedetabSessionToken) {
    speedetabAuthorizationHeaders[AUTHORIZATION] = speedetabSessionToken
  } else {
    logger.info('speedetabSessionToken is not present (If the user is logged in, B&N App should have it)')
  }
  return { ...options, headers: { ...options.headers, ...speedetabAuthorizationHeaders } }
}

export default async function speedetabApiRequest(options: RequestOptions): Promise<APIResponse> {
  const injectedOptions = await addUserSession(options)
  return makeApiRequest(axiosSpeedETab, injectedOptions)
}

export async function speedetabPaymentApiRequest(options: RequestOptions): Promise<APIResponse> {
  const injectedOptions = await addUserSession(options)
  return makeApiRequest(axiosSpeedETabPayment, injectedOptions)
}

export function spreedlyApiRequest(options: RequestOptions): Promise<APIResponse> {
  return makeApiRequest(axiosSpreedly, options)
}
