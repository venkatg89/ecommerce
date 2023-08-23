import { createMaterialTopTabNavigator } from 'react-navigation-tabs'

import Routes from 'src/constants/routes'

import MaterialTabBar from 'src/controls/navigation/MaterialTabBar'
import QuestionsList from 'src/screens/community/QuestionsList'
import QuestionCategories from 'src/screens/community/ChooseCategories'

export default createMaterialTopTabNavigator(
  {
    [Routes.COMMUNITY__QUESTIONS]: {
      screen: QuestionsList,
      navigationOptions: ({ screenProps }) => ({
        tabBarLabel: 'Questions',
      }),
    },
    [Routes.COMMUNITY__CHOOSE_CATEGORIES]: {
      screen: QuestionCategories,
      navigationOptions: ({ screenProps }) => ({
        tabBarLabel: 'Genres',
      }),
    },
  },
  {
    backBehavior: 'none',
    // because tabBarOptions does not support screenProps to access theme,
    // we need to pass back a styled TopTabBar
    tabBarComponent: MaterialTabBar,
  },
)
