import { createMaterialTopTabNavigator } from 'react-navigation-tabs'

import Lists from 'src/screens/myBooks/ListsCollections'
import Library from 'src/screens/myBooks/NookLibrary'

import Routes from 'src/constants/routes'

import MaterialTabBar from 'src/controls/navigation/MaterialTabBar'

export default createMaterialTopTabNavigator(
  {
    [Routes.MY_BOOKS__LISTS_AND_COLLECTIONS]: {
      screen: Lists, navigationOptions: ({ screenProps }) => ({ tabBarLabel: 'Lists' }),
    },
    [Routes.MY_BOOKS__NOOK_LIBRARY]: {
      screen: Library, navigationOptions: ({ screenProps }) => ({ tabBarLabel: 'NOOK Library' }),
    },
  },
  {
    backBehavior: 'none',
    tabBarComponent: MaterialTabBar,
  },
)
