import { State } from 'src/redux/reducers'

import { fetchMember, fetchMembers, normalizeFetchMembersResponseData } from 'src/endpoints/milq/user/fetchMember'

import { Uid, ProfileModel } from 'src/models/UserModel'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import { normalizeMyProfileData } from 'src/endpoints/milq/user/myProfile'

export const SET_MEMBER_ACTION = 'SET_MEMBER_ACTION'
export const setMemberAction = makeActionCreator(SET_MEMBER_ACTION)

export const SET_MEMBERS_ACTION = 'SET_MEMBERS_ACTION'
export const setMembersAction = makeActionCreator(SET_MEMBERS_ACTION)

export const fetchMemberApiActions = makeApiActions('fetchMembers', 'PROFILE_MEMBERS')

export const fetchMemberAction: (uid: Uid) => ThunkedAction<State> =
  uid => async (dispatch, getState) => {
    const response = await fetchMember(uid)
    if (response.ok) {
      const id = response.data.uid
      const member: ProfileModel = normalizeMyProfileData(response.data)
      await dispatch(setMemberAction({ uid: id, member }))
    }
  }

export const fetchMembersAction: (uids: Uid[]) => ThunkedAction<State> =
  uids => async (dispatch, getState) => {
    const response = await actionApiCall(dispatch, fetchMemberApiActions, () => fetchMembers(uids))
    if (response.ok) {
      const members = normalizeFetchMembersResponseData(response.data)
      await dispatch(setMembersAction({ members }))
    }
  }
