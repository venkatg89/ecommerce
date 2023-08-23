import { combineReducers } from 'redux'
import { makeApiStatusReducerUsingApiAction,
  makeDictionaryApiStatusReducerUsingApiAction } from 'src/helpers/redux/makeApiStateReducer'

import { ApiStatus } from 'src/models/ApiStatus'
import { collectionsByMilqUserIdApiAction,
  collectionsForLocalUserApiActions } from 'src/redux/actions/collections/apiActions'
import { nodeProfileByMilqUserIdApiAction,
  nodeProfileForLocalUserApiActions, nookLockerApiActions } from 'src/redux/actions/user/nodeProfileActions'
import { clearNotInterestedList, setBookAsNotInterestedActions } from 'src/redux/actions/legacyHome/markBookAsNotInterestedAction'
import { historyApiAction } from 'src/redux/actions/legacyHome/social/notificationsActions'
import { updateProfileApiAction } from 'src/redux/actions/user/privacyAction'


export interface ApiState {
  collectionsByMilqUser: Record<string, ApiStatus>
  myCollections: ApiStatus
  profilesByMilqUser: Record<string, ApiStatus>
  myProfile: ApiStatus
  notInterested: ApiStatus
  historyNotifications: ApiStatus
  clearNotInterested: ApiStatus
  nookLocker: ApiStatus
  privacy: ApiStatus
}

export default combineReducers({
  collectionsByMilqUser: makeDictionaryApiStatusReducerUsingApiAction(collectionsByMilqUserIdApiAction().types),
  myCollections: makeApiStatusReducerUsingApiAction(collectionsForLocalUserApiActions.types),
  profilesByMilqUser: makeDictionaryApiStatusReducerUsingApiAction(nodeProfileByMilqUserIdApiAction().types),
  myProfile: makeApiStatusReducerUsingApiAction(nodeProfileForLocalUserApiActions.types),
  notInterested: makeApiStatusReducerUsingApiAction(setBookAsNotInterestedActions.types),
  historyNotifications: makeApiStatusReducerUsingApiAction(historyApiAction.types),
  clearNotInterested: makeApiStatusReducerUsingApiAction(clearNotInterestedList.types),
  nookLocker: makeApiStatusReducerUsingApiAction(nookLockerApiActions.types),
  privacy: makeApiStatusReducerUsingApiAction(updateProfileApiAction.types),
})
