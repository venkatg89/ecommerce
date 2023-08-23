import { State } from 'src/redux/reducers'

import { RequestStatus } from 'src/models/ApiStatus'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { storeGetStoreEvents, normalizeStoreEventsFromResponseData } from 'src/endpoints/storeGateway/events'

import { storeEventsApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/store'

export const SET_STORES_STORE_EVENTS = 'STORES__STORE_EVENTS_SET'
const setStoreEvents = makeActionCreator(SET_STORES_STORE_EVENTS)
export const SET_STORES_MORE_STORE_EVENTS = 'STORES__MORE_STORE_EVENTS_SET'
const setMoreStoreEvents = makeActionCreator(SET_STORES_MORE_STORE_EVENTS)

export const storeEventsApiStatusActions =
  makeApiActionsWithIdPayloadMaker('storeEvents', 'STORE__EVENTS')

export const fetchStoreEventsAction: (storeId: string) => ThunkedAction<State> =
  storeId => async (dispatch, getState) => {
    const status = storeEventsApiRequestStatusSelector(getState(), { storeId })
    if (status === RequestStatus.FETCHING) { return }

    await dispatch(storeEventsApiStatusActions(storeId).actions.inProgress)

    const response = await storeGetStoreEvents({ storeId })
    if (response.ok) {
      const payload = normalizeStoreEventsFromResponseData(response.data)
      await dispatch(setStoreEvents({ storeId, ...payload }))
    }

    await dispatch(storeEventsApiStatusActions(storeId).actions.success)
  }

export const fetchMoreStoreEventsAction: (storeId: string) => ThunkedAction<State> =
  storeId => async (dispatch, getState) => {
    const state: State = getState()
    const status = storeEventsApiRequestStatusSelector(state, { storeId })
    const { skip, canLoadMore } = state.listings.store.storeEvents[storeId]
    if (!canLoadMore || status === RequestStatus.FETCHING) { return }

    await dispatch(storeEventsApiStatusActions(storeId).actions.inProgress)

    const params = {
      storeId,
      skip,
    }

    const response = await storeGetStoreEvents(params)
    if (response.ok) {
      const payload = normalizeStoreEventsFromResponseData(response.data)
      await dispatch(setMoreStoreEvents({ storeId, ...payload }))
    }

    await dispatch(storeEventsApiStatusActions(storeId).actions.success)
  }
