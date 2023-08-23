import React, { useContext } from 'react'
import { Platform } from 'react-native'
import { ThemeContext } from 'styled-components/native'
import { BottomTabBar } from 'react-navigation-tabs'
import {
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'
import DeviceInfo from 'react-native-device-info'

const TabBar = (props) => {
  const { typography, palette, spacing } = useContext(ThemeContext)
  const { width } = useResponsiveDimensions()

  const fullBarStyle = {
    paddingTop: spacing(1),
    paddingHorizontal: DeviceInfo.isTablet()
      ? CONTENT_HORIZONTAL_PADDING(width)
      : 0,
    paddingBottom:
      Platform.OS === 'ios' && DeviceInfo.hasNotch() ? spacing(5) : spacing(1),
    width: '100%',
    height: 64,
    backgroundColor: palette.white,
  }
  const tabsContainerStyle = {}
  const labelStyle = {
    ...typography.navigation,
  }
  return (
    <BottomTabBar
      {...props}
      style={fullBarStyle}
      labelStyle={labelStyle}
      tabStyle={tabsContainerStyle}
      showLabel
      showIcon
      inactiveTintColor={palette.grey3}
      activeTintColor={palette.primaryGreen}
      adaptive={false}
    />
  )
}

export default TabBar
