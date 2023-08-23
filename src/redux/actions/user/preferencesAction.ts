import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { ensureNoCallInProgress } from 'src/helpers/redux/checkApiCallState'

import actionApiCall from 'src/helpers/redux/actionApiCall'
import { getPreferences, editPreferences, normalizePreferencesResponse } from 'src/endpoints/milq/user/myPreferences'
import { ProfilePreferencesApiModel } from 'src/models/UserModel/MilqPreferences'
import { State } from 'src/redux/reducers'

// Ok to share API status actions.
export const preferencesApiActions = makeApiActions('getUserPreferences', 'USER__PREFERENCES_API')

// Setter for the info received via APIs
export const SET_USER_PREFERENCES = 'USER__PREFERENCES_SET'
const setUserPreferencesAction = makeActionCreator<ProfilePreferencesApiModel>(SET_USER_PREFERENCES)

// In Progress calls checker
const ensureNoOtherCall = (state: State) => ensureNoCallInProgress(
  preferencesApiActions.debugName, state.milq.api.preferences,
)

export const getPreferencesAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    if (ensureNoOtherCall(getState())) {
      const response = await actionApiCall(dispatch, preferencesApiActions, () => getPreferences())
      if (response.ok) {
        const normalizedResponse = normalizePreferencesResponse(response)
        await dispatch(setUserPreferencesAction(normalizedResponse))
      }
    }
  }

export const editPreferencesAction: (edits: ProfilePreferencesApiModel) => ThunkedAction<State> =
  edits => async (dispatch, getState) => {
    // BMA-316 - work around MilQ servers throwing 500 if an empty bio is sent over

    if (!ensureNoOtherCall(getState())) {
      await dispatch({
        ...preferencesApiActions.actions.failed,
        payload: {
          error: 'There\'s already an ongoing request. Please wait for a few seconds and retry!',
        },
      })
      return
    }

    const editsPatched = { ...edits }
    if (typeof edits.description === 'string' && edits.description!.length === 0) {
      editsPatched.description = ' ' // Will be trimmed to '' when loaded back.
    }

    const response = await actionApiCall(dispatch, preferencesApiActions, () => editPreferences(editsPatched))
    if (response.ok) {
      if (editsPatched.image) {
        // delay needed when profile image was changed, to allow propagation on the server-side
        await new Promise(r => setTimeout(r, 1300))
      }
      const normalizedResponse = normalizePreferencesResponse(response)
      await dispatch(setUserPreferencesAction(normalizedResponse))
    }
  }
