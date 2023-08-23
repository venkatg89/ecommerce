import { State } from 'src/redux/reducers'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import { createCollection, deleteCollection, updateCollection,
  normalizeSingleCollectionResponse } from 'src/endpoints/nodeJs/collections'
import { CollectionId, CollectionEditModel } from 'src/models/CollectionModel'

import {
  collectionsForLocalUserApiActions, collectionsSetOneForLocalUserAction, ensureNoOtherCallForMyCollectionList, collectionsRemoveOneForLocalUserAction,
} from './apiActions'
import { bookSelector } from 'src/redux/selectors/booksListSelector'


export const createCollectionAction: (name: string) => ThunkedAction<State, Nullable<string>>
  = name => async (dispatch, getState) => {
    if (ensureNoOtherCallForMyCollectionList(getState())) {
      const response = await actionApiCall(
        dispatch, collectionsForLocalUserApiActions, () => createCollection(name),
      )
      if (response.ok) {
        const normalizedResponse = normalizeSingleCollectionResponse(response.data)
        await dispatch(collectionsSetOneForLocalUserAction(normalizedResponse))
        return normalizedResponse.id
      }
    }
    return null
  }

export const updateCollectionAction: (collectionId: CollectionId, _updates: CollectionEditModel) => ThunkedAction<State>
  = (collectionId, _updates) => async (dispatch, getState) => {
    const state = getState()
    const updates = { ..._updates }
    if (_updates.books) {
      updates.books = Object.keys(_updates.books).reduce((books, ean) => {
        if (!_updates.books![ean]) {
          return { ...books, [ean]: null }
        }
        const book = bookSelector(state, { ean })
        return { ...books, [ean]: book }
      }, {})
    }
    if (ensureNoOtherCallForMyCollectionList(getState())) {
      const response = await actionApiCall(
        dispatch, collectionsForLocalUserApiActions, () => updateCollection(collectionId, updates),
      )
      if (response.ok) {
        const normalizedResponse = normalizeSingleCollectionResponse(response.data)
        await dispatch(collectionsSetOneForLocalUserAction(normalizedResponse))
      }
    }
  }

export const updateCollectionsAction: (updatesByCollection:
  Record<CollectionId, CollectionEditModel>) => ThunkedAction<State>
    = updatesByCollection => async (dispatch, getState) => {
      if (ensureNoOtherCallForMyCollectionList(getState())) {
        await actionApiCall(
          dispatch, collectionsForLocalUserApiActions, async () => {
            const promises = Object.keys(updatesByCollection).map(id => updateCollection(id, updatesByCollection[id]))
            const responses = (await Promise.all(promises))
            await Promise.all(
              responses.map((response) => {
                const normalizedResponse = normalizeSingleCollectionResponse(response.data)
                return dispatch(collectionsSetOneForLocalUserAction(normalizedResponse))
              }),
            )

            return responses[0]
          },
        )
      }
    }

export const deleteCollectionAction: (collectionId: CollectionId) => ThunkedAction<State>
 = collectionId => async (dispatch, getState) => {
   if (ensureNoOtherCallForMyCollectionList(getState())) {
     const response = await actionApiCall(
       dispatch, collectionsForLocalUserApiActions, () => deleteCollection(collectionId),
     )
     if (response.ok) {
       await dispatch(collectionsRemoveOneForLocalUserAction(collectionId))
     }
   }
 }
