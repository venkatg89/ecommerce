import { Dispatch } from 'redux'
import { State } from 'src/redux/reducers'

import { ApiCallStatusActions } from './makeApiActions'

import { CANCELLED_INSTANCE_STATUS_CODE } from 'src/models/ApiStatus'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

export default async (dispatch: Dispatch<State>, actions: ApiCallStatusActions,
  performCall: () => Promise<APIResponse>): (Promise<APIResponse>) => {
  const errorMessage = 'Oops, something went wrong!\nPlease try again.'
  try {
    await dispatch(actions.actions.inProgress)
    const resp = await performCall()
    // currently when we cancel, it's because we want to make a new request and
    // not have a "FAILED" response TODO: add a cancelled action
    if (resp.status === CANCELLED_INSTANCE_STATUS_CODE) { return resp }
    if (resp.ok) {
      await dispatch(actions.actions.success)
      return resp
    }

    await dispatch({
      type: actions.actions.failed.type,
      payload: {
        ...(actions.actions.failed.payload),
        error: (resp && resp.data && resp.data.response && resp.data.response.message) || errorMessage,
      },
    })
    return resp
  } catch (e) {
    logger.error(`Exception during an Api Call: ${e}`)
    await dispatch({
      type: actions.actions.failed.type,
      payload: {
        ...(actions.actions.failed.payload),
        error: errorMessage,
      },
    })
    const resp: APIResponse = {
      ok: false,
      status: 0,
      data: `${e}`,
      error: e,
      headers: undefined,
    }
    return resp
  }
}
