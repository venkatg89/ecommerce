import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import Alert from 'src/controls/Modal/Alert'

import { ACCOUNT_ERROR_MODAL } from 'src/constants/formErrors'
import { FormErrors } from 'src/models/FormModel'

import { clearFormErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'

interface OwnProps {
  isOpen: boolean
  onDismiss: () => void
}

interface StateProps {
  formErrors: FormErrors
}

const selector = createStructuredSelector({
  formErrors: formErrorsSelector,
})

interface DispatchProps {
  clearFormErrorMessages: () => void
}

const dispatcher = (dispatch) => ({
  clearFormErrorMessages: () =>
    dispatch(clearFormErrorMessagesAction({ formId: ACCOUNT_ERROR_MODAL })),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps

const AccountErrorModal = ({
  isOpen,
  onDismiss,
  formErrors,
  clearFormErrorMessages,
}: Props) => {
  let errorMessage = ''
  if (formErrors[ACCOUNT_ERROR_MODAL] && formErrors[ACCOUNT_ERROR_MODAL].body) {
    errorMessage = formErrors[ACCOUNT_ERROR_MODAL].body
  }

  useEffect(
    () => () => {
      clearFormErrorMessages()
    },
    [],
  )

  return (
    <Alert
      isOpen={isOpen}
      onDismiss={onDismiss}
      title="Something went wrong with Account"
      description={errorMessage}
      cancelText="Dismiss"
    />
  )
}
export default connector(AccountErrorModal)
