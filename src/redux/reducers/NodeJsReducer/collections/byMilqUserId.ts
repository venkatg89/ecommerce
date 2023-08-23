import { AnyAction } from 'redux'

import { COLLECTIONS_SET_FOR_MILQ_USER,
  CollectionsForMilqUser } from 'src/redux/actions/collections/apiActions'

export type ByMilqUserIdCollectionsState = Record<string, string[]>

const DEFAULT: ByMilqUserIdCollectionsState = {}

export default (state: ByMilqUserIdCollectionsState = DEFAULT,
  action: AnyAction): ByMilqUserIdCollectionsState => {
  switch (action.type) {
    case COLLECTIONS_SET_FOR_MILQ_USER: {
      const payload = action.payload as CollectionsForMilqUser
      const collectionIds = payload.collections.map(collection => collection.id)
      return {
        ...state,
        [payload.milqUserId]: collectionIds,
      }
    }

    default: return state
  }
}
