import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'

import myBookTabs from 'src/navigation/tab/myBooks'
import SharedStack from 'src/navigation/stack/shared'

import Header from 'src/controls/navigation/MainHeader'
import Routes from 'src/constants/routes'
import { submitAnswerContinueAction, CustomActions } from 'src/helpers/navigationHelper'

const stackNavigator = createStackNavigator(
  {
    [Routes.MY_BOOKS_TAB]: {
      screen: myBookTabs,
      navigationOptions: {
        title: 'My Books',
        header: headerProps => <Header headerProps={ headerProps } />,
      },
    },
    ...SharedStack,
  },
  {
    initialRouteName: Routes.MY_BOOKS_TAB,
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
