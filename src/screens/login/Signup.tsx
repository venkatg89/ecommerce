import React from 'react'
import styled from 'styled-components/native'
import { View, StatusBar } from 'react-native'

import SignupForm from 'src/components/Signup/SignupForm'
import Container from 'src/controls/layout/ScreenContainer'

import KeyboardAwareScrollView from 'src/controls/KeyboardAwareScrollView'
import { CONTENT_WIDTH, useResponsiveDimensions } from 'src/constants/layout'
import DeviceInfo from 'react-native-device-info'


interface ContainerProps {
  currentWidth: number
}

const ScrollContainer = styled(KeyboardAwareScrollView)<ContainerProps>`
  padding-horizontal: ${({ theme }) => theme.spacing(2)}px;
  padding-vertical: ${({ theme }) => theme.spacing(3)}px;
  ${({ currentWidth }) => DeviceInfo.isTablet() && `max-width: ${CONTENT_WIDTH(currentWidth)};`}
`

const style = {
  alignItems: 'center',
}

const SignupScreen = () => {
  const { width } = useResponsiveDimensions()
  return (
    <Container bottom style={ style }>
      {/* do not styled scroll view container View, it will affect to scollview height */}
      {/* https://github.com/facebook/react-native/issues/3422 */}
      <StatusBar barStyle="dark-content" />
      <View>
        <ScrollContainer currentWidth={ width }>
          <SignupForm />
        </ScrollContainer>
      </View>
    </Container>
  )
}

export default SignupScreen
