import { State } from 'src/redux/reducers'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import { getCollections, normalizeCollectionListReponse } from 'src/endpoints/nodeJs/collections'

import {
  collectionsByMilqUserIdApiAction, ensureNoOtherCallForMilqUserId,
  collectionsForLocalUserApiActions, ensureNoOtherCallForMyCollectionList,
  collectionsSetForLocalUserAction, collectionsSetForMilqUserAction, CollectionsForMilqUser,
} from './apiActions'


export const fetchCollectionsForMilqUserIdAction: (milqUserId: string) => ThunkedAction<State>
  = milqUserId => async (dispatch, getState) => {
    if (ensureNoOtherCallForMilqUserId(getState(), milqUserId)) {
      const apiActions = collectionsByMilqUserIdApiAction(milqUserId)
      const response = await actionApiCall(dispatch, apiActions, () => getCollections(milqUserId))
      if (response.ok) {
        const { collections, books } = normalizeCollectionListReponse(response.data)
        const payload: CollectionsForMilqUser = {
          milqUserId,
          collections,
          books,
        }
        await dispatch(collectionsSetForMilqUserAction(payload))
      }
    }
  }

export const fetchCollectionsForLocalUserAction: () => ThunkedAction<State>
  = () => async (dispatch, getState) => {
    if (ensureNoOtherCallForMyCollectionList(getState())) {
      const response = await actionApiCall(dispatch, collectionsForLocalUserApiActions, () => getCollections())
      if (response.ok) {
        const { collections, books } = normalizeCollectionListReponse(response.data)
        dispatch(collectionsSetForLocalUserAction({ collections, books }))
      }
    }
  }
