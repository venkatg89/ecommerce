import makeActionCreator from 'src/helpers/redux/makeActionCreator'

export const REDUX_APP_START = 'REDUX__APP_START'
export const reduxAppIsStartingAction = makeActionCreator(REDUX_APP_START)
