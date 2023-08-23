import { State } from 'src/redux/reducers'

import { GlobalModals } from 'src/constants/globalModals'

import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'

export const openCafeOrderProgressModalAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    await dispatch(setActiveGlobalModalAction({ id: GlobalModals.CAFE_ORDER_PROGRESS }))
  }
