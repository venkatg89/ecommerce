import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'

import { SERVER_LOGIN } from 'src/constants/formErrors'
import { FormErrors } from 'src/models/FormModel'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { clearFormErrorMessagesAction } from 'src/redux/actions/form/errorsAction'

import { navigate, Routes } from 'src/helpers/navigationService'

import Alert from 'src/controls/Modal/Alert'

interface OwnProps {
  email: string;
  password: string;
}

interface StateProps {
  formError: FormErrors;
}

interface DispatchProps {
  clearError: () => void
}

const selector = state => ({
  formError: formErrorsSelector(state),
})

const dispatcher = dispatch => ({
  clearError: () => dispatch(clearFormErrorMessagesAction({ formId: SERVER_LOGIN })),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & OwnProps & DispatchProps

const SignupErrorModal = ({ formError, email, password, clearError }: Props) => {
  const [isOpen, setOpenModal] = useState(false)
  const error = formError[SERVER_LOGIN]
  useEffect(() => {
    if (error) {
      setOpenModal(true)
    }
  }, [!!error])

  const navigateToLoginScreen = useCallback(() => {
    navigate(Routes.MODAL__LOGIN, { _email: email, _password: password })
    clearError()
  }, [email, password])

  const handleCloseModal = useCallback(() => setOpenModal(false), [isOpen])
  const errorText = error ? error.loginError : ''
  const desc = `Account is sucessfully created but problem in login \n${errorText}`

  const buttons = useMemo(() => ([
    { title: 'LOGIN WITH EMAIL', onPress: navigateToLoginScreen },
  ]), [email, password])

  return (
    <Alert
      isOpen={ isOpen }
      onDismiss={ handleCloseModal }
      title="Login Error"
      description={ desc }
      buttons={ buttons }
    />
  )
}

export default connector(SignupErrorModal)
