import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'

import Discovery from 'src/screens/home/Discovery'
import Categories from 'src/screens/home/Categories'
import SharedStack from 'src/navigation/stack/shared'

import Header from 'src/controls/navigation/MainHeader'
import Routes from 'src/constants/routes'
import StoreDetails from 'src/screens/myBN/StoreDetails'

const stackNavigator = createStackNavigator(
  {
    [Routes.HOME__MAIN]: {
      screen: Discovery,
      navigationOptions: ({ screenProps }) => ({
        title: 'Home',
        header: (headerProps) => <Header headerProps={headerProps} home />,
      }),
    },
    [Routes.HOME__CATEGORIES]: Categories,
    [Routes.HOME__STORE_DETAILS]: StoreDetails,
    ...SharedStack,
  },
  {
    initialRouteName: Routes.HOME__MAIN,
  },
)

export default stackNavigator
