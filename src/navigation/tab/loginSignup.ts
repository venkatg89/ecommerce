import { createMaterialTopTabNavigator } from 'react-navigation-tabs'

import LoginScreen from 'src/screens/login/Login'
import SignupScreen from 'src/screens/login/Signup'

import Routes from 'src/constants/routes'

import MaterialTabBar from 'src/controls/navigation/MaterialTabBar'

export default createMaterialTopTabNavigator(
  {
    [Routes.MODAL__LOGIN]: {
      screen: LoginScreen,
      navigationOptions: ({ screenProps }) => ({
        tabBarLabel: 'Sign In',
      }),
    },
    [Routes.MODAL__SIGNUP]: {
      screen: SignupScreen,
      navigationOptions: ({ screenProps }) => ({
        tabBarLabel: 'Create Account',
      }),
    },
  },
  {
    backBehavior: 'none',
    tabBarComponent: MaterialTabBar,
  },
)
