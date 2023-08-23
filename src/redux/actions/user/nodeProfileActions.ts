import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { makeApiActions, makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import { ensureNoCallInProgress } from 'src/helpers/redux/checkApiCallState'

import { getNodeJsProfile, getNookLocker } from 'src/endpoints/nodeJs/profile'
import { normalizeNodeJsProfileReply, normalizeNookLocker } from 'src/helpers/api/node/profile'

import { ReadingStatusListUpdate } from 'src/models/ReadingStatusModel'
import { NodeProfileModel } from 'src/models/UserModel/NodeProfileModel'
import { State } from 'src/redux/reducers'
import { Ean, BookModel } from 'src/models/BookModel'

import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'


interface SetNodeProfile {
  nodeProfile: NodeProfileModel
  books?: Record<Ean, BookModel>
}


export const SET_MY_NODE_PROFILE = 'MY_USER__NODE_PROFILE_SET'
export const SET_MILQ_USER_NODE_PROFILE = 'SET_MILQ_USER_NODE_PROFILE'
export const SET_NOT_INTERESTED = 'SET_NOT_INTERESTED'

export const setNotInterestedAction = makeActionCreator<Ean[]>(SET_NOT_INTERESTED)

export const SET_USER_NOOK_LIBRARY = 'SET_USER_NOOK_LIBRARY'

export const nookLockerApiActions = makeApiActions('nookLockerApiActions', 'NOOK_LOCKER_API_ACTIONS')
export const setUserNookLibraryAction = makeActionCreator(SET_USER_NOOK_LIBRARY)

const getReadingStatusBooksFromNodeProfile: (nodeProfile: NodeProfileModel) => Record<Ean, BookModel>
 = (nodeProfile: NodeProfileModel) => ({})

export const fetchNodeProfileAction: (uid?: string) => ThunkedAction<State> =
  uid => async (dispatch, getState) => {}

// editing
export const nodeProfileForLocalUserApiActions =
  makeApiActions('nodeProfileLocalUserApiAction', 'NODE_PROFILE__FOR_LOCAL_USER_API')

export const nodeProfileByMilqUserIdApiAction =
  makeApiActionsWithIdPayloadMaker('nodeProfileByMilqUserIdApiAction', 'NODE_PROFILE__FOR_MILQ_USER_API')

const ensureNoOtherCallForMyProfile = (state: State) => ensureNoCallInProgress(
  nodeProfileForLocalUserApiActions.debugName,
  state.nodeJs.api.myProfile,
)


export const nodeProfileForLocalUserSetAction = makeActionCreator<SetNodeProfile>(SET_MY_NODE_PROFILE)

export const fetchNodeProfileForLocalUserAction: () => ThunkedAction<State>
  = () => async (dispatch, getState) => {
    if (ensureNoOtherCallForMyProfile(getState())) {
      const response = await actionApiCall(dispatch, nodeProfileForLocalUserApiActions, () => getNodeJsProfile())
      if (response.ok) {
        const nodeProfile = normalizeNodeJsProfileReply(response.data)
        const readingStatusBooks = getReadingStatusBooksFromNodeProfile(nodeProfile)
        await dispatch(nodeProfileForLocalUserSetAction({ nodeProfile, books: readingStatusBooks }))
      }
    }
  }

export const updateReadingStatusAction: (updates: ReadingStatusListUpdate) => ThunkedAction<State>
  = updates => async (dispatch, getState) => {}

// Nook libary
export const fetchNookLockerAction: () => ThunkedAction<State>
  = () => async (dispatch, getState) => {
    const state = getState()

    // Nook locker can only be fetched via an ATG session
    if (!state.atg.session.loggedIn) {
      return
    }

    const milqUserId = getMyProfileUidSelector(state)
    try {
      const response = await actionApiCall(dispatch, nookLockerApiActions, () => getNookLocker())
      if (response.ok) {
        const { books, list } = normalizeNookLocker(response.data)
        await dispatch(setUserNookLibraryAction({ uid: milqUserId, nookList: list, books }))
      }
    } catch { /** */ }
  }
