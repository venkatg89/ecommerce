import React from 'react'

import Alert from 'src/controls/Modal/Alert'

import { navigate, Routes } from 'src/helpers/navigationService'

interface Props {
  canContinue: boolean
  isOpen: boolean
  onDismiss: () => void
  animationType?: string
  bodyTextCentered?: boolean
}

const GuestUserModal = ({
  isOpen,
  onDismiss,
  animationType,
  canContinue,
  bodyTextCentered,
}: Props) => {
  const title = canContinue
    ? 'Would you like to create an account?'
    : 'You must be signed in to use this feature'
  const secondButtonInfo = {
    title: 'Sign in',
    onPress: () => {
      navigate(Routes.MODAL__LOGIN)
    },
  }

  const cancelText = canContinue ? 'Continue as Guest' : 'Not now'

  const buttons = canContinue
    ? [
        {
          title: 'Create account',
          onPress: () => {
            navigate(Routes.MODAL__SIGNUP)
          },
        },
      ]
    : [secondButtonInfo]
  return (
    <Alert
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={title}
      description="Please Sign In or Create an Account to continue."
      buttons={buttons}
      cancelText={cancelText}
      animationType={animationType}
      bodyTextCentered={bodyTextCentered}
    />
  )
}

export default GuestUserModal
