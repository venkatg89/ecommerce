import { Reducer } from 'redux'

import { SET_ACTIVE_GLOBAL_MODAL, DISMISS_GLOBAL_MODAL } from 'src/redux/actions/modals/globalModals'

export type ActiveGlobalModalState = Nullable<string>

const DEFAULT: ActiveGlobalModalState = null

const activeGlobalModal: Reducer<ActiveGlobalModalState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_ACTIVE_GLOBAL_MODAL: {
      const { id } = action.payload
      return id
    }

    case DISMISS_GLOBAL_MODAL: {
      return DEFAULT
    }

    default:
      return state
  }
}

export default activeGlobalModal
