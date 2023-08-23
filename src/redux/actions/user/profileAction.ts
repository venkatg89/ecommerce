import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { getMyProfile, normalizeMyProfileData } from 'src/endpoints/milq/user/myProfile'
import { fetchMember } from 'src/endpoints/milq/user/fetchMember'

import { ProfileModel } from 'src/models/UserModel'
import { MembersStatePayload } from 'src/redux/reducers/UsersReducer'
import { State } from 'src/redux/reducers'

// legacy
import { fetchMyFavoriteCommunitiesAction } from 'src/redux/actions/user/community/favoriteCategoriesAction'
import Logger from 'src/helpers/logger'
//

export const SET_MY_USER_PROFILE = 'MY_USER__PROFILE_SET'
export const SET_USERS_PROFILE = 'USERS__PROFILE_SET'

const setMyUserProfileAction = makeActionCreator<ProfileModel>(SET_MY_USER_PROFILE)
const setUsersProfileAction = makeActionCreator<MembersStatePayload>(SET_USERS_PROFILE)

export const fetchProfileAction: (uid?: string) => ThunkedAction<State> =
  uid => async (dispatch, getState) => {
    if (uid) {
      const response = await fetchMember(uid)
      if (response.ok) {
        const profile = normalizeMyProfileData(response.data)
        await dispatch(setUsersProfileAction({ uid, profile }))
      }
    } else {
      const response = await getMyProfile()
      if (response.ok) {
        const profile = normalizeMyProfileData(response.data)
        await dispatch(setMyUserProfileAction(profile))
      }
    }
  }

// legacy used for login
const logger = Logger.getInstance()

const setMyProfileAction = makeActionCreator<ProfileModel>(SET_MY_USER_PROFILE)

export const fetchMyProfileAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    try {
      const response = await Promise.all([
        getMyProfile(),
        dispatch(fetchMyFavoriteCommunitiesAction()),
      ])
      const profileResponse = response[0]

      if (profileResponse.ok) {
        await dispatch(setMyProfileAction(normalizeMyProfileData(profileResponse.data)))
      } else {
        logger.error(`Unable to fetchMysProfileAction. ${profileResponse.error}`)
      }
    } catch (e) {
      logger.error(`Exception to fetchMysProfileAction: ${e}`)
    }
  }
