import { Reducer } from 'redux'

import { FormErrors } from 'src/models/FormModel'

import {
  SET_FORM_ERROR_MESSAGES, CLEAR_FORM_ERROR_MESSAGES, CLEAR_FORM_FIELD_ERROR_MESSAGES,
} from 'src/redux/actions/form/errorsAction'

export type ErrorsState = FormErrors

const DEFAULT: ErrorsState = {}

const _errors: Reducer<ErrorsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_FORM_ERROR_MESSAGES: {
      const { formId, formErrors } = action.payload

      return ({
        ...state,
        [formId]: { ...state[formId], ...formErrors },
      })
    }

    case CLEAR_FORM_ERROR_MESSAGES: {
      const { formId } = action.payload
      const errors = { ...state }
      delete errors[formId]
      return errors
    }

    case CLEAR_FORM_FIELD_ERROR_MESSAGES: {
      const { formId, formFieldId } = action.payload
      if (!state[formId]) { return state }
      const formErrors = { ...state[formId] }
      delete formErrors[formFieldId]
      return ({
        ...state,
        [formId]: formErrors,
      })
    }

    default:
      return state
  }
}

export default _errors
