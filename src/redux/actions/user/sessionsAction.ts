import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'

export const SET_USER_SESSION = 'MY_USER__SET_SESSION'

const setUserSession = makeActionCreator(SET_USER_SESSION)

export const setUserSessionAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    await dispatch(setUserSession())
  }

export const ATG_USER_DEACTIVATE_SESSION = 'ATG_USER_SESSION__DEACTIVATE'
export const deactiveAtgSessionAction = makeActionCreator(ATG_USER_DEACTIVATE_SESSION)
