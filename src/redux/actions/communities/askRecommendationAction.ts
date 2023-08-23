import { State } from 'src/redux/reducers'
import { askQuestion } from 'src/endpoints/milq/communities/askQuestion'
import { askForPushPermissionsIfWeHaveNotYet } from 'src/redux/actions/onboarding'
import Logger from 'src/helpers/logger'

export const askRecommendationAction: (communityId: number, title: string) => ThunkedAction<State, boolean> =
  (communityId, title) => async (dispatch, getState) => {
    const state: State = getState()
    const uid = state.user.profile && state.user.profile.uid || ''
    if (!uid) {
      Logger.getInstance().error('askRecommendationAction: no uid')
      return false
    }
    const response = await askQuestion({ communityId, title })
    if (response.ok) {
      // Ask for Push if we have not yet
      await dispatch(askForPushPermissionsIfWeHaveNotYet(true))
      return true
    }
    return false
  }
