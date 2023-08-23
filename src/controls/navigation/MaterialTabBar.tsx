import React from 'react'
import { Dimensions, Platform, View } from 'react-native'
// @ts-ignore the built in type definition for react-navigation tabs is still incomplete
import { MaterialTopTabBar } from 'react-navigation-tabs'
import DeviceInfo from 'react-native-device-info'

const screenWidth = Dimensions.get('window').width
const smallPhone = screenWidth <= 334

// because tabBarOptions does not support screenProps to access theme,
// we need to pass back a styled TopTabBar
export default (props: any) => {
  const { screenProps: { theme }, navigationState: { routes } } = props
  const { width } = Dimensions.get('window')

  const horizontalSpacing = DeviceInfo.isTablet() ? theme.spacing(4) : theme.spacing(smallPhone ? 0 : 2)
  const tabBarWidth = width - (2 * horizontalSpacing)
  const indicatorWidth = tabBarWidth / routes.length

  return (
    <View
      style={ {
        backgroundColor: theme.palette.white,
        zIndex: 10,
        ...Platform.select({
          ios: {
            shadowColor: 'black',
            // shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
          },
          android: {
            elevation: 5,
          },
        }),
        justifyContent: 'center',
      } }
    >
      <MaterialTopTabBar
        { ...props }
        activeTintColor={ theme.palette.linkGreen }
        inactiveTintColor={ theme.palette.grey3 }
        indicatorStyle={ {
          backgroundColor: theme.palette.linkGreen,
          height: 3,
          width: indicatorWidth,
        } }
        style={ {
          backgroundColor: theme.palette.white,
          marginHorizontal: horizontalSpacing,
          shadowOpacity: 0,
          boxShadow: 'none',
          elevation: 0,
          border: 'none',
        } }
        tabStyle={ {
          width: indicatorWidth,
        } }
        labelStyle={ theme.typography.tab }
        upperCaseLabel={ false }
        keyboardHidesTabBar
      />
    </View>
  )
}
