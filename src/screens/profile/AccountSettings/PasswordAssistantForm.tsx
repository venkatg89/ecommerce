import React, {
  Fragment,
  useState,
  useEffect,
  useMemo,
  useContext,
} from 'react'
import styled, { ThemeContext } from 'styled-components/native'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import KeyboardAwareScrollView from 'src/controls/KeyboardAwareScrollView'

import {
  AtgAccountModel,
  AtgConfirmPassword,
} from 'src/models/UserModel/AtgAccountModel'
import { pop } from 'src/helpers/navigationService'
import { FormErrors } from 'src/models/FormModel'
import { RequestStatus } from 'src/models/ApiStatus'

import { Routes, Params, WebRoutes, push } from 'src/helpers/navigationService'

import {
  myAtgAccountSelector,
  myAtgApiPasswordResetStatusSelector,
  myAtgApiStatusSelector,
  myAtgEncodedUserIdSelector,
} from 'src/redux/selectors/userSelector'
import { editAtgAccountDetails } from 'src/redux/actions/user/atgAccountAction'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { clearFormErrorMessagesAction } from 'src/redux/actions/form/errorsAction'

import _Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import {
  CONTENT_HORIZONTAL_PADDING,
  getSuccessToastStyle,
  useResponsiveDimensions,
} from 'src/constants/layout'
import _TextField from 'src/controls/form/TextField'
import _Button from 'src/controls/Button'
import { icons } from 'assets/images'
import _HelperText from 'src/controls/form/FormHelperText'
import {
  passwordCheck,
  passwordCheckForAtleastOneDigit,
  passwordCheckForAtleastOneUpperCase,
} from 'src/helpers/passwordCheck'
import { Text } from 'react-native'
import { confirmPasswordAction } from 'src/redux/actions/resetPasswordAction'
import { NavigationInjectedProps } from 'react-navigation'
import { useToast } from 'native-base'
import { ThemeModel } from 'src/models/ThemeModel'

interface ContainerProps {
  currentWidth: number
}

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const Container = styled(_Container)<ContainerProps>`
  padding: ${({ currentWidth }) => CONTENT_HORIZONTAL_PADDING(currentWidth)}px;
  padding-bottom: 0;
  position: relative;
  background-color: #fafafa;
`

const IconButton = styled(_Button)``

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const Button = styled(_Button)`
  justify-content: flex-end;
`

const SubmitButton = styled(_Button)``

const TextField = styled(_TextField)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const HelperText = styled(_HelperText)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const ValidationRowContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: ${({ theme }) => theme.spacing(5)};
`

const ValidationText = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.grey1};
`

const ValidationContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const ChangePasswordText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
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
  confirmPasswordApiStatus: Nullable<RequestStatus>
  encodedUserId?: string
  atgApiStatus: Nullable<RequestStatus>
}

type OwnProps = NavigationInjectedProps

const selector = createStructuredSelector({
  atgProfile: myAtgAccountSelector,
  formError: formErrorsSelector,
  atgApiStatus: myAtgApiStatusSelector,
  confirmPasswordApiStatus: myAtgApiPasswordResetStatusSelector,
  encodedUserId: myAtgEncodedUserIdSelector,
})

interface DispatchProps {
  updatePassword: (passwordParams: PasswordParams) => void
  confirmPassword: (confirmPasswordRequest: AtgConfirmPassword) => void
  clearError: () => void
}

const PASSWORD_ERROR = 'Password_error'

const dispatcher = (dispatch) => ({
  updatePassword: (passwordParams) =>
    dispatch(editAtgAccountDetails(passwordParams, PASSWORD_ERROR)),
  confirmPassword: (confirmPasswordRequest) =>
    dispatch(confirmPasswordAction(confirmPasswordRequest, PASSWORD_ERROR)),
  clearError: () =>
    dispatch(clearFormErrorMessagesAction({ formId: PASSWORD_ERROR })),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = OwnProps & StateProps & DispatchProps

interface PasswordInput {
  value: string
  visible: boolean
}

type PasswordsState = Record<string, PasswordInput>

const passwordOptionsForChangePassword = [
  { label: 'Current Password', value: 'currentPassword' },
  { label: 'New Password', value: 'password' },
  {
    label: 'Confirm New Password',
    value: 'confirmPassword',
    desc: 'Must be 8-15 characters with at least uppercase & number.',
  },
]

const passwordOptionsForConfirmPassword = [
  { label: 'New Password', value: 'password' },
  {
    label: 'Confirm New Password',
    value: 'confirmPassword',
    desc: 'Must be 8-15 characters with at least uppercase & number.',
  },
]

const UpdatePassword = ({
  navigation,
  atgProfile,
  updatePassword,
  confirmPassword,
  formError,
  atgApiStatus,
  confirmPasswordApiStatus,
  encodedUserId,
  clearError,
}: Props) => {
  const toast = useToast()
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()
  const [mounted, setMounted] = useState(false)
  const [charLengthError, setCharLengthError] = useState(false)
  const [upperCaseError, setUpperCaseError] = useState(false)
  const [numberError, setNumberError] = useState(false)
  const [usernameMatchError, setUsernameMatchError] = useState(false)
  const [confirmPasswordMatchError, setConfirmPasswordMatchError] = useState(
    false,
  )

  const isChangePassword = navigation.getParam('isChangePassword')

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

  useEffect(() => {
    setMounted(true)
    clearError()
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (mounted) {
      const isSuccess =
        atgApiStatus === RequestStatus.SUCCESS ||
        confirmPasswordApiStatus === RequestStatus.SUCCESS
      if (isSuccess) {
        pop()
        /* @ts-ignore */
        toast.show({
          title: 'Changes saved',
          ...getSuccessToastStyle(theme),
        })
      }
    }
  }, [atgApiStatus, confirmPasswordApiStatus])

  const passwordOptions = isChangePassword
    ? passwordOptionsForChangePassword
    : passwordOptionsForConfirmPassword

  const handleUpdateFiled = (field) => (value) => {
    setPasswords({ ...passwords, [field]: { ...passwords[field], value } })
    if (field === 'password') {
      setCharLengthError(passwordCheck(value))
      setUpperCaseError(passwordCheckForAtleastOneUpperCase(value))
      setNumberError(passwordCheckForAtleastOneDigit(value))
      setUsernameMatchError(value !== atgProfile?.atgUserId)
    } else if (field === 'confirmPassword') {
      setConfirmPasswordMatchError(value !== passwords.password.value)
    }
  }

  const handleShowPassword = (field) => () => {
    setPasswords({
      ...passwords,
      [field]: { ...passwords[field], visible: !passwords[field].visible },
    })
  }

  const forgotPassword = () => {
    push(Routes.WEBVIEW__WITH_SESSION, {
      [Params.WEB_ROUTE]: WebRoutes.FORGOT_PASSWORD,
    })
  }

  const resetPassword = () => {
    if (isChangePassword) {
      const edits = passwordOptions.reduce(
        (result, option) => ({
          ...result,
          [option.value]: passwords[option.value].value,
          changePassword: true,
        }),
        {},
      ) as PasswordParams
      updatePassword(edits)
    } else {
      confirmPassword({
        password: passwords.password.value,
        confirmPassword: passwords.confirmPassword.value,
        encodedUserId: encodedUserId || '',
      })
    }
  }

  const okToSubmit = () => {
    let submit = false
    submit = passwordOptions.every((option) =>
      passwordCheck(passwords[option.value].value),
    )
    const formError = checkErrors()
    return submit && !formError
  }

  const checkErrors = () => {
    return (
      !usernameMatchError ||
      !upperCaseError ||
      !numberError ||
      !charLengthError ||
      confirmPasswordMatchError
    )
  }

  const error = formError[PASSWORD_ERROR] && formError[PASSWORD_ERROR].message
  const isBusy = atgApiStatus === RequestStatus.FETCHING

  const contentContainerStyle = useMemo(() => ({ flex: 1 }), [])

  if (!atgProfile) {
    return <Fragment />
  }
  return (
    <Container currentWidth={width}>
      <KeyboardAwareScrollView contentContainerStyle={contentContainerStyle}>
        <HeaderText>
          {isChangePassword ? 'Change Password' : 'Password Assistant'}
        </HeaderText>
        {!isChangePassword && (
          <ChangePasswordText>Change Password</ChangePasswordText>
        )}
        {passwordOptions.map((option, index) => (
          <React.Fragment>
            <TextField
              key={option.value}
              value={passwords[option.value].value}
              label={option.label}
              formFieldId={PASSWORD_ERROR}
              formId={PASSWORD_ERROR}
              onChange={handleUpdateFiled(option.value)}
              secureTextEntry={!passwords[option.value].visible}
              endAdornment={
                <IconButton
                  accessibilityLabel={
                    !passwords[option.value].visible
                      ? 'hide password'
                      : 'show password'
                  }
                  icon
                  onPress={handleShowPassword(option.value)}
                >
                  {passwords[option.value].visible ? (
                    <Icon source={icons.eyeOff} />
                  ) : (
                    <Icon source={icons.eyeOn} />
                  )}
                </IconButton>
              }
            />

            {option.value === 'password' && (
              <ValidationContainer>
                <ValidationRowContainer>
                  <ValidationText>
                    {charLengthError && <Icon source={icons.checkmark} />} 8-15
                    characters
                  </ValidationText>
                  <ValidationText>
                    {upperCaseError && <Icon source={icons.checkmark} />}{' '}
                    Capital letter
                  </ValidationText>
                </ValidationRowContainer>
                <ValidationRowContainer>
                  <ValidationText>
                    {numberError && <Icon source={icons.checkmark} />}Number
                  </ValidationText>
                  <ValidationText>
                    {usernameMatchError && <Icon source={icons.checkmark} />}{' '}
                    Not your username
                  </ValidationText>
                </ValidationRowContainer>
              </ValidationContainer>
            )}
            {option.value === 'confirmPassword' && (
              <React.Fragment>
                {confirmPasswordMatchError && (
                  <Text> Password should match</Text>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
        {!!error && <HelperText error={!!error}>{error}</HelperText>}
        {isChangePassword && (
          <Button maxWidth center onPress={forgotPassword} linkGreen>
            Forgot your password?
          </Button>
        )}
      </KeyboardAwareScrollView>
      <SubmitButton
        showSpinner={isBusy}
        disabled={!okToSubmit() || isBusy}
        variant="contained"
        maxWidth
        isAnchor
        onPress={resetPassword}
      >
        Save Changes
      </SubmitButton>
    </Container>
  )
}

UpdatePassword.navigationOptions = () => ({
  title: 'Change Password',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(UpdatePassword)
