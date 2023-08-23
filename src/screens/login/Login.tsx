import React, {
  useContext,
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import {
  NativeModules,
  AccessibilityProps,
  StatusBar,
  Dimensions,
} from 'react-native'
import { icons } from 'assets/images'

import styled, { ThemeContext, withTheme } from 'styled-components/native'
import {
  Routes,
  Params,
  WebRoutes,
  navigate,
} from 'src/helpers/navigationService'
import Container from 'src/controls/layout/ScreenContainer'
import NavHeader from 'src/controls/navigation/Header'
import { NavigationMaterialTabOptions } from 'react-navigation-tabs'
import KeyboardAwareScrollView from 'src/controls/KeyboardAwareScrollView'
import { ThemeModel } from 'src/models/ThemeModel'
import _TextField from 'src/controls/form/TextField'
import _Button from 'src/controls/Button'
import _HelperText from 'src/controls/form/FormHelperText'

import { FormErrors, ErrorMessage } from 'src/models/FormModel'
import { LOGIN_FORM, SERVER_LOGIN } from 'src/constants/formErrors'
import { usePrevious } from 'src/helpers/usePrevious'
import {
  setformErrorMessagesAction,
  clearFormErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'
import { storeCredentialAndLogin } from 'src/redux/actions/login/loginAction'
import { uiLoginInProgressSelector } from 'src/redux/selectors/widgetSelector'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { isEmpty } from 'src/helpers/objectHelpers'
import checkEmailFormat from 'src/helpers/ui/checkEmailFormat'
import { passwordCheck } from 'src/helpers/passwordCheck'

const { RNSecureKeyStore } = NativeModules

const SCREEN_WIDTH = Dimensions.get('window').width
const asTwoLines = SCREEN_WIDTH < 760 // less than iPhone 8 or X width

const Content = styled(KeyboardAwareScrollView)`
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
  flex: 1;
`

const LoginFormContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
`

// Not for MVP, thus hidden.
// Unhide once social login is implemented.
const SocialLogin = styled.View`
  flex: 1;
  justify-content: center;
  display: none;
`
const Small = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.disabledGrey};
  margin-top: ${({ theme }) => theme.spacing(6)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  text-align: center;
`
const ForgotPassword = styled(_Button)`
  margin-top: ${({ theme }) => theme.spacing(6)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(1)}px;
  text-transform: uppercase;
`

const SocialButton = styled(_Button)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)}px;
  color: ${({ theme }) => theme.palette.white};
`

const FinePrintContainer = styled.View`
  flex-direction: ${asTwoLines ? 'column' : 'row'};
  align-items: center;
`

const FinePrint = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  font-size: 11px;
`

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const TermsButton = styled.TouchableOpacity`
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

const Underline = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.caption};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.palette.grey1};
`

const Space = styled.Text`
  height: 2;
  width: 2;
`

const TextDescription = styled.Text`
  ${({ theme }) => theme.typography.caption};
  align-items: center;
  color: ${({ theme }) => theme.palette.grey1};
`

const NegativeSpace = styled.Text`
  margin-top: -4;
  height: 1;
  width: 1;
`

const TextField = styled(_TextField)<AccessibilityProps>`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const IconButton = styled(_Button)``

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const HelperText = styled(_HelperText)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding-left: ${({ theme }) => theme.spacing(2)};
`

const redirectToAppAgreement = () => {
  navigate(Routes.WEBVIEW__WITH_SESSION, {
    [Params.WEB_ROUTE]: WebRoutes.APP_TERMS,
  })
}
const redirectToPrivacy = () => {
  navigate(Routes.WEBVIEW__WITH_SESSION, {
    [Params.WEB_ROUTE]: WebRoutes.PRIVACY_POLICY,
  })
}
const redirectToTermsOfUse = () => {
  navigate(Routes.WEBVIEW__WITH_SESSION, {
    [Params.WEB_ROUTE]: WebRoutes.TERMS_OF_USE,
  })
}

interface OwnProps {
  onDarkBackground?: boolean
}

interface States {
  username: string
  password: string
  showPassword: boolean
}

type StateKeys = keyof States

interface StateProps {
  uiLoginInProgress: boolean
  formError: FormErrors
}

const selector = createStructuredSelector({
  uiLoginInProgress: uiLoginInProgressSelector,
  formError: formErrorsSelector,
})

interface DispatchProps {
  loginFetch(username: string, password: string): void
  setError: (error: ErrorMessage) => void
  clearError: (formId: string) => void
}

const dispatcher = (dispatch) => ({
  loginFetch: (username, password) =>
    dispatch(storeCredentialAndLogin(username, password, true)),
  setError: (error) =>
    dispatch(setformErrorMessagesAction(LOGIN_FORM, [error])),
  clearError: (formId) => dispatch(clearFormErrorMessagesAction({ formId })),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps & OwnProps

const LoginScreen = ({
  navigation,
  loginFetch,
  clearError,
  formError,
  uiLoginInProgress,
  setError,
  onDarkBackground,
}: Props) => {
  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const inputRef = useRef<any>()
  const prevNavigation = usePrevious(navigation)
  const prevState = usePrevious({ username, password })
  const { palette } = useContext(ThemeContext)
  const textStyle = useMemo(() => ({ color: palette.linkGreen }), [palette])
  const theme = useContext(ThemeContext) as ThemeModel
  const shadow = onDarkBackground
  const textColor = onDarkBackground ? theme.palette.white : theme.palette.grey2

  useEffect(() => {
    if (prevNavigation) {
      const emailParam = navigation.getParam('_email', '')
      const passwordParam = navigation.getParam('_password', '')
      const prevEmailParam = prevNavigation.getParam('_email', '')
      const prevPasswordParam = prevNavigation.getParam('_password', '')
      const prevEmailState = prevState.username || ''
      const prevPasswordState = prevState.password || ''
      if (
        (emailParam !== prevEmailParam ||
          passwordParam !== prevPasswordParam) &&
        (emailParam !== prevEmailState || passwordParam !== prevPasswordState)
      ) {
        setUserName(emailParam)
        setPassword(passwordParam)
      }
    }
  }, [navigation, prevState, prevNavigation])

  const fetchNookKeyChain = async () => {
    const nookCred = await RNSecureKeyStore.getNook()
    if (nookCred && nookCred.currentEmail && nookCred.currentPass) {
      setUserName(nookCred.currentEmail)
      setPassword(nookCred.currentPass)
    }
  }

  useEffect(() => {
    fetchNookKeyChain()
    return () => {
      clearError(SERVER_LOGIN)
    }
  }, [])

  const login = () => {
    loginFetch(username, password)
  }

  const okToSubmit = () => {
    let valid = true
    if (formError[LOGIN_FORM] && !isEmpty(formError[LOGIN_FORM])) {
      valid = false
    }
    if (uiLoginInProgress) {
      valid = false
    }
    if (!username || !passwordCheck(password)) {
      valid = false
    }
    return valid
  }

  const enterNext = (field) => () => {
    if (field === 'password' && okToSubmit()) {
      login()
    } else {
      inputRef.current.focus()
    }
  }

  const handleTrimText = useCallback(
    (field) => () => {
      if (field === 'username' && !checkEmailFormat(username.trim())) {
        setError({
          formFieldId: field,
          error: 'Please enter a valid email address.',
        })
      } else if (
        field === 'password' &&
        (password.trim().length < 8 || password.trim().length > 15)
      ) {
        setError({
          formFieldId: field,
          error: 'Your password must be between 8-15 characters.',
        })
      } else {
        // with dynamic key typescript setState throw error
        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/26635
        switch (field) {
          case 'username':
            setUserName(username.trim())
            break
          case 'password':
            setPassword(password.trim())
            break
          default:
            break
        }
      }
    },
    [username, password],
  )

  const handleChangeText = (field: StateKeys) => (value) => {
    switch (field) {
      case 'username':
        setUserName(value)
        break
      case 'password':
        setPassword(value)
        break
      default:
        break
    }
  }
  const handleShowPassword = useCallback(() => setShowPassword(!showPassword), [
    showPassword,
  ])

  const busy = uiLoginInProgress
  const loginError =
    formError[SERVER_LOGIN] && formError[SERVER_LOGIN].loginError

  return (
    <Container bottom>
      <StatusBar barStyle="dark-content" />
      <Content>
        <LoginFormContainer>
          <TextField
            accessibilityLabel="Your email address"
            onChange={handleChangeText('username')}
            placeholder="Email"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={enterNext('username')}
            disabled={busy}
            value={username}
            formId={LOGIN_FORM}
            onEndEditing={handleTrimText('username')}
            formFieldId="username"
          />
          <TextField
            accessibilityLabel="your bn.com or nook or browsery password"
            inputRef={inputRef}
            onChange={handleChangeText('password')}
            value={password}
            returnKeyType="go"
            disabled={busy}
            placeholder="Password"
            onSubmitEditing={enterNext('password')}
            secureTextEntry={!showPassword}
            formId={LOGIN_FORM}
            formFieldId="password"
            onEndEditing={handleTrimText('password')}
            endAdornment={
              <IconButton
                accessibilityLabel={
                  showPassword ? 'hide password' : 'show password'
                }
                icon
                onPress={handleShowPassword}
              >
                {showPassword ? (
                  <Icon source={icons.eyeOff} />
                ) : (
                  <Icon source={icons.eyeOn} />
                )}
              </IconButton>
            }
          />
          {!!loginError && !busy && (
            <HelperText error={!!loginError}>{loginError}</HelperText>
          )}
        </LoginFormContainer>
        <FinePrintContainer>
          <FinePrint textColor={textColor} outlineShadow={shadow}>
            By continuing, I accept the
          </FinePrint>
          {!asTwoLines ? <Space /> : <NegativeSpace />}
          <ButtonContainer>
            <TermsButton onPress={redirectToAppAgreement}>
              <Underline textColor={textColor} outlineShadow={shadow}>
                App Agreement
              </Underline>
            </TermsButton>
            <FinePrint textColor={textColor} outlineShadow={shadow}>
              ,
            </FinePrint>
            <Space />
            <TermsButton onPress={redirectToTermsOfUse}>
              <Underline textColor={textColor} outlineShadow={shadow}>
                Terms of Use
              </Underline>
            </TermsButton>
            <Space />
            <TextDescription>and</TextDescription>
            <Space />
            <TermsButton onPress={redirectToPrivacy}>
              <Underline textColor={textColor} outlineShadow={shadow}>
                Privacy Policy
              </Underline>
            </TermsButton>
          </ButtonContainer>
        </FinePrintContainer>

        <SocialLogin>
          <Small>or you can</Small>
          <SocialButton
            size="small"
            onPress={() => {}}
            variant="contained"
            maxWidth
            center
          >
            SIGN UP WITH FACEBOOK
          </SocialButton>
          <SocialButton
            size="small"
            onPress={() => {}}
            variant="contained"
            maxWidth
            center
          >
            SIGN UP WITH GOOGLE
          </SocialButton>
        </SocialLogin>
        <ForgotPassword
          textStyle={textStyle}
          size="small"
          center
          onPress={() => {
            navigate(Routes.WEBVIEW__WITH_SESSION, {
              [Params.WEB_ROUTE]: WebRoutes.FORGOT_PASSWORD,
            })
          }}
        >
          Forgot password?
        </ForgotPassword>
      </Content>
      <Button
        onPress={login}
        variant="contained"
        disabled={!okToSubmit()}
        showSpinner={busy}
        maxWidth
        center
        isAnchor
      >
        Continue
      </Button>
    </Container>
  )
}

LoginScreen.navigationOptions = () =>
  ({
    header: (headerProps) => <NavHeader headerProps={headerProps} />,
  } as NavigationMaterialTabOptions)

export default withTheme(withNavigation(connector(LoginScreen)))
