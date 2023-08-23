import React, { Fragment, useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components/native'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import KeyboardAwareScrollView from 'src/controls/KeyboardAwareScrollView'

import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { push, pop } from 'src/helpers/navigationService'
import Routes from 'src/constants/routes'
import { FormErrors } from 'src/models/FormModel'
import { RequestStatus } from 'src/models/ApiStatus'

import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'
import { editAtgAccountDetails } from 'src/redux/actions/user/atgAccountAction'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { atgAccountApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/user'
import { clearFormErrorMessagesAction } from 'src/redux/actions/form/errorsAction'

import _Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'
import _TextField from 'src/controls/form/TextField'
import _Button from 'src/controls/Button'
import { icons } from 'assets/images'
import _HelperText from 'src/controls/form/FormHelperText'
import { passwordCheck } from 'src/helpers/passwordCheck'


const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

interface ContainerProps {
  currentWidth: number
}

const Container = styled(_Container)<ContainerProps>`
  padding: ${({ currentWidth }) => CONTENT_HORIZONTAL_PADDING(currentWidth)}px;
  padding-bottom: 0;
  position: relative;
`

const IconButton = styled(_Button)``

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const SubmitButton = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const TextField = styled(_TextField)`
  margin-bottom: 26;
`

const HelperText = styled(_HelperText)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`
const ButtonContainer = styled.View`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing(2)};
`

interface PasswordParams {
  password: string
  currentPassword: string
  confirmPassword: string
  changePassword: boolean
}

interface StateProps {
  atgProfile?: AtgAccountModel
  formError: FormErrors
  apiStatus: Nullable<RequestStatus>
}


const selector = createStructuredSelector({
  atgProfile: myAtgAccountSelector,
  formError: formErrorsSelector,
  apiStatus: atgAccountApiRequestStatusSelector,
})

interface DispatchProps {
  updatePassword: (passwordParams: PasswordParams) => void
  clearError: () => void
}

const PASSWORD_ERROR = 'Password_error'

const dispatcher = dispatch => ({
  updatePassword: passwordParams => dispatch(editAtgAccountDetails(passwordParams, PASSWORD_ERROR)),
  clearError: () => dispatch(clearFormErrorMessagesAction({ formId: PASSWORD_ERROR })),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

interface PasswordInput {
  value: string
  visible: boolean
}

type PasswordsState = Record<string, PasswordInput>

const passwordOptions = [
  { label: 'Current Password', value: 'currentPassword' },
  { label: 'New Password', value: 'password' },
  { label: 'Confirm New Password', value: 'confirmPassword', desc: 'Must be 8-15 characters with at least uppercase & number.' },
]

const EditPassword = ({ atgProfile, updatePassword, formError, apiStatus, clearError }: Props) => {
  const { width } = useResponsiveDimensions()

  const [passwords, setPasswords] = useState<PasswordsState>({
    currentPassword: {
      value: '',
      visible: false,
    },
    password: {
      value: '',
      visible: false,
    },
    confirmPassword: {
      value: '',
      visible: false,
    },
  })
  const mounted = useRef<boolean>()

  useEffect(() => () => {
    clearError()
  }, [])

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
    } else {
      const isSuccess = apiStatus === RequestStatus.SUCCESS
      if (isSuccess) {
        pop()
      }
    }
  }, [apiStatus])


  const handleUpdateFiled = field => (e) => {
    setPasswords({ ...passwords, [field]: { ...passwords[field], value: e } })
  }

  const handleShowPassword = field => () => {
    setPasswords({ ...passwords, [field]: { ...passwords[field], visible: !passwords[field].visible } })
  }

  const forgotPassword = () => {
    push(Routes.MODAL__RESET_PASSWORD)
  }

  const resetPassword = () => {
    const edits = passwordOptions.reduce((result, option) => ({
      ...result,
      [option.value]: passwords[option.value].value,
      changePassword: true,
    }), {}) as PasswordParams
    updatePassword(edits)
  }


  const okToSubmit = () => {
    let submit = false
    submit = passwordOptions.every(option => passwordCheck(passwords[option.value].value))
    return submit
  }
  const error = formError[PASSWORD_ERROR] && formError[PASSWORD_ERROR].message
  const isBusy = apiStatus === RequestStatus.FETCHING

  const contentContainerStyle = useMemo(() => ({ flex: 1 }), [])

  if (!atgProfile) {
    return <Fragment />
  }
  return (
    <Container currentWidth={ width }>
      <KeyboardAwareScrollView
        contentContainerStyle={ contentContainerStyle }
      >
        <HeaderText>
        Change Password
        </HeaderText>
        {passwordOptions.map(option => (
          <TextField
            key={ option.value }
            value={ passwords[option.value].value }
            label={ option.label }
            onChange={ handleUpdateFiled(option.value) }
            secureTextEntry={ !passwords[option.value].visible }
            helperText={ option.desc }
            endAdornment={ (
              <IconButton
                accessibilityLabel={ !passwords[option.value].visible ? 'hide password' : 'show password' }
                icon
                onPress={ handleShowPassword(option.value) }
              >
                { passwords[option.value].visible ? <Icon source={ icons.eyeOff } /> : <Icon source={ icons.eyeOn } /> }
              </IconButton>
          ) }
          />
        ))}
        {!!error && <HelperText error={ !!error }>{error}</HelperText> }
        <ButtonContainer>
          <Button
            maxWidth
            center
            onPress={ forgotPassword }
            linkGreen
          >
          Forgot your password?
          </Button>
          <SubmitButton
            showSpinner={ isBusy }
            disabled={ !okToSubmit() || isBusy }
            variant="contained"
            maxWidth
            onPress={ resetPassword }
          >
            Save Changes
          </SubmitButton>
        </ButtonContainer>
      </KeyboardAwareScrollView>
    </Container>
  )
}


EditPassword.navigationOptions = () => ({
  header: headerProps => <Header headerProps={ headerProps } />,
})

export default connector(EditPassword)
