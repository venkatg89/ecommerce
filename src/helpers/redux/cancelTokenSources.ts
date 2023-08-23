import axios, { CancelTokenSource } from 'axios'

import { ApiCallStatusActions } from './makeApiActions'

const cancelTokenSources: Record<string, CancelTokenSource> = {}

export const createNewCancelTokenSource = (): CancelTokenSource => axios.CancelToken.source()

export const makeRequestKeyFromActions = (actions: ApiCallStatusActions): string => {
  const key = actions.debugName
  return actions.id
    ? `${key}:${actions.id}`
    : key
}

export const setCancelTokenForRequestKey = (cancelTokenSource: CancelTokenSource, requestKey?: string) => {
  if (requestKey) {
    cancelTokenSources[requestKey] = cancelTokenSource
  }
}

export const deleteCancelTokenForRequestKey = (requestKey?: string) => {
  if (requestKey) {
    delete cancelTokenSources[requestKey]
  }
}

export const cancelApiRequestFromActions = async (actions: ApiCallStatusActions) => {
  const key = makeRequestKeyFromActions(actions)
  const cancelTokenSource = cancelTokenSources[key]
  if (cancelTokenSource) {
    cancelTokenSource.cancel()
    delete cancelTokenSources[key]
  }
}
