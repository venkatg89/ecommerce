import { createSwitchNavigator } from 'react-navigation'
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack'

import OnboardingStack from 'src/navigation/stack/onboarding'
import AppTab from 'src/navigation/tab/app'
import RootLoadingScreen from 'src/screens/RootLoading'

import Routes from 'src/constants/routes'
import { LoginStackWithHeader } from 'src/navigation/stack/loginSignupModal'

const MainRootNavigator = createSwitchNavigator(
  {
    [Routes.ROOT__LOADING]: RootLoadingScreen,
    [Routes.ONBOARDING]: OnboardingStack,
    [Routes.APP]: {
      screen: AppTab,
      path: 'app',
    },
  },
  {
    initialRouteName: Routes.ROOT__LOADING,
  },
)

export default createStackNavigator(
  {
    MainRootTabs: MainRootNavigator,
    LoginModal: LoginStackWithHeader,
  },
  {
    headerMode: 'none',
    mode: 'modal',
    defaultNavigationOptions: {
      ...TransitionPresets.ModalPresentationIOS,
      cardOverlayEnabled: true,
    },
  },
)
