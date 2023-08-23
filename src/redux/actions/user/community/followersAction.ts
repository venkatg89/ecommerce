import { State } from 'src/redux/reducers'

import { RequestStatus } from 'src/models/ApiStatus'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import actionApiCall from 'src/helpers/redux/actionApiCall'

import {
  fetchFollowers, normalizeFollowersReponseData,
} from 'src/endpoints/milq/user/followers'

import { getUserFollowersListSelector } from 'src/redux/selectors/userSelector'

export const SET_USER_FOLLOWERS = 'USER__FOLLOWERS_SET'
const setUserFollowers = makeActionCreator<{uid: string, ids: string[]}>(SET_USER_FOLLOWERS)
export const SET_MORE_USER_FOLLOWERS = 'SET_MORE_FOLLOWERS_SET'
const setMoreUserFollowers = makeActionCreator<{uid: string, ids: string[]}>(SET_MORE_USER_FOLLOWERS)

export const userFollowersListApiActions =
  makeApiActionsWithIdPayloadMaker('userFollowersList', 'USER__FOLLOWERS')

export const fetchUserFollowersAction: (uid: string) => ThunkedAction<State> =
  uid => async (dispatch, getState) => {
    const status = getUserFollowersListSelector(getState(), { uid })
    if (status === RequestStatus.FETCHING) { return }

    const params = {
      uid,
      skip: 0,
    }

    const response = await actionApiCall(dispatch, userFollowersListApiActions(uid), () => fetchFollowers(params))
    if (response.ok) {
      const data = normalizeFollowersReponseData(response.data)
      await dispatch(setUserFollowers({ uid, ...data }))
    }
  }

export const fetchMoreUserFollowersAction: (uid: string) => ThunkedAction<State> =
  uid => async (dispatch, getState) => {
    const state: State = getState()
    const status = getUserFollowersListSelector(state, { uid })

    try {
      const { skip, canLoadMore } = state.listings.users.followers[uid]

      if (!canLoadMore || status === RequestStatus.FETCHING) { return }

      const params = {
        uid,
        skip,
      }

      const response = await actionApiCall(dispatch, userFollowersListApiActions(uid), () => fetchFollowers(params))
      if (response.ok) {
        const data = normalizeFollowersReponseData(response.data)
        await dispatch(setMoreUserFollowers({ uid, ...data }))
      }
    } catch (e) {
      /* */
    }
  }
