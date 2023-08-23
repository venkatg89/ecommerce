import { State } from 'src/redux/reducers'

import { RequestStatus } from 'src/models/ApiStatus'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import actionApiCall from 'src/helpers/redux/actionApiCall'

import {
  fetchFollowing,
  normalizeFollowingReponseData,
  milqFollowUser,
  milqUnfollowUser,
} from 'src/endpoints/milq/user/following'

import {
  getUserFollowingListSelector,
  myFollowedUserIdsSelector,
} from 'src/redux/selectors/userSelector'

export const SET_USER_FOLLOWING = 'USER__FOLLOWING_SET'
const setUserFollowing = makeActionCreator<{ uid: string; ids: string[] }>(
  SET_USER_FOLLOWING,
)
export const SET_MORE_USER_FOLLOWING = 'SET_MORE_FOLLOWING_SET'
const setMoreUserFollowing = makeActionCreator<{ uid: string; ids: string[] }>(
  SET_MORE_USER_FOLLOWING,
)

export const userFollowingListApiActions = makeApiActionsWithIdPayloadMaker(
  'userFollowingList',
  'USER__FOLLOWING',
)

export const fetchUserFollowingAction: (uid: string) => ThunkedAction<State> = (
  uid,
) => async (dispatch, getState) => {
  const status = getUserFollowingListSelector(getState(), { uid })
  if (status === RequestStatus.FETCHING) {
    return
  }

  const params = {
    uid,
    skip: 0,
  }

  const response = await actionApiCall(
    dispatch,
    userFollowingListApiActions(uid),
    () => fetchFollowing(params),
  )
  if (response.ok) {
    const data = normalizeFollowingReponseData(response.data)
    await dispatch(setUserFollowing({ uid, ...data }))
  }
}

export const fetchMoreUserFollowingAction: (
  uid: string,
) => ThunkedAction<State> = (uid) => async (dispatch, getState) => {
  const state: State = getState()
  const status = getUserFollowingListSelector(state, { uid })

  try {
    const { skip, canLoadMore } = state.listings.users.following[uid]

    if (!canLoadMore || status === RequestStatus.FETCHING) {
      return
    }

    const params = {
      uid,
      skip,
    }

    const response = await actionApiCall(
      dispatch,
      userFollowingListApiActions(uid),
      () => fetchFollowing(params),
    )
    if (response.ok) {
      const data = normalizeFollowingReponseData(response.data)
      await dispatch(setMoreUserFollowing({ uid, ...data }))
    }
  } catch (e) {
    /* */
  }
}

export const FOLLOW_USER = 'USER__USER_FOLLOW'
export const followUserComment = makeActionCreator<{ uid: string }>(FOLLOW_USER)
export const UNFOLLOW_USER = 'USER__USER_UNFOLLOW'
export const unfollowUserComment = makeActionCreator<{ uid: string }>(
  UNFOLLOW_USER,
)

export const toggleFollowUserAction: (uid: string) => ThunkedAction<State> = (
  uid,
) => async (dispatch, getState) => {
  const followedUserIds = myFollowedUserIdsSelector(getState())
  const followed = followedUserIds.includes(uid)

  if (followed) {
    const response = await milqUnfollowUser({ uid })
    if (response.ok) {
      await dispatch(unfollowUserComment({ uid }))
    }
  } else {
    const response = await milqFollowUser({ uid })
    if (response.ok) {
      await dispatch(followUserComment({ uid }))
    }
  }
}
