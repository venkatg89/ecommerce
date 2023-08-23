import React from 'react'

import { createStackNavigator } from 'react-navigation-stack'

import CafeScreen from 'src/screens/cafe/Cafe'
import CafeCategoriesScreen from 'src/screens/cafe/Categories'
import CafeItemsScreen from 'src/screens/cafe/Items'
import CafeItemOptionsScreen from 'src/screens/cafe/ItemOptions'
import CafeCheckoutScreen from 'src/screens/cafe/Checkout'
import CafeChoosePaymentCardScreen from 'src/screens/cafe/ChoosePaymentCard'
import CafeAddPaymentCardScreen from 'src/screens/cafe/AddPaymentCard'
import AddMembershipCard from 'src/screens/myBN/membership/AddMembershipCard'
import CafeSearchVenuesScreen from 'src/screens/cafe/SearchVenues'
import CafeStoreDetails from 'src/screens/cafe/VenueDetails'
import CafeEventDetails from 'src/screens/myBN/EventDetails'
import CafeOrderReceivedScreen from 'src/screens/cafe/OrderReceived'

import SharedStack from 'src/navigation/stack/shared'

import Routes from 'src/constants/routes'
import {
  submitAnswerContinueAction,
  CustomActions,
} from 'src/helpers/navigationHelper'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import styled from 'styled-components/native'
import { nav } from 'assets/images'
import CafeModalHeader from 'src/controls/navigation/CafeModalHeader'
import TabBarCheckoutIcon from 'src/components/Cafe/TabBarCheckoutIcon'

interface IconProps {
  active: boolean
}

interface TabBarIconProps {
  focused: boolean
}

const TabIcon = styled.Image<IconProps>`
  width: ${({ theme }) => theme.spacing(4)};
  height: ${({ theme }) => theme.spacing(4)};
  tint-color: ${({ active, theme }) =>
    active ? theme.palette.primaryGreen : theme.palette.grey3};
`

const stackNavigator = createStackNavigator(
  {
    [Routes.CAFE__MAIN]: {
      screen: CafeScreen,
      path: 'cafe_home',
      navigationOptions: {
        headerTitle: 'Café',
      },
    },
    [Routes.CAFE__ORDERS]: {
      screen: CafeOrderReceivedScreen,
      path: 'cafe_orders',
      navigationOptions: {
        headerTitle: '',
      },
    },
    [Routes.CAFE__CATEGORIES]: CafeCategoriesScreen,
    [Routes.CAFE__ITEMS]: CafeItemsScreen,
    [Routes.CAFE__ITEM_OPTIONS]: CafeItemOptionsScreen,
    [Routes.CAFE__CHOOSE_PAYMENT_CARD]: CafeChoosePaymentCardScreen,
    [Routes.MY_BN__ADD_MEMBERSHIP]: AddMembershipCard,
    [Routes.CAFE__ADD_PAYMENT_CARD]: CafeAddPaymentCardScreen,
    [Routes.CAFE__SEARCH_VENUES]: {
      screen: CafeSearchVenuesScreen,
    },
    [Routes.CAFE__STORE_DETAILS]: CafeStoreDetails,
    [Routes.CAFE__EVENT_DETAILS]: CafeEventDetails,
    ...SharedStack,
  },
  {
    defaultNavigationOptions: () => ({
      header: (headerProps) => <CafeModalHeader headerProps={headerProps} />,
      headerTitle: 'Café',
    }),
    initialRouteName: Routes.CAFE__MAIN,
  },
)

const checkoutStackNavigator = createStackNavigator(
  {
    [Routes.CAFE__CHECKOUT]: CafeCheckoutScreen,
    [Routes.CAFE__CHOOSE_PAYMENT_CARD]: CafeChoosePaymentCardScreen,
    [Routes.MY_BN__ADD_MEMBERSHIP]: AddMembershipCard,
    [Routes.CAFE__ORDERS]: CafeOrderReceivedScreen,
    [Routes.CAFE__ADD_PAYMENT_CARD]: CafeAddPaymentCardScreen,
  },
  {
    defaultNavigationOptions: () => ({
      header: (headerProps) => <CafeModalHeader headerProps={headerProps} />,
    }),
    initialRouteName: Routes.CAFE__CHECKOUT,
  },
)

const tabNavigator = createBottomTabNavigator(
  {
    [Routes.CAFE__MAINTAB]: {
      screen: stackNavigator,
      navigationOptions: ({ screenProps }) => ({
        tabBarIcon: ({ focused }: TabBarIconProps) => {
          const { cafe, activeCafe } = nav.tabs
          const icon = focused ? activeCafe : cafe
          return <TabIcon active={focused} source={icon} />
        },
        tabBarLabel: () => null,
      }),
    },
    [Routes.CAFE__CHECKOUT__MAINTAB]: {
      screen: checkoutStackNavigator,
      navigationOptions: ({ screenProps }) => ({
        tabBarIcon: ({ focused }: TabBarIconProps) => {
          return <TabBarCheckoutIcon focused={focused} />
        },
        tabBarLabel: () => null,
      }),
    },
  },
  {},
)

const defaultGetStateForAction = stackNavigator.router.getStateForAction

stackNavigator.router.getStateForAction = (action, state) => {
  // @ts-ignore
  if (state && action.type === CustomActions.SUBMIT_NEW_ANSWER) {
    return submitAnswerContinueAction(action, state)
  }
  return defaultGetStateForAction(action, state)
}

export default tabNavigator
