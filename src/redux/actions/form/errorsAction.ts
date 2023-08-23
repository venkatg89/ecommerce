import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { FormFieldsErrorMessages, ErrorMessage } from 'src/models/FormModel'

interface SetFormErrorMessagesPayload {
  formId: string
  formErrors: FormFieldsErrorMessages
}

export const SET_FORM_ERROR_MESSAGES = 'FORM__ERROR_MESSAGES_SET'
const setFormErrorMessages = makeActionCreator<SetFormErrorMessagesPayload>(
  SET_FORM_ERROR_MESSAGES,
)

export const setformErrorMessagesAction: (
  formId: string,
  errorMessages?: ErrorMessage[],
) => ThunkedAction<State> = (formId, errorMessages = []) => async (
  dispatch,
  getState,
) => {
  const formErrors: FormFieldsErrorMessages = errorMessages.reduce(
    (object, errorMessage) => {
      const { formFieldId, error } = errorMessage as ErrorMessage

      object[formFieldId] = error // eslint-disable-line
      return object
    },
    {},
  )
  await dispatch(setFormErrorMessages({ formId, formErrors }))
}

export const CLEAR_FORM_ERROR_MESSAGES = 'FORM__ERROR_MESSAGES_CLEAR'
const clearFormErrorMessages = makeActionCreator<{ formId: string }>(
  CLEAR_FORM_ERROR_MESSAGES,
)

export const clearFormErrorMessagesAction: (params: {
  formId: string
}) => ThunkedAction<State> = ({ formId }) => async (dispatch, getState) => {
  const hasFormErrors = !!getState().form.errors[formId]
  if (hasFormErrors) {
    await dispatch(clearFormErrorMessages({ formId }))
  }
}

export const CLEAR_FORM_FIELD_ERROR_MESSAGES =
  'FORM__FIELD_ERROR_MESSAGES_CLEAR'
const clearFormFieldErrorMessages = makeActionCreator<{
  formId: string
  formFieldId: string
}>(CLEAR_FORM_FIELD_ERROR_MESSAGES) // eslint-disable-line

export const clearFormFieldErrorMessagesAction: (params: {
  formId: string
  formFieldId: string
}) => ThunkedAction<State> = ({ formId, formFieldId }) => async (
  dispatch,
  getState,
) => {
  const state = getState()
  const hasFormFieldErrors = !!(
    state.form.errors[formId] && state.form.errors[formId][formFieldId]
  )
  if (hasFormFieldErrors) {
    await dispatch(clearFormFieldErrorMessages({ formId, formFieldId }))
  }
}
