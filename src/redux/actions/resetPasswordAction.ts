import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { atgResetPassword } from 'src/endpoints/atgGateway/resetPassword'
import { State } from 'src/redux/reducers'
import { AtgConfirmPassword } from 'src/models/UserModel/AtgAccountModel'
import { confirmPasswordApi } from 'src/endpoints/atgGateway/confirmPassword'
import {
  clearFormErrorMessagesAction,
  setformErrorMessagesAction,
} from './form/errorsAction'

export const USER_RESET_PASSWORD_FETCHING = 'USER__RESET_PASSWORD_FETCHING'
export const USER_RESET_PASSWORD_SUCCESS = 'USER__RESET_PASSWORD_SUCCESS'
export const USER_RESET_PASSWORD_FAILED = 'USER__RESET_PASSWORD_FAILED'

const resetPasswordFetchingAction = makeActionCreator(
  USER_RESET_PASSWORD_FETCHING,
)
const resetPasswordSuccessAction = makeActionCreator(
  USER_RESET_PASSWORD_SUCCESS,
)
const resetPasswordFailedAction = makeActionCreator(USER_RESET_PASSWORD_FAILED)

export const resetPasswordFetchAction: (
  email: string,
) => ThunkedAction<State> = (email) => async (dispatch, getState) => {
  await dispatch(resetPasswordFetchingAction())
  const response = await atgResetPassword(email)

  if (response.ok) {
    await dispatch(resetPasswordSuccessAction())
  } else {
    await dispatch(resetPasswordFailedAction())
  }
}

export const confirmPasswordAction: (
  confirmPasswordRequest: AtgConfirmPassword,
  errorFormId?: string,
) => ThunkedAction<State> = (confirmPasswordRequest, errorFormId) => async (
  dispatch,
) => {
  await dispatch(resetPasswordFetchingAction())
  const response = await confirmPasswordApi(confirmPasswordRequest)
  if (response.ok && errorFormId) {
    dispatch(clearFormErrorMessagesAction({ formId: errorFormId }))
    await dispatch(resetPasswordSuccessAction())
  }
  if (errorFormId && !response.ok) {
    const message =
      response && response.data && response.data.response
        ? response.data.response.message
        : 'An error occured, but no details given.'
    dispatch(
      setformErrorMessagesAction(errorFormId, [
        { formFieldId: 'message', error: message },
      ]),
    )
    await dispatch(resetPasswordFailedAction())
  }
}

export default {
  USER_RESET_PASSWORD_FETCHING,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAILED,
}
