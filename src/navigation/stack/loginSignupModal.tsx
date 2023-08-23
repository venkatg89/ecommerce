import React from 'react'

import { createStackNavigator } from 'react-navigation-stack'

import LoginSignupTab from 'src/navigation/tab/loginSignup'
import ResetPasswordScreen from 'src/screens/login/ResetPassword'

import Routes from 'src/constants/routes'
import LogoTopBar from 'src/controls/navigation/LogoTopBar'

export const LoginSignupModalStack = createStackNavigator(
  {
    _loginSignupTab: {
      screen: LoginSignupTab,
      // This is a TabContainer, so we need to put the options here
      navigationOptions: ({ screenProps }) => ({
        title: 'B&N Account',
        header: () => null,
      }),
    },
    [Routes.MODAL__RESET_PASSWORD]: {
      screen: ResetPasswordScreen,
      navigationOptions: ({ screenProps }) => ({
        header: () => null,
      }),
    },
  },
)

export const LoginStackWithHeader = {
  screen: LoginSignupModalStack,
  navigationOptions: {
    header: () => <LogoTopBar/>,
  },
}
