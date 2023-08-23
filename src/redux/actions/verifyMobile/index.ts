import { State } from 'src/redux/reducers'
import { fetchGenerateOtp, fetchVerifyOtp  } from 'src/endpoints/atgGateway/verifyMobile'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'

export const generateOtpAction: (params) => ThunkedAction<State, boolean> = ({ phoneNumber }) => async (dispatch, getState) => {
  const response = await fetchGenerateOtp({ phoneNumber })
  if (response.ok) {
    return true
  } else {
    dispatch(setformErrorMessagesAction('CafePhoneVerification', [
      { formFieldId: 'PhoneNumber', error: response.data.response.message },
    ]))
  }
  return false
}

export const verifyOtpAction: (params) => ThunkedAction<State, boolean> =
  ({ phoneNumber, token }) => async (dispatch, getState) => {
  const response = await fetchVerifyOtp({ phoneNumber, token })
  if (response.ok) {
    return true
  } else {
    dispatch(setformErrorMessagesAction('CafePhoneVerification', [
      { formFieldId: 'OtpToken', error: 'Incorrect token' },
    ]))
  }
  return false
}
