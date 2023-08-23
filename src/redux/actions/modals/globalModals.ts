import makeActionCreator from 'src/helpers/redux/makeActionCreator'

export const SET_ACTIVE_GLOBAL_MODAL = 'GLOBAL_MODAL__ACTIVE_SET'
export const setActiveGlobalModalAction = makeActionCreator<{ id: string }>(SET_ACTIVE_GLOBAL_MODAL)

export const DISMISS_GLOBAL_MODAL = 'GLOBAL_MODAL__DISMISS'
export const dismissGlobalModalAction = makeActionCreator(DISMISS_GLOBAL_MODAL)
