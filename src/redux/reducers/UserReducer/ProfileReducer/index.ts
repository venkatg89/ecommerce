import { Reducer } from 'redux'

import { ProfileModel } from 'src/models/UserModel'
import { ProfilePreferencesApiModel } from 'src/models/UserModel/MilqPreferences'
import { SET_MY_USER_PROFILE } from 'src/redux/actions/user/profileAction'
import { SET_USER_PREFERENCES } from 'src/redux/actions/user/preferencesAction'
// import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

export type MilqProfileState = Nullable<ProfileModel>

const DEFAULT: MilqProfileState = null

// const BLANK: MilqProfileState = {
//   name: '',
//   uid: '',
//   bio: '',
//   followingCount: 0,
//   followerCount: 0,
//   agreedAnswerCount: 0,
//   createdQuestionCount: 0,
//   image: '',
// }

const profileReducer: Reducer<MilqProfileState> = (state = DEFAULT, action) => {
  switch (action.type) {
    // case USER_SESSION_ESTABLISHED: {
    //   const payload = action.payload as LoggedInPayload
    //   if (payload.milq) {
    //     // set up some data for futher calls
    //     // the following get Profile will fetch the full data.
    //     return {
    //       ...BLANK,
    //       name: payload.milq.name,
    //       uid: payload.milq.uid,
    //     }
    //   }
    //   return state
    // }

    case SET_MY_USER_PROFILE: {
      const profile: MilqProfileState = action.payload
      return profile
    }

    case SET_USER_PREFERENCES: {
      // There's a bit of User Profile info that comes back with preferences
      // - set some of the existing state with this info
      const preferences: ProfilePreferencesApiModel = action.payload
      return state ? // Don't augment if there's no profile to augment
        {
          ...state,
          bio: preferences.description || '',
          name: preferences.name || '',
          image: preferences.image || '',
        } :
        state
    }

    default:
      return state
  }
}

export default profileReducer
