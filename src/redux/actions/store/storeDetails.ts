import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { State } from 'src/redux/reducers'

import { RequestStatus } from 'src/models/ApiStatus'
import {
  storeGetStoreDetails,
  normalizeGetStoreDetailsResponseData,
} from 'src/endpoints/storeGateway/storeDetails'
import { storeDetailsApiStatusSelector } from 'src/redux/selectors/myBn/storeSelector'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

export const SET_STORE_DETAILS = 'STORES__STORE_DETAILS_SET'
const setStoreDetails = makeActionCreator(SET_STORE_DETAILS)

export const setStoreDetailsApiStatusActions = makeApiActionsWithIdPayloadMaker(
  'storeDetails',
  'STORE__DETAILS',
)

export const fetchStoreDetailsAction: (
  storeId: string,
) => ThunkedAction<State> = (storeId) => async (dispatch, getState) => {
  const status = storeDetailsApiStatusSelector(getState(), { storeId })
  if (status === RequestStatus.FETCHING) {
    return
  }
  await dispatch(setStoreDetailsApiStatusActions(storeId).actions.inProgress)
  const response = await storeGetStoreDetails({ storeId })
  if (response.ok && response.data && !response.data.errors) {
    const payload = normalizeGetStoreDetailsResponseData(response.data)
    await dispatch(setStoreDetails(payload))
    await dispatch(setStoreDetailsApiStatusActions(storeId).actions.success)
  } else {
    await dispatch(setStoreDetailsApiStatusActions(storeId).actions.failed)
    logger.warn(`fetchStoreDetailsAction(storeId: ${storeId}) failed`)
  }
}
