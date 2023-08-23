import makeActionCreator from 'src/helpers/redux/makeActionCreator'

export const SET_PROGRESS_OPTION = 'SET_PROGRESS_OPTION'
export const RESET_PROGRESS_OPTION = 'RESET_PROGRESS_OPTION'

export const setProgressOption = makeActionCreator(SET_PROGRESS_OPTION)
export const resetProgress = makeActionCreator(RESET_PROGRESS_OPTION)
