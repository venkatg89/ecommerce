import React from 'react'
import styled from 'styled-components/native'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { StackActions } from 'react-navigation'

import MyBnStack from 'src/navigation/stack/main/myBn'
import HomeStack from 'src/navigation/stack/main/home'
import CafeStack from 'src/navigation/stack/main/cafe'
import CartStack from '../stack/main/cart'
import SearchStack from 'src/navigation/stack/main/search'

import Routes from 'src/constants/routes'
import BottomTabBar from 'src/controls/navigation/BottomTabBar'
import CartItemCount from 'src/components/Cart/CartItemCount'

import { nav } from 'assets/images'
import { store as reduxStore } from 'src/redux'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
import { checkCafeEnabledBreakAction } from 'src/redux/actions/modals/cafeEnabled'
import { setRouteToRedirectPostLoginAction } from 'src/redux/actions/onboarding'
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack'
import { View } from 'react-native'

interface IconProps {
  active: boolean
}

const Icon = styled.Image<IconProps>`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  tint-color: ${({ active, theme }) =>
    active ? theme.palette.primaryGreen : theme.palette.grey3};
`

interface TabBarIconProps {
  focused: boolean
}

const MainBottomTabNavigator = createBottomTabNavigator(
  {
    [Routes.HOME_TAB]: {
      screen: HomeStack,
      path: 'home',
      navigationOptions: ({ screenProps }) => ({
        tabBarIcon: ({ focused }: TabBarIconProps) => {
          const { home, activeHome } = nav.tabs
          const icon = focused ? activeHome : home
          return <Icon active={focused} source={icon} />
        },
        tabBarLabel: 'Home',
      }),
    },
    [Routes.MY_BN_TAB]: {
      screen: MyBnStack,
      navigationOptions: ({ screenProps }) => ({
        tabBarIcon: ({ focused }: TabBarIconProps) => {
          const { store, activeStore } = nav.tabs
          const icon = focused ? activeStore : store
          return <Icon active={focused} source={icon} />
        },
        tabBarLabel: 'Stores',
      }),
    },
    [Routes.CART_TAB]: {
      screen: CartStack,
      path: 'cart',
      navigationOptions: ({ screenProps }) => ({
        tabBarIcon: ({ focused }: TabBarIconProps) => {
          const { cart, activeCart } = nav.tabs
          const icon = focused ? activeCart : cart
          return (
            <>
              <Icon active={focused} source={icon} />
              <CartItemCount />
            </>
          )
        },
        tabBarLabel: 'Cart',
      }),
    },
    [Routes.SEARCH_TAB]: {
      screen: SearchStack,
      navigationOptions: ({ screenProps }) => ({
        tabBarIcon: ({ focused }: TabBarIconProps) => {
          const { search, activeSearch } = nav.tabs
          const icon = focused ? activeSearch : search
          return <Icon active={focused} source={icon} />
        },
        tabBarLabel: 'Search',
      }),
    },
    [Routes.CAFE_TAB]: {
      screen: () => <View />,
      path: 'cafe',
      navigationOptions: ({ screenProps }) => ({
        tabBarIcon: ({ focused }: TabBarIconProps) => {
          const { cafe, activeCafe } = nav.tabs
          const icon = focused ? activeCafe : cafe
          return <Icon active={focused} source={icon} />
        },
        tabBarLabel: 'Cafe',
      }),
    },
  },
  {
    defaultNavigationOptions: () => ({
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        // Since cafe is linked with being login, block the cafe tab if user is logged out
        if (
          navigation.state.routeName === Routes.CAFE_TAB ||
          navigation.state.routeName === Routes.MY_BOOKS_TAB
        ) {
          if (reduxStore.dispatch(checkIsUserLoggedOutToBreakAction())) {
            reduxStore.dispatch(
              setRouteToRedirectPostLoginAction({
                route: navigation.state.routeName,
              }),
            )
            return
          }
        }
        // We want to present the cafe screens modally, so we intercept the tab press here
        // and manually navigate to the first cafe screen
        if (navigation.state.routeName === Routes.CAFE_TAB) {
          if (!reduxStore.dispatch(checkCafeEnabledBreakAction())) {
            const state = reduxStore.getState()
            if (state.cafe.cart.items.length > 0) {
              navigation.navigate(Routes.CAFE__CHECKOUT__MAINTAB)
            } else {
              navigation.navigate(Routes.CAFE__MAIN)
            }
          }
          return
        }
        // by default, the tab will only pop on pressed if the tab is the one the user is
        // currently on, if we're navigating to a different tab, the new tab isn't popped
        // to top. There is a `resetOnblur`, however that causes the tab itself to remount
        // which causes refetching and rerendering. So instead, we handle the other case
        // of popping tab stack to top of stack whenever tab is changed below
        if (!navigation.isFocused() && navigation.state.index > 0) {
          navigation.dispatch(StackActions.popToTop({ immediate: true }))
        }
        defaultHandler()
      },
    }),
    tabBarComponent: (props) => <BottomTabBar {...props} />,
  },
)

const MainStackNavigator = createStackNavigator(
  {
    MainTabs: MainBottomTabNavigator,
    CafeModal: CafeStack,
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

export default MainStackNavigator
