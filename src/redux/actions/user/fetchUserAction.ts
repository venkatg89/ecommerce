// import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { fetchProfileAction } from './profileAction'
import { fetchAtgAccountAction } from './atgAccountAction'
import { fetchNodeProfileAction } from './nodeProfileActions'
import { fetchFavoriteCommunitiesAction } from './community/favoriteCategoriesAction'

import { State } from 'src/redux/reducers'

// export const userUserApiStatusActions = makeApiActionsWithIdPayloadMaker('userUser', 'USER__USER')
// export const userMeApiStatusAction = makeApiActions('userMe', 'USER__ME')

export const fetchUserAction: (milqId?: string) => ThunkedAction<State> = (
  milqId,
) => async (dispatch, getState) => {
  // if there is milqId, then assume general user, otherwise fetch yourself
  if (milqId) {
    await Promise.all([
      dispatch(fetchProfileAction(milqId)),
      dispatch(fetchNodeProfileAction(milqId)),
      dispatch(fetchFavoriteCommunitiesAction(milqId)),
    ])
  } else {
    await Promise.all([
      dispatch(fetchProfileAction()),
      dispatch(fetchAtgAccountAction()),
      dispatch(fetchNodeProfileAction()),
      dispatch(fetchFavoriteCommunitiesAction()),
    ])
  }
}
