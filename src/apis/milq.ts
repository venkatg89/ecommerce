import { milqSessionLost } from './session/lost'
import { CANCELLED_INSTANCE_STATUS_CODE } from 'src/models/ApiStatus'

import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

const MAX_MILQ_TRIES = 3

// The Milq Production instance does searching for books faster
// and has a more complete set of books
export const milqBookSearchInstance = async (
  options: RequestOptions,
): Promise<APIResponse> => {
  // TODO REMOVEMILQ
  // return makeApiRequest(axiosMilqForBookSearch, options)
  const response = {
    ok: false,
    status: CANCELLED_INSTANCE_STATUS_CODE,
    data: null,
    error: null,
    headers: [],
  }
  return response
}

// Makes the API request. Get user session from Secure store, if available.
const milqRequest = async (
  options: RequestOptions,
  tryNo = 1,
): Promise<APIResponse> => {
  // Call Milq API
  // TODO REMOVEMILQ
  // const response = await makeApiRequest(axiosMilq, options)
  const response = {
    ok: false,
    status: CANCELLED_INSTANCE_STATUS_CODE,
    data: null,
    error: null,
    headers: [],
  }

  if (
    (response.status === 401 || response.status === 403) &&
    !options.endpoint.endsWith('logout')
  ) {
    if (tryNo <= MAX_MILQ_TRIES) {
      logger.info(
        `milqRequest: received ${response.status} on try ${tryNo}, will re-login then try again...`,
      )
      await milqSessionLost()
      // Try the call once again.
      return milqRequest(options, tryNo)
    }
    logger.warn(
      `milqRequest: received ${response.status} on try ${tryNo}, giving up`,
    )
    return response // as it is now, with the error
  }
  if (response.status >= 500 && response.status <= 599) {
    // Thse 500's tend pop-up simetimse
    if (tryNo <= MAX_MILQ_TRIES) {
      logger.info(
        `milqRequest: received ${response.status} on try ${tryNo}, will retry...`,
      )
      await milqRequest(options, tryNo + 1)
    } else {
      logger.warn(
        `milqRequest: received ${response.status} on try ${tryNo}, giving up`,
      )
      return response // as it is now, with the error
    }
  }

  // All proably ok - it was not 401, nor 403, nor 5xx
  return response
}

export default milqRequest
