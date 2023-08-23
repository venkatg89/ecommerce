import React, { ReactNode } from 'react'
import { Platform } from 'react-native'
import { SafeAreaView as RnSafeAreaView, SafeAreaViewForceInsetValue } from 'react-navigation'
import styled from 'styled-components/native'

const ContentIOS = styled(RnSafeAreaView)`
  background-color: ${({ theme }) => theme.layout.bg};
`

const ContentAndroid = styled.View`
  background-color: ${({ theme }) => theme.layout.bg};
`

interface Props {
  children?: ReactNode;
  style?: any;
}

// use a separate one from screens since screen needs flex to span viewport
const HeaderContainer = ({ children, style }: Props) => {
  const forceInset = {
    top: 'always' as SafeAreaViewForceInsetValue,
    bottom: 'never' as SafeAreaViewForceInsetValue,
    horizontal: 'always' as SafeAreaViewForceInsetValue,
  }
  return Platform.OS === 'ios'
    ? (
      <ContentIOS forceInset={ forceInset }>
        { children }
      </ContentIOS>
    )
    : (
      <ContentAndroid>
        { children }
      </ContentAndroid>
    )
}

export default HeaderContainer
