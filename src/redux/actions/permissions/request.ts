import { State } from 'src/redux/reducers'

import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { GlobalModals } from 'src/constants/globalModals'

type Permissions = 'location' | 'calendar' | 'camera' | 'locationStore'

export const permissionDeniedAction: (permission: Permissions) => ThunkedAction<State> =
    permission => async (dispatch, getState) => {
      switch (permission) {
        case 'calendar': {
          dispatch(setActiveGlobalModalAction({ id: GlobalModals.CALENDAR_PERMISSION }))
          break
        }
        case 'location': {
          dispatch(setActiveGlobalModalAction({ id: GlobalModals.LOCATION_PERMISSION }))
          break
        }
        case 'locationStore': {
          dispatch(setActiveGlobalModalAction({ id: GlobalModals.LOCATION_PERMISSION_STORE }))
          break
        }
        case 'camera': {
          dispatch(setActiveGlobalModalAction({ id: GlobalModals.CAMERA_PERMISSION }))
          break
        }
        default:
          break
      }
    }
