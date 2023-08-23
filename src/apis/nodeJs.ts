// This is our config, not npm's config

import makeApiRequest from 'src/helpers/api/makeApiRequest'
import { NodeJsSession, AtgUserSession } from 'src/apis/session/sessions'
import { nodeJsSessionLost } from './session/lost'
import { axiosNodeJs } from './axiosInstances'

import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

// Cookies used and returned by NodeJs
export const AUTHORIZATION = 'Authorization'
const ATG_JWT = 'atgJWToken'

const getOptions = async (options: RequestOptions) => {
  const nodeJsHeaders = { }
  const nodeJsSessionCookie = await NodeJsSession.get()
  if (nodeJsSessionCookie) {nodeJsHeaders[AUTHORIZATION] = `Bearer ${nodeJsSessionCookie}`}
  const atgJwtToken = await AtgUserSession.get()
  if (atgJwtToken) {nodeJsHeaders[ATG_JWT] = atgJwtToken}
  return { ...options, headers: { ...options.headers, ...nodeJsHeaders } }
}

// Makes the API request. Get user session from Secure store, if available.
export default async function nodeJsApiRequest(options: RequestOptions): Promise<APIResponse> {
  // check if ARR Affinity was fetched

  let callOptions = await getOptions(options)

  // Call NodeJs API
  let response = await makeApiRequest(axiosNodeJs, callOptions)
  if (response.status === 401) {
    logger.info('Node.js session lost - will re-login, then retry...')
    await nodeJsSessionLost()

    // Try the call once again.
    callOptions = await getOptions(options)
    response = await makeApiRequest(axiosNodeJs, callOptions)
    logger.info(`response code after Node.js session retry: ${response.status}`)
  }

  // Pass on the whole response to caller
  return response
}
