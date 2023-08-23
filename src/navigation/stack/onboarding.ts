import { createStackNavigator } from 'react-navigation-stack'

import WelcomeScreen from 'src/screens/onboarding/Welcome'
import ChooseCategoryScreen from 'src/screens/onboarding/ChooseInterests'
import SharedStack from 'src/navigation/stack/shared'

import Routes from 'src/constants/routes'


export default createStackNavigator(
  {
    [Routes.ONBOARDING__CHOOSE_CATEGORY]: ChooseCategoryScreen,
    [Routes.ONBOARDING__WELCOME]: {
      screen: WelcomeScreen,
      navigationOptions: { header: () => null },
    },
    ...SharedStack,
  },
  {
    initialRouteName: Routes.ONBOARDING__WELCOME,
  },
)
