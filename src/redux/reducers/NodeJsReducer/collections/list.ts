import { AnyAction } from 'redux'

import { CollectionId, CollectionModel } from 'src/models/CollectionModel'

import {
  CollectionsForMilqUser,
  COLLECTIONS_SET_ONE_FOR_LOCAL_USER, COLLECTIONS_REMOVE_ONE_FOR_LOCAL_USER,
  COLLECTIONS_SET_FOR_LOCAL_USER, COLLECTIONS_SET_FOR_MILQ_USER,
} from 'src/redux/actions/collections/apiActions'

export type ColectionListState = Record<CollectionId, CollectionModel>

const DEFAULT: ColectionListState = {}

const collectionArrayToDictionary = (collections: CollectionModel[]) => {
  const result: Record<string, CollectionModel> = {}
  collections.forEach((collection) => {
    result[collection.id] = collection
  })
  return result
}

export default (state: ColectionListState = DEFAULT, action: AnyAction): ColectionListState => {
  switch (action.type) {
    case COLLECTIONS_SET_FOR_MILQ_USER: {
      const payload = action.payload as CollectionsForMilqUser
      return { ...state, ...collectionArrayToDictionary(payload.collections) }
    }

    case COLLECTIONS_SET_FOR_LOCAL_USER: {
      const { payload } = action
      if (payload.collections) {
        const { collections } = payload
        return {
          ...state, ...collectionArrayToDictionary(collections),
        }
      }
      return state
    }

    case COLLECTIONS_SET_ONE_FOR_LOCAL_USER: {
      const collection = action.payload as CollectionModel
      return { ...state, ...collectionArrayToDictionary([collection]) }
    }

    case COLLECTIONS_REMOVE_ONE_FOR_LOCAL_USER: {
      const collectionId = action.payload as CollectionId
      const result = { ...state }
      delete result[collectionId]
      return result
    }

    default: return state
  }
}
