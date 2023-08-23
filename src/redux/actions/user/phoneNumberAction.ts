import makeActionCreator from 'src/helpers/redux/makeActionCreator'

export const PHONE_NUMBER_FETCHING = 'PHONE_NUMBER_FETCHING'
export const PHONE_NUMBER_SUCCESS = 'PHONE_NUMBER_SUCCESS'
export const PHONE_NUMBER_FAILED = 'PHONE_NUMBER_FAILED'
export const PHONE_NUMBER_STARUS_RESET = 'RESET'

export const phoneNumberFetchingAction = makeActionCreator(
  PHONE_NUMBER_FETCHING,
)
export const phoneNumberSuccessAction = makeActionCreator(PHONE_NUMBER_SUCCESS)
export const phoneNumberFailedAction = makeActionCreator(PHONE_NUMBER_FAILED)

export const phoneNumberResetAction = makeActionCreator(
  PHONE_NUMBER_STARUS_RESET,
)

export default {
  PHONE_NUMBER_FETCHING,
  PHONE_NUMBER_SUCCESS,
  PHONE_NUMBER_FAILED,
  PHONE_NUMBER_STARUS_RESET,
}
