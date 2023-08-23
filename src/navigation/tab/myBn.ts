import { createMaterialTopTabNavigator } from 'react-navigation-tabs'

import MyBnStoreDetailsScreen from 'src/screens/myBN/StoreDetails'
import MyBnCouponsScreen from 'src/screens/myBN/Coupons'
import MyBnMembershipScreen from 'src/screens/myBN/membership/Membership'

import Routes from 'src/constants/routes'

import MaterialTabBar from 'src/controls/navigation/MaterialTabBar'

export default createMaterialTopTabNavigator(
  {
    [Routes.MY_BN__STORE_DETAILS]: {
      screen: MyBnStoreDetailsScreen,
      navigationOptions: ({ screenProps }) => ({ tabBarLabel: 'Details' }),
    },
    [Routes.MY_BN__COUPONS]: {
      screen: MyBnCouponsScreen,
      navigationOptions: ({ screenProps }) => ({ tabBarLabel: 'Coupons' }),
    },
    [Routes.MY_BN__MEMBERSHIP]: {
      screen: MyBnMembershipScreen,
      navigationOptions: ({ screenProps }) => ({ tabBarLabel: 'Member' }),
    },
  },
  {
    backBehavior: 'none',
    tabBarComponent: MaterialTabBar,
  },
)
