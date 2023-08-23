import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'

import Routes from 'src/constants/routes'
import MainHeader from 'src/controls/navigation/MainHeader'
import Header from 'src/controls/navigation/Header'

import CartScreen from 'src/screens/cart/Cart'
import SelectStore from 'src/screens/cart/SelectStore'
import CartCheckoutScreen from 'src/screens/cart/Checkout'
import CartGiftOptions from 'src/screens/cart/CartGiftOptions'
import StoreDetails from 'src/screens/myBN/StoreDetails'
import EventDetails from 'src/screens/myBN/EventDetails'
import OrderSubmittedScreen from 'src/screens/cart/OrderSubmitted'
import NavSummary from 'src/components/Cart/NavSummary'
import VerifyShippingAddress from 'src/screens/cart/VerifyShippingAddress'
import Pdp from 'src/screens/pdp/Pdp'

const cartStackNavigator = createStackNavigator(
  {
    [Routes.CART__MAIN]: {
      screen: CartScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Cart',
        header: (headerProps) => (
          <MainHeader
            headerProps={headerProps}
            showProfileButton={false}
            rightComp={<NavSummary />}
          />
        ),
      }),
    },
    [Routes.CART__SELECT_STORE]: {
      screen: SelectStore,
      navigationOptions: {
        title: 'Cart',
      },
    },
    [Routes.CART__STORE_DETAILS]: StoreDetails,
    [Routes.CART__EVENT_DETAILS]: EventDetails,
    [Routes.CART__VERIFY_ADDRESS]: VerifyShippingAddress,
    [Routes.PDP__MAIN]: Pdp,
    [Routes.CART__GIFT_OPTIONS]: {
      screen: CartGiftOptions,
      navigationOptions: {
        title: 'Cart',
      },
    },

    [Routes.CART__CHECKOUT]: {
      screen: CartCheckoutScreen,
      navigationOptions: {
        title: 'Checkout',
      },
    },

    [Routes.CART__ORDERS]: {
      screen: OrderSubmittedScreen,
      navigationOptions: {
        title: 'Cart',
      },
    },
  },
  {
    // initialRouteName: Routes.CART__ORDERS,
    defaultNavigationOptions: {
      header: (headerProps) => (
        <Header headerProps={headerProps} ctaComponent={<NavSummary />} />
      ),
    },
  },
)

export default cartStackNavigator
