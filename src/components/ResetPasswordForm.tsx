import React, { useState } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import { resetPasswordFetchAction } from 'src/redux/actions/resetPasswordAction'
import { passwordResetStatusSelector } from 'src/redux/selectors/apiStatus/login'

import _TextField from 'src/controls/form/TextField'
import _Button from 'src/controls/Button'

const Container = styled.View`
  flex-direction: column;
  width: 100%;
`

const TextInput = styled(_TextField)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
`
interface StateProps {
  resetPasswordApiStatusFetching: boolean;
}

const selector = createStructuredSelector({
  resetPasswordApiStatusFetching: passwordResetStatusSelector.isInProgress,
})

interface DispatchProps {
  resetPasswordFetch(email: string): void;
}

const dispatcher = dispatch => ({
  resetPasswordFetch: email => dispatch(resetPasswordFetchAction(email)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps


const ResetPasswordForm = ({ resetPasswordApiStatusFetching, resetPasswordFetch }: Props) => {
  const [email, setEmail] = useState<string>('')

  const resetPassword = () => {
    resetPasswordFetch(email)
  }

  const handleChangeEmail = (e) => {
    setEmail(e)
  }

  return (
    <Container>
      <TextInput
        label="Email"
        autoCapitalize="none"
        autoCorrect={ false }
        keyboardType="email-address"
        onChange={ handleChangeEmail }
        value={ email }
      />
      <Button
        variant="contained"
        maxWidth
        onPress={ resetPassword }
        disabled={ resetPasswordApiStatusFetching }
      >
        Request Password Recovery
      </Button>
    </Container>

  )
}


export default connector(ResetPasswordForm)
