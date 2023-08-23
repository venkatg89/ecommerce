import { createStackNavigator } from 'react-navigation-stack'

import Routes from 'src/constants/routes'

import Search from 'src/screens/search/Search'
import SharedStack from 'src/navigation/stack/shared'

const searchStackNavigator = createStackNavigator(
  {
    [Routes.SEARCH__MAIN]: Search,
    ...SharedStack,

  },
)

export default searchStackNavigator
