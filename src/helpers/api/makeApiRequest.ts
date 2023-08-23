import { AxiosInstance } from 'axios'
import { splitCookiesString } from 'set-cookie-parser'

import Logger from 'src/helpers/logger'
import {
  createNewCancelTokenSource,
  deleteCancelTokenForRequestKey,
  setCancelTokenForRequestKey,
} from 'src/helpers/redux/cancelTokenSources'
import { CANCELLED_INSTANCE_STATUS_CODE } from 'src/models/ApiStatus'
import EventEmitter from 'eventemitter3'
import { AtgCookiesStore } from 'src/apis/session/sessions'
import config from 'config'
import CookieManager from '@react-native-cookies/cookies'

export const backOnlineEventEmitter = new EventEmitter()
export const updateApiStatusEvent = 'updateApiStatus'

const logger = Logger.getInstance()
let counter = 0

const summarizeData = (response) => {
  if (response && response.data) {
    if (typeof response.data === 'object') {
      if (Array.isArray(response.data)) {
        if (response.data.length) {
          const firstMember =
            typeof response.data[0] === 'object'
              ? `'s keys { ${Object.keys(response.data[0])} }`
              : ` is of type '${typeof response.data[0]}'`
          return `array[${response.data.length}], first member${firstMember}`
        }
        return 'empty array.'
      }
      return `keys ${Object.keys(response.data)}`
    }
    if (typeof response.data === 'string') {
      return `string of ${response.data.length} chars`
    }
    return `is of type '${typeof response.data}'`
  }
  return '(no data)'
}

export default async function makeApiRequest(
  instance: AxiosInstance,
  options: RequestOptions,
): Promise<APIResponse> {
  const reqNo = counter
  counter += 1
  const requestSummary = `${options.method}: ${instance.defaults.baseURL}${
    options.endpoint
  } ${options.params || ''}`

  logger.info(`req #${reqNo} ${requestSummary} `, false)
  const startTime = new Date().getTime()

  try {
    const requestTokenSource = createNewCancelTokenSource()
    setCancelTokenForRequestKey(requestTokenSource, options.requestKey)

    // flush the cookies from native managers incase
    await CookieManager.clearAll()
    const axiosConfig = {
      method: options.method,
      url: options.endpoint,
      headers: options.headers,
      params: options.params,
      data: options.data,
      ...(options.requestKey && { cancelToken: requestTokenSource.token }),
    };

    // there seems to be a typing issue with 19beta of axios, lets ignore this for now
    // @ts-ignore
    const response = await instance(axiosConfig)

    // Update incoming cookies
    if (
      response.config &&
      response.config.baseURL &&
      response.config.baseURL.includes(config.api.atgGateway.baseUrl) &&
      options.endpoint !== '/type-ahead/typeahead' &&
      options.endpoint !== '/global/getBNAppHomePageDetails' &&
      options.endpoint !== '/global/getTopNavDetails' &&
      options.endpoint !== '/my-account/getSecretQuestions' &&
      options.endpoint !== '/my-account/createUser' && // use node sso to get session
      options.endpoint !== '/my-account/logout' // get new guest session instead
    ) {
      await CookieManager.clearAll()
      const newCookies = response.headers['set-cookie']
      if (newCookies && newCookies[0]) {
        console.log(`**UPDATE COOKIES** - ${newCookies[0]} from ${options.endpoint} - Status - ${response.status}`)
        // RN returns all cookies within a single string, break it up properly into *array* of cookie values
        const splitCookieHeaders = splitCookiesString(newCookies[0])
        await AtgCookiesStore.set(splitCookieHeaders)
      }
    }

    deleteCancelTokenForRequestKey(options.requestKey) // remove the token when request is complete

    const tookMs = new Date().getTime() - startTime
    logger.info(
      `req #${reqNo} @ ${tookMs}ms is ${
        response.status
      }, response.data: ${summarizeData(response)}`,
      false,
    )

    // Help the app realize it's back online by emitting this event
    if (response.status === 200 || response.status === 201) {
      backOnlineEventEmitter.emit(updateApiStatusEvent, true)
    }

    return {
      ok: true,
      status: response.status,
      data: response.data,
      headers: response.headers,
    }
  } catch (error) {
    deleteCancelTokenForRequestKey(options.requestKey) // remove the token when request is complete
    // https://github.com/axios/axios/issues/1330#issuecomment-378961682
    // https://github.com/axios/axios/blob/405fe690f93264d591b7a64d006314e2222c8727/lib/cancel/isCancel.js
    // axios instances don't have isCancel method included, instead we manually check the values for cancellation
    if (error.__CANCEL__) {
      const tookMs = new Date().getTime() - startTime
      logger.info(
        `req ${reqNo} @ ${tookMs}ms is Cancelled - ${requestSummary}`,
        false,
      )
      return {
        ok: false,
        status: CANCELLED_INSTANCE_STATUS_CODE,
        data: null,
        error: error.response ? error.response.data : null,
        headers: [],
      }
    }

    const tookMs = new Date().getTime() - startTime
    logger.warn(
      `req #${reqNo} @ ${tookMs}ms has Failed - ${requestSummary} - ${error}`,
    )

    return {
      ok: false,
      status: error.response ? error.response.status : 0,
      data: error.response ? error.response.data : null,
      error: error.response ? error.response.data : null,
      headers: error.response ? error.response.headers : [],
    }
  }
}
