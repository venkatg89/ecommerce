import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { milqGetRelations, normalizeMyRelationsResponseData } from 'src/endpoints/milq/user/myRelations'

import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'
import { State } from 'src/redux/reducers'

/*
 * Followed Member (3)
 * Liked Comment (6)
 * Followed Community (7)
 * Followed Question (9)
 * Followed Answer (10)
 */

export const SET_MY_RELATIONS = 'USER__MY_RELATIONS_SET'
const setMyRelations = makeActionCreator(SET_MY_RELATIONS)

export const fetchMyRelationsAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const state = getState()
    if (!state.milq.session.active) {
      return
    }

    const myUid = getMyProfileUidSelector(state)
    if (!myUid) { return }

    const response = await milqGetRelations(myUid)
    if (response.ok) {
      const payload = normalizeMyRelationsResponseData(response.data)
      await dispatch(setMyRelations(payload))
    }
  }
