import { State } from 'src/redux/reducers'

import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { ensureNoCallInProgress } from 'src/helpers/redux/checkApiCallState'
import { makeApiActions, makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'

import { CollectionId, CollectionModel } from 'src/models/CollectionModel'
import { BookModel, Ean } from 'src/models/BookModel'

// --- Interfaces for Actions ---
interface CollectionsForLocaUser {
  collections: CollectionModel[]
  books?: Record<Ean, BookModel>
}

export interface CollectionsForMilqUser extends CollectionsForLocaUser {
  milqUserId: string
}

// --- Api Status Actions ---
export const collectionsByMilqUserIdApiAction =
  makeApiActionsWithIdPayloadMaker('collectionsByMilqUserIdApiAction', 'COLLECTIONS__LIST_FOR_MILQ_USER_API')

export const collectionsForLocalUserApiActions =
  makeApiActions('localUserApiActions', 'COLLECTIONS__LIST_FOR_LOCAL_USER_API')

// --- Redux Setter Actions ---
export const COLLECTIONS_SET_ONE_FOR_LOCAL_USER = 'COLLECTIONS__SET_ONE_FOR_LOCAL_USER'
export const collectionsSetOneForLocalUserAction =
  makeActionCreator<CollectionModel>(COLLECTIONS_SET_ONE_FOR_LOCAL_USER)

export const COLLECTIONS_REMOVE_ONE_FOR_LOCAL_USER = 'COLLECTIONS__REMOVE_ONE_FOR_LOCAL_USER'
export const collectionsRemoveOneForLocalUserAction =
  makeActionCreator<CollectionId>(COLLECTIONS_REMOVE_ONE_FOR_LOCAL_USER)

export const COLLECTIONS_SET_FOR_LOCAL_USER = 'COLLECTIONS_SET_FOR_LOCAL_USER'
export const collectionsSetForLocalUserAction = makeActionCreator<CollectionsForLocaUser>(COLLECTIONS_SET_FOR_LOCAL_USER)

export const COLLECTIONS_SET_FOR_MILQ_USER = 'COLLECTIONS_SET_FOR_MILQ_USER'
export const collectionsSetForMilqUserAction = makeActionCreator<CollectionsForMilqUser>(COLLECTIONS_SET_FOR_MILQ_USER)


// --- Ensure no other calls are in progress ---
export const ensureNoOtherCallForMilqUserId = (state: State, milqUserId: string) => ensureNoCallInProgress(
  collectionsByMilqUserIdApiAction().debugName,
  state.nodeJs.api.collectionsByMilqUser[milqUserId],
)
export const ensureNoOtherCallForMyCollectionList = (state: State) => ensureNoCallInProgress(
  collectionsForLocalUserApiActions.debugName,
  state.nodeJs.api.myCollections,
)
