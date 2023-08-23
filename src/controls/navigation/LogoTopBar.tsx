import React from 'react'
import { Dimensions } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import styled from 'styled-components/native'

import { logInImages } from 'assets/images'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const ITEM_WIDTH = DeviceInfo.isTablet() ? SCREEN_WIDTH / 3 : SCREEN_WIDTH / 1.9

const Container = styled.View`
  padding-top: ${({ theme }) => theme.spacing(6)};
  background-color: white;
  margin-bottom: 0
  margin-top: 0;
  width: 100%;
`

const LogoContainerIcon = styled.View`
  align-items: center;
  justify-content: flex-end;
`

const Image = styled.Image`
  width: ${ITEM_WIDTH};
`

const HorizontalLine = styled.View`
  border-top-width: 1;
  border-top-color: ${({ theme }) => theme.palette.grey5};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const LogoTopBar = () => {
  return (
    <Container>
      <LogoContainerIcon>
        <Image resizeMode="contain" source={logInImages.images.logo} />
      </LogoContainerIcon>
      <HorizontalLine />
    </Container>
  )
}

export default LogoTopBar
