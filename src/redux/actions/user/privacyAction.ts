import { State } from 'src/redux/reducers'

import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { updatePrivacy } from 'src/endpoints/nodeJs/profile'
import { PrivacyParams } from 'src/models/UserModel/NodeProfileModel'


export const SET_PRIVACY = 'SET_PRIVACY'
const setPrivacyAction = makeActionCreator(SET_PRIVACY)

export const updateProfileApiAction = makeApiActions(
  'privacy',
  'UPDATE__PRIVACY',
)

export const updatePrivacyAction: (privacyParam: PrivacyParams) => ThunkedAction<State> =
privacyParam => async (dispatch, getState) => {
  try {
    const response = await actionApiCall(dispatch, updateProfileApiAction, () => updatePrivacy(privacyParam))
    if (response.ok) {
      const privacy = response.data
      dispatch(setPrivacyAction(privacy))
    }
  } catch { /** */ }
}
