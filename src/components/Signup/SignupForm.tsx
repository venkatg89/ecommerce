import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
  createRef,
} from 'react'
import { connect } from 'react-redux'
import { KeyboardType, AccessibilityProps, Text } from 'react-native'
import { createStructuredSelector } from 'reselect'
import styled, { ThemeContext } from 'styled-components/native'

import _Button from 'src/controls/Button'
import KeyboardSpacer from 'src/controls/KeyboardSpacer'
import Alert from 'src/controls/Modal/Alert'

import { secretQuestionsFetchAction } from 'src/redux/actions/secretQuestionsAction'
import {
  signupFetchActionWithErrorCode,
  SignupForm,
} from 'src/redux/actions/login/signupAction'
import {
  onboardingMovedPastRegisterLoginAction,
  navigateToNextOnboardingStepOrToHomeAction,
} from 'src/redux/actions/onboarding'
import {
  setformErrorMessagesAction,
  clearFormFieldErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'

import { OnboardingMovedPastStepsState } from 'src/redux/reducers/UserReducer/OnboardingReducer/Steps'
import { onboardingStepStateSelector } from 'src/redux/selectors/onboarding/stepsSelector'
import { signUpStatusSelector } from 'src/redux/selectors/apiStatus/login'
import {
  secretQuestionsSelector,
  uiLoginInProgressSelector,
} from 'src/redux/selectors/widgetSelector'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'

import { navigate, Routes } from 'src/helpers/navigationService'
import checkEmailFormat from 'src/helpers/ui/checkEmailFormat'
import { ErrorMessage, FormErrors } from 'src/models/FormModel'
import { isEmpty } from 'src/helpers/objectHelpers'
import { passwordCheck } from 'src/helpers/passwordCheck'

import _TextField from 'src/controls/form/TextField'
import { icons } from 'assets/images'
import _Select from 'src/controls/form/Select'
import _Container from 'src/controls/layout/ScreenContainer'

import LegalLinks from 'src/components/Onboarding/LegalLinks'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'

const Container = styled(_Container)``

const Spacer = styled.View`
  height: 40;
`

const Spacer8 = styled.View`
  height: 8;
`

const FormContainer = styled.View`
  display: flex;
  flex-direction: row;
`

const TextField = styled(_TextField)<AccessibilityProps>`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  width: ${({ halfWidth }) => (halfWidth ? '48%' : '100%')};
  margin-left: ${({ theme, index }) => (index === 1 ? theme.spacing(1) : 0)};
`

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const IconButton = styled(_Button)``

const Select = styled(_Select)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const SubmitButton = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(1)}px;
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
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const ValidationContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

interface QuestionTypes {
  value: string
}

interface StateProps {
  secretQuestions: QuestionTypes[]
  isBusy: boolean
  onboardingStepState: OnboardingMovedPastStepsState
  formErrors: FormErrors
  atgProfile?: AtgAccountModel | undefined
}

const selector = createStructuredSelector({
  secretQuestions: secretQuestionsSelector,
  isBusy: (state) =>
    signUpStatusSelector.isInProgress(state) ||
    uiLoginInProgressSelector(state),
  onboardingStepState: onboardingStepStateSelector,
  formErrors: formErrorsSelector,
  atgProfile: myAtgAccountSelector,
})

interface DispatchProps {
  secretQuestionsFetch(): void
  signupFetch: (form: SignupForm) => string | undefined
  onboardingMovedPastRegisterLogin: () => void
  setError: (error: ErrorMessage) => void
  clearError: (fieldId: string) => void
  navigateToNextOnboardingStepOrToHome(): void
}

const dispatcher = (dispatch) => ({
  secretQuestionsFetch: () => dispatch(secretQuestionsFetchAction()),
  signupFetch: (form) => dispatch(signupFetchActionWithErrorCode(form)),
  onboardingMovedPastRegisterLogin: () =>
    dispatch(onboardingMovedPastRegisterLoginAction()),
  setError: (error) =>
    dispatch(setformErrorMessagesAction('signupForm', [error])),
  clearError: (fieldId) =>
    dispatch(
      clearFormFieldErrorMessagesAction({
        formId: 'signupForm',
        formFieldId: fieldId,
      }),
    ),
  navigateToNextOnboardingStepOrToHome: () =>
    dispatch(navigateToNextOnboardingStepOrToHomeAction(undefined, true)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

interface SingupFormParms {
  label: string
  value: string
  helperText?: string
  keyboardType?: KeyboardType
  secure?: boolean
  selector?: boolean
}

const signupForms: SingupFormParms[] = [
  { label: 'First Name', value: 'firstName' },
  { label: 'Last Name', value: 'lastName' },
  { label: 'Email', value: 'email', keyboardType: 'email-address' },
  { label: 'Password', value: 'password', secure: true },
  {
    label: 'Confirm Password',
    value: 'confirmPassword',
    helperText: 'Must be 8-15 characters with at least uppercase & number.',
    secure: true,
  },
  { label: 'Security Question', value: 'secretQuestion', selector: true },
  { label: 'Security Answer', value: 'secretAnswer' },
]

const loginInfo = ['email', 'password', 'confirmPassword']
interface HideOptions {
  hidePassword: boolean
  hideConfirm: boolean
}

const FORM_ID = 'signupForm'

const SignupFormComponent = ({
  secretQuestions,
  atgProfile,
  secretQuestionsFetch,
  signupFetch,
  isBusy,
  onboardingStepState,
  onboardingMovedPastRegisterLogin,
  navigateToNextOnboardingStepOrToHome,
  setError,
  clearError,
  formErrors,
}: Props) => {
  const inputRefs = useRef<any>(signupForms.map(() => createRef()))

  const [userForm, setForm] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    penName: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretQuestion: secretQuestions[0] ? secretQuestions[0].value : '',
    secretAnswer: '',
  })
  const [hide, setHide] = useState<HideOptions>({
    hidePassword: true,
    hideConfirm: true,
  })
  const [openModalState, setOpenModalState] = useState<string>('')
  const [charLengthError, setCharLengthError] = useState(true)
  const [upperCaseError, setUpperCaseError] = useState(true)
  const [numberError, setNumberError] = useState(true)
  const [usernameMatchError, setUsernameMatchError] = useState(true)
  const [confirmPasswordMatchError, setConfirmPasswordMatchError] = useState(
    false,
  )
  const { palette, spacing } = useContext(ThemeContext)

  useEffect(() => {
    secretQuestionsFetch()
  }, [])

  useEffect(() => {
    const { firstName, lastName } = userForm
    setForm({
      ...userForm,
      penName: `${firstName && `${firstName} `}${lastName}`,
    })
  }, [userForm.firstName, userForm.lastName])

  useEffect(() => {
    if (secretQuestions.length > 0 && !userForm.secretQuestion) {
      setForm({ ...userForm, secretQuestion: secretQuestions[0].value })
    }
  }, [secretQuestions])

  const signup = async () => {
    const error = await signupFetch(userForm)
    switch (error) {
      case 'BN717': {
        setOpenModalState('EmailExists')
        break
      }
      default:
        break
    }
  }

  const closeModal = () => {
    setOpenModalState('')
  }

  const handleChangeInput = (field) => (e) => {
    setForm({ ...userForm, [field]: e })
  }

  useEffect(() => {
    if (userForm.password === userForm.confirmPassword) {
      clearError('password')
      clearError('confirmPassword')
    }
  }, [userForm.password, userForm.confirmPassword])

  const handleTrimText = (field) => () => {
    switch (field) {
      case 'confirmPassword':
        if (!userForm[field].match(/([A-Z]+)/)) {
          setError({
            formFieldId: field,
            error: 'Your password must contain at least one capital letter.',
          })
          setUpperCaseError(true)
        }
        if (!userForm[field].match(/([0-9]+)/)) {
          setError({
            formFieldId: field,
            error: 'Your password must contain at least one number.',
          })
          setNumberError(true)
        }
        if (!passwordCheck(userForm[field].trim())) {
          setError({
            formFieldId: field,
            error: 'Your password must be between 8-15 characters.',
          })
          setCharLengthError(true)
        }
        if (userForm[field] === atgProfile?.atgUserId) {
          setError({
            formFieldId: field,
            error: 'Your password cannot be your username',
          })
          setUsernameMatchError(true)
        }
        if (userForm.password.trim() !== userForm.confirmPassword.trim()) {
          setError({
            formFieldId: field,
            error:
              'Please check that your password and confirm password match and try again.',
          })
          setConfirmPasswordMatchError(true)
        } else {
          setForm({ ...userForm, [field]: userForm[field].trim() })
          setUpperCaseError(false)
          setNumberError(false)
          setCharLengthError(false)
          setConfirmPasswordMatchError(false)
          setUsernameMatchError(false)
        }
        break
      case 'password':
        setUpperCaseError(false)
        setNumberError(false)
        setCharLengthError(false)
        setUsernameMatchError(false)
        if (!userForm[field].match(/([A-Z]+)/)) {
          setError({
            formFieldId: field,
            error: 'Your password must contain at least one capital letter.',
          })
          setUpperCaseError(true)
        }
        if (!userForm[field].match(/([0-9]+)/)) {
          setError({
            formFieldId: field,
            error: 'Your password must contain at least one number.',
          })
          setNumberError(true)
        }
        if (userForm[field] === atgProfile?.atgUserId) {
          setError({
            formFieldId: field,
            error: 'Your password cannot be your username',
          })
          setUsernameMatchError(true)
        }
        if (!passwordCheck(userForm[field].trim())) {
          setError({
            formFieldId: field,
            error: 'Your password must be between 8-15 characters.',
          })
          setCharLengthError(true)
        } else {
          setForm({ ...userForm, [field]: userForm[field].trim() })
        }
        break
      case 'email':
        if (!checkEmailFormat(userForm.email)) {
          setError({
            formFieldId: field,
            error: 'Please enter a valid email address.',
          })
        } else {
          setForm({ ...userForm, [field]: userForm[field].trim() })
        }
        break
      default:
        setForm({ ...userForm, [field]: userForm[field].trim() })
    }
  }

  const toggleEye = (type) => () => {
    if (type === 'password') {
      setHide({ ...hide, hidePassword: !hide.hidePassword })
    } else {
      setHide({ ...hide, hideConfirm: !hide.hideConfirm })
    }
  }

  const getSecureOptions = (form) => {
    const { hideConfirm, hidePassword } = hide
    switch (form.value) {
      case 'password':
        return hidePassword
      case 'confirmPassword':
        return hideConfirm
      default:
        return false
    }
  }
  // Rules for this are TBD.
  const okToSubmit = () =>
    Object.keys(userForm).every((key) => {
      switch (key) {
        case 'email':
          return checkEmailFormat(userForm.email)
        case 'password':
          return passwordCheck(userForm.password)
        case 'confirmPassword':
          return passwordCheck(userForm.confirmPassword)
        default:
          return !!userForm[key]
      }
    })

  const loginAsGuest = async () => {
    await onboardingMovedPastRegisterLogin()
    await navigateToNextOnboardingStepOrToHome()
  }

  const existingEmailgoToLoginScreen = useCallback(() => {
    navigate(Routes.MODAL__LOGIN, {
      _email: userForm.email,
      _password: userForm.password,
    })
  }, [userForm.email, userForm.password])

  const enterNext = (index) => () => {
    if (index === signupForms.length - 1) {
      return
    }
    const nextInput = inputRefs.current[index + 1].current
    if (nextInput && nextInput.focus) {
      nextInput.focus()
    }
  }

  const shouldBlur = (index) => {
    if (
      (signupForms[index + 1] && signupForms[index + 1].selector) ||
      !signupForms[index + 1]
    ) {
      return true
    }
    return false
  }

  const hasError = formErrors[FORM_ID] && !isEmpty(formErrors[FORM_ID])

  const createTextField = (form, index) => {
    return (
      <>
        <TextField
          halfWidth={index <= 1}
          index={index}
          accessibilityLabel={form.label}
          key={form.label}
          inputRef={inputRefs.current[index]}
          returnKeyType={signupForms.length - 1 === index ? 'done' : 'next'}
          onSubmitEditing={enterNext(index)}
          blurOnSubmit={shouldBlur(index)}
          value={userForm[form.value]}
          label={form.label}
          onChange={handleChangeInput(form.value)}
          onEndEditing={handleTrimText(form.value)}
          helperText={
            ['password', 'confirmPassword'].includes(form.value)
              ? null
              : form.helperText
          }
          keyboardType={form.keyboardType}
          secureTextEntry={getSecureOptions(form)}
          autoCorrect={false}
          endAdornment={
            form.secure && (
              <IconButton
                accessibilityLabel={
                  getSecureOptions(form) ? 'show password' : 'hide password'
                }
                icon
                onPress={toggleEye(form.value)}
              >
                {getSecureOptions(form) ? (
                  <Icon source={icons.eyeOn} />
                ) : (
                  <Icon source={icons.eyeOff} />
                )}
              </IconButton>
            )
          }
          formId={FORM_ID}
          autoCapitalize={loginInfo.includes(form.value) ? 'none' : 'sentences'}
          formFieldId={form.value}
        />

        {form.value === 'password' && (
          <ValidationContainer>
            <ValidationRowContainer>
              <ValidationText>
                {!charLengthError && <Icon source={icons.checkmark} />} 8-15
                characters
              </ValidationText>
              <ValidationText>
                {!upperCaseError && <Icon source={icons.checkmark} />} Capital
                letter
              </ValidationText>
            </ValidationRowContainer>
            <ValidationRowContainer>
              <ValidationText>
                {!numberError && <Icon source={icons.checkmark} />}Number
              </ValidationText>
              <ValidationText>
                {!usernameMatchError && <Icon source={icons.checkmark} />} Not
                your username
              </ValidationText>
            </ValidationRowContainer>
          </ValidationContainer>
        )}
        {form.value === 'confirmPassword' && (
          <React.Fragment>
            {confirmPasswordMatchError && <Text> Password should match</Text>}
          </React.Fragment>
        )}
      </>
    )
  }

  return (
    <Container>
      <FormContainer>
        {createTextField(signupForms[0], 0)}
        {createTextField(signupForms[1], 1)}
      </FormContainer>

      {signupForms.map((form, index) => {
        if (index <= 1) {
          return null
        }
        if (form.selector) {
          return (
            <Select
              dropDownRef={inputRefs.current[index]}
              label={form.label}
              key={form.label}
              data={secretQuestions}
              value={userForm[form.value]}
              rippleInsets={{ top: 0, bottom: -spacing(2) }}
              onChange={handleChangeInput(form.value)}
            />
          )
        }

        return createTextField(form, index)
      })}
      <LegalLinks />
      <Spacer8 />

      <SubmitButton
        variant="contained"
        maxWidth
        center
        onPress={signup}
        disabled={!okToSubmit() || isBusy || hasError}
        showSpinner={isBusy}
      >
        Create Account
      </SubmitButton>
      {!onboardingStepState.loginRegister && (
        <Button
          center
          textStyle={{ color: palette.linkGreen }}
          onPress={loginAsGuest}
          disabled={isBusy}
        >
          Enter as a Guest
        </Button>
      )}

      {/* prevent cut off buttons */}
      <Spacer />
      <KeyboardSpacer />
      <Alert
        isOpen={openModalState === 'EmailExists'}
        onDismiss={closeModal}
        title="This email already exists"
        description="This email is already in use. Would you like to try to login with the email?"
        buttons={[
          { title: 'LOGIN WITH EMAIL', onPress: existingEmailgoToLoginScreen },
        ]}
      />
    </Container>
  )
}

export default connector(SignupFormComponent)
