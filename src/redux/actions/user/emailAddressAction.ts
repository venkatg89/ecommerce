import makeActionCreator from 'src/helpers/redux/makeActionCreator'

export const EMAIL_ADDRESS_FETCHING = 'EMAIL_ADDRESS_FETCHING'
export const EMAIL_ADDRESS_SUCCESS = 'EMAIL_ADDRESS_SUCCESS'
export const EMAIL_ADDRESS_FAILED = 'EMAIL_ADDRESS_FAILED'
export const EMAIL_ADDRESS_STATUS_RESET = 'RESET'

export const emailAddressFetchingAction = makeActionCreator(
  EMAIL_ADDRESS_FETCHING,
)
export const emailAddressSuccessAction = makeActionCreator(
  EMAIL_ADDRESS_SUCCESS,
)
export const emailAddressFailedAction = makeActionCreator(EMAIL_ADDRESS_FAILED)

export const emailAddressResetAction = makeActionCreator(
  EMAIL_ADDRESS_STATUS_RESET,
)

export default {
  EMAIL_ADDRESS_FETCHING,
  EMAIL_ADDRESS_SUCCESS,
  EMAIL_ADDRESS_FAILED,
  EMAIL_ADDRESS_STATUS_RESET,
}
