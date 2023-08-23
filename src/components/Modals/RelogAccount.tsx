import React from 'react'
import { connect } from 'react-redux'

import Alert from 'src/controls/Modal/Alert'

import { logoutAction } from 'src/redux/actions/login/logoutAction'

interface OwnProps {
  isOpen: boolean
  onDismiss: () => void
}

interface DispatchProps {
  logout(): void
}

const dispatcher = (dispatch) => ({
  logout: () => dispatch(logoutAction()),
})

const connector = connect<{}, DispatchProps, OwnProps>(null, dispatcher)

type Props = DispatchProps & OwnProps

const RelogAccount = ({ isOpen, onDismiss, logout }: Props) => {
  const dismissModal = () => {
    logout()
    onDismiss()
  }

  return (
    <Alert
      isOpen={ isOpen }
      onDismiss={ dismissModal }
      title="Something went wrong with Account"
      description="Please relogin to account"
      cancelText="Dismiss"
    />
  )
}
export default connector(RelogAccount)
