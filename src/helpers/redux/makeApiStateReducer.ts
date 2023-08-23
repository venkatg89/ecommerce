import { AnyAction } from 'redux'

import { ApiStatus, ApiStatusDict, RequestStatus } from 'src/models/ApiStatus'
import { ApiAction, ApiActionTypes } from 'src/helpers/redux/makeApiActions'

import { REDUX_APP_START } from 'src/redux/actions/startup/appIsStarting'

// This is our config, not npm's config
import config from 'config'

const DEFAULT: ApiStatus = {
  requestStatus: null,
  dateStated: null,
  dateCompleted: null,
  error: null,
}

const DEFAULT_DICT: ApiStatusDict = {}

// Older - we can depricate calling this one directly
export const makeApiStatusReducerUsingActionNames =
(actionFetch: string, actionSuccess: string, actionError: string, actionClear?: string) => (state: ApiStatus = DEFAULT, action: AnyAction) // eslint-disable-line
: ApiStatus => {
  if (actionClear && action.type === actionClear) { // since this is still shared with login, actionClear is optional
    return DEFAULT
  }

  switch (action.type) {
    case REDUX_APP_START: {
      // Depends if we're crearing the caches
      if (config.redux.clearStateOnReset) {
        // Just clear it all.
        return DEFAULT
      }
      // Any non-completed calls are set to failed
      if (state && state.requestStatus === RequestStatus.FETCHING) {
        return {
          ...state,
          requestStatus: RequestStatus.FAILED, // Since it never completed
        }
      }


      return state
    }

    case actionFetch: return {
      requestStatus: RequestStatus.FETCHING,
      dateStated: new Date(),
      dateCompleted: null,
      error: null,
    }
    case actionSuccess: return {
      ...state,
      dateCompleted: new Date(),
      requestStatus: RequestStatus.SUCCESS,
    }
    case actionError: return {
      ...state,
      dateCompleted: new Date(),
      requestStatus: RequestStatus.FAILED,
      error: (action.payload && action.payload.error) || '',
    }
    default:
      return state
  }
}

// New and using ApiCallStatusActions.
export const makeApiStatusReducerUsingApiAction =
(apiCallStatusActionTypes: ApiActionTypes) => makeApiStatusReducerUsingActionNames(
  apiCallStatusActionTypes.inProgress,
  apiCallStatusActionTypes.success,
  apiCallStatusActionTypes.failed,
  apiCallStatusActionTypes.clear,
)

export const makeDictionaryApiStatusReducerUsingApiAction = (apiCallStatusActionTypes: ApiActionTypes) => {
  const singleObjReducer = makeApiStatusReducerUsingApiAction(apiCallStatusActionTypes)
  return (state: ApiStatusDict = DEFAULT_DICT, action: AnyAction): Record<string, ApiStatus> => {
    if (!action.payload || (action.payload && !action.payload.id)) {
      if (action.type === REDUX_APP_START) { // on start of app
        if (config.redux.clearStateOnReset) {
          return {}
        }
        const result: Record<string, ApiStatus> = {}
        Object.keys(state).forEach((id) => {
          if (state[id].requestStatus === RequestStatus.FETCHING) {
            result[id] = { ...state[id], requestStatus: RequestStatus.FAILED }
          } else {
            result[id] = { ...state[id] }
          }
        })
        return result
      }
      return (action.type === apiCallStatusActionTypes.clear)
        ? DEFAULT_DICT
        : state // incase we forget to pass in an id
    }
    switch (action.type) {
      case apiCallStatusActionTypes.inProgress:
      case apiCallStatusActionTypes.success:
      case apiCallStatusActionTypes.failed:
      case apiCallStatusActionTypes.clear: {
        const idInPayload = (action as ApiAction).payload!.id
        const ids = Array.isArray(idInPayload) ? idInPayload : [idInPayload]
        const newStates = {}
        ids.forEach((id) => {
          newStates[id] = singleObjReducer(state[id], action)
        })
        return { ...state, ...newStates }
      }
      default: return state
    }
  }
}
