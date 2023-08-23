import { State } from 'src/redux/reducers'
import {
  fetchInterests, normalizeCommunitiesCategoriesReponseData,
} from 'src/endpoints/milq/communities/fetchInterests'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'

export const SET_COMMUNITIES_ACTION = 'SET_COMMUNITIES_ACTION'

export const setCommunitiesAction = makeActionCreator(SET_COMMUNITIES_ACTION)

export const fetchCommunityInterestsAction: () => ThunkedAction<State> =
    () => async (dispatch, getState) => {
      // TODO replace with APIStatusState ?
      const { interests } = getState().communities
      if (Object.entries(interests).length > 0) {
        return
      }
      try {
        const response = await fetchInterests()
        if (response.ok) {
          await dispatch(setCommunitiesAction(normalizeCommunitiesCategoriesReponseData(response.data)))
        }
      } catch (e) { /**/ }
    }
