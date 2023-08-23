import { ThunkAction } from 'redux-thunk'

import { GlobalModals } from 'src/constants/globalModals'
import { State } from 'src/redux/reducers'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'

export const checkCafeEnabledBreakAction: () => ThunkAction<Boolean, State, void> = () => (dispatch, getState) => {
  const state = getState()

  if (state.user.nodeProfile?.cafeEnabled) {
    return false
  }

  dispatch(setActiveGlobalModalAction({ id: GlobalModals.CAFE_DISABLED }))
  return true
}
