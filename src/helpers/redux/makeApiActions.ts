import { Action } from 'redux'

/*
 API call status actions are very tedious to write manually...
 This helper creates all the actions + their type strings in one go.
*/

type SingleIdOrArray = string | string[]

export interface ApiAction extends Action {
  payload?: {
    id: SingleIdOrArray
  }
}

export interface ApiCallStatusActions {
  debugName: string // To group all these actions to a paricular API endpoint name.
  types: ApiActionTypes
  actions: ApiReduxActions
  id?: string
}

export interface ApiActionTypes {
  inProgress: string
  success: string
  failed: string
  clear: string
}

export interface ApiReduxActions {
  inProgress: ApiAction
  success: ApiAction
  failed: ApiAction
  clear: ApiAction
}

export const makeApiActions = (debugName: string, prefix: string): ApiCallStatusActions => {
  const inProgressStr = `API_${prefix}_IN_PROGRESS`
  const successStr = `API_${prefix}_SUCCESS`
  const failedStr = `API_${prefix}_FAILED`
  const clearStr = `API_${prefix}_CLEAR_API`
  return {
    debugName,
    types: {
      inProgress: inProgressStr,
      success: successStr,
      failed: failedStr,
      clear: clearStr,
    },
    actions: {
      inProgress: ({ type: inProgressStr }),
      success: ({ type: successStr }),
      failed: ({ type: failedStr }),
      clear: ({ type: clearStr }),
    },
  }
}

export const makeApiActionsWithIdPayloadMaker =
(debugName: string, prefix: string) => (id?: SingleIdOrArray) : ApiCallStatusActions => {
  const inProgressStr = `API_${prefix}_IN_PROGRESS`
  const successStr = `API_${prefix}_SUCCESS`
  const failedStr = `API_${prefix}_FAILED`
  const clearStr = `API_${prefix}_CLEAR_API`
  return {
    debugName,
    types: {
      inProgress: inProgressStr,
      success: successStr,
      failed: failedStr,
      clear: clearStr,
    },
    actions: {
      inProgress: id ? { type: inProgressStr, payload: { id } } : { type: inProgressStr },
      success: id ? { type: successStr, payload: { id } } : { type: successStr },
      failed: id ? { type: failedStr, payload: { id } } : { type: failedStr },
      clear: id ? { type: clearStr, payload: { id } } : { type: clearStr },
    },
    ...(id && { id: id.toString() }),
  }
}
