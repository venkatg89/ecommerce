import React, { ReactNode } from 'react'
import { Platform } from 'react-native'
import {
  SafeAreaView as RnSafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation'
import styled from 'styled-components/native'

const ContentIOS = styled(RnSafeAreaView)`
  flex: 1;
`

const ContentAndroid = styled.View`
  flex: 1;
`

const Content = styled.View`
  position: relative;
  flex: 1;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.white};
`

interface Props {
  children: ReactNode
  top?: boolean
  bottom?: boolean
  vertical?: boolean
  style?: any
}

const ScreenContainer = (props: Props) => {
  const { children, top, bottom, vertical, style } = props
  // Since SafeArea is inside Navigators and Headers and Tabs already
  // add the padding for us, sometimes we don't need to have the vertical
  // padding. We can let it automatically check but this can cause jumping
  // as the padding is added first then removed. Only add the padding
  // when needed (when navigators and headers are not present)
  const topInsetValue: SafeAreaViewForceInsetValue =
    top || vertical ? 'always' : 'never'
  const bottomInsetValue: SafeAreaViewForceInsetValue =
    bottom || vertical ? 'always' : 'never'
  const forceInset = {
    top: topInsetValue,
    bottom: bottomInsetValue,
    horizontal: 'always' as SafeAreaViewForceInsetValue, // for iphone X landscape mode
  }

  return Platform.OS === 'ios' ? (
    <ContentIOS accessible={false} forceInset={forceInset}>
      <Content style={style}>{children}</Content>
    </ContentIOS>
  ) : (
    <ContentAndroid accessible={false}>
      <Content style={style}>{children}</Content>
    </ContentAndroid>
  )
}

export default ScreenContainer
