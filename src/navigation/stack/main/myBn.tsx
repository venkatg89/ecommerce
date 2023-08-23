import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'

import MyBnTab from 'src/navigation/tab/myBn'
import SharedStack from 'src/navigation/stack/shared'

import EventsScreen from 'src/screens/myBN/Events'
import EventDetailsScreen from 'src/screens/myBN/EventDetails'
import MyBnSearchStoreScreen from 'src/screens/myBN/SearchStore'

import MainHeader from 'src/controls/navigation/MainHeader'
import Routes from 'src/constants/routes'
import { submitAnswerContinueAction, CustomActions } from 'src/helpers/navigationHelper'
import StoreDetails from 'src/screens/myBN/StoreDetails'

const stackNavigator = createStackNavigator(
  {
    [Routes.MY_BN__SEARCH_STORE]: {
      screen: MyBnSearchStoreScreen,
      navigationOptions: {
        title: 'Stores',
        header: headerProps => <MainHeader headerProps={ headerProps } />,
      },
    },
    [Routes.MY_BN_TAB]: MyBnTab,
    [Routes.MY_BN__STORE_DETAILS]: StoreDetails,
    [Routes.MY_BN__EVENTS]: EventsScreen,
    [Routes.MY_BN__EVENT_DETAILS]: EventDetailsScreen,
    ...SharedStack,
  },
  {
    initialRouteName: Routes.MY_BN__SEARCH_STORE,
  },
)

const defaultGetStateForAction = stackNavigator.router.getStateForAction

stackNavigator.router.getStateForAction = (action, state) => {
  // @ts-ignore
  if (state && action.type === CustomActions.SUBMIT_NEW_ANSWER) {
    return submitAnswerContinueAction(action, state)
  }
  return defaultGetStateForAction(action, state)
}

export default stackNavigator
