import { ThunkAction } from 'redux-thunk'

import { GlobalModals } from 'src/constants/globalModals'

import { State } from 'src/redux/reducers'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'

export const checkIsUserLoggedOutToBreakAction: () => ThunkAction<Boolean, State, void> = () => (dispatch, getState) => {
  const state = getState()

  if (isUserLoggedInSelector(state)) {
    return false
  }

  dispatch(setActiveGlobalModalAction({ id: GlobalModals.GUEST_USER }))
  return true
}
