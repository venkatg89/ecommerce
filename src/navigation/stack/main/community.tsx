import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'

import CommunityTab from 'src/navigation/tab/community'
import SharedStack from 'src/navigation/stack/shared'

import Header from 'src/controls/navigation/MainHeader'
import Routes from 'src/constants/routes'
import { submitAnswerContinueAction, CustomActions } from 'src/helpers/navigationHelper'

const stackNavigator = createStackNavigator(
  {
    [Routes.COMMUNITY__MAIN]: {
      screen: CommunityTab,
      navigationOptions: () => ({
        title: 'Community',
        header: headerProps => <Header headerProps={ headerProps } />,
      }),
      path: 'homefeed',
    },
    ...SharedStack,
  },
  {
    initialRouteName: Routes.COMMUNITY__MAIN,
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
