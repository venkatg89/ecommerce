import { AnyAction } from 'redux'

import { CollectionId, CollectionModel } from 'src/models/CollectionModel'
import {
  COLLECTIONS_REMOVE_ONE_FOR_LOCAL_USER,
  COLLECTIONS_SET_ONE_FOR_LOCAL_USER,
  COLLECTIONS_SET_FOR_LOCAL_USER,
} from 'src/redux/actions/collections/apiActions'

export type LocalUserCollectionState = string[]

const DEFAULT: LocalUserCollectionState = []

export default (state: LocalUserCollectionState = DEFAULT, action: AnyAction): LocalUserCollectionState => {
  switch (action.type) {
    case COLLECTIONS_SET_FOR_LOCAL_USER: {
      const { payload } = action
      if (payload.collections) {
        return payload.collections.map(collection => collection.id)
      }
      return state
    }

    case COLLECTIONS_SET_ONE_FOR_LOCAL_USER: {
      const collection = action.payload as CollectionModel
      if (!state.includes(collection.id)) {
        return [...state, collection.id]
      }
      return state
    }

    case COLLECTIONS_REMOVE_ONE_FOR_LOCAL_USER: {
      const collectionId = action.payload as CollectionId
      return state.filter(e => e !== collectionId)
    }

    default: return state
  }
}
