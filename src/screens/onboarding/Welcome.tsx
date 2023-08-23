import React, { useEffect, useState } from 'react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Dimensions, StatusBar, Platform, Image } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import _Button from 'src/controls/Button'
import _Container from 'src/controls/layout/ScreenContainer'

import { navigate, push, Routes } from 'src/helpers/navigationService'
import { navigateToNextOnboardingStepOrToHomeAction } from 'src/redux/actions/onboarding'

import LegalLinks from 'src/components/Onboarding/LegalLinks'
import LoginBackgroundCarousel from './LoginBackgroundCarousel'
import { logInImages } from 'assets/images'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { createStructuredSelector } from 'reselect'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

const PADDING = height > 700 ? 40 : 15

const STATUS_BAR_HEIGHT = getStatusBarHeight(true)

const WrappingContainer = styled.View`
  position: absolute;
  left: 0;
  align-items: stretch;
  bottom: 0;
  right: 0;
`

const Container = styled(_Container)`
  padding-top: ${PADDING};
  background-color: transparent;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${Platform.select({ ios: 0, android: 24 })};
`

const TextContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  ${Platform.OS === 'ios'
    ? `
  top: 37px
  `
    : `
  top: 55px
  `}
  align-items: center;
`

const TextButton = styled(_Button)`
  margin-top: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(2)}px;
  ${height === 844
    ? `
  top: -10px
  `
    : '8px'}
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  opacity: 0.92;
  ${height === 844
    ? `
  top: -15px
  `
    : ''}
`

const CarouselConatiner = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: row;
`

const ImageConatiner = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  align-items: center;
  z-index: 3;
`

const LegalLinksContainer = styled.View`
  ${height === 844
    ? `
  top: -15px
  `
    : ''}
`

const ButtonContainer = styled.View`
  ${Platform.OS === 'android'
    ? `
  top: 8px
  `
    : ''}
`

interface StateProps {
  atgProfile?: AtgAccountModel | undefined
}

const selector = createStructuredSelector({
  atgProfile: myAtgAccountSelector,
})

interface DispatchProps {
  navigateToNextOnboardingStepOrToHome(): void
}

const dispatcher = (dispatch) => ({
  navigateToNextOnboardingStepOrToHome: () =>
    dispatch(navigateToNextOnboardingStepOrToHomeAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const redirectToLogin = () => {
  navigate(Routes.MODAL__LOGIN)
}

const WelcomeScreen = ({
  navigateToNextOnboardingStepOrToHome,
  atgProfile,
}: Props) => {
  const [layoutHeight, setLayoutHeight] = useState(0)
  const [logoYPosition, setLogoYPosition] = useState(0)

  useEffect(() => {
    if (atgProfile) {
      push(Routes.HOME__MAIN)
    }
  }, [])

  const onLayout = (e) => {
    setLayoutHeight(e.nativeEvent.layout.y)
  }

  const onLogoLoad = (e) => {
    setLogoYPosition(e.nativeEvent.layout.height + PADDING + STATUS_BAR_HEIGHT)
  }

 let logoMarginTop = 35
 if (height > 736) {
   if (Platform.OS === 'ios') {
    logoMarginTop = 75
   }
 } else if (Platform.OS === 'android') {
  logoMarginTop = 10
  }

  return (
    <React.Fragment>
      <ImageConatiner>
        <Image
          style={{
            maxWidth: width * 0.9,
            top: logoMarginTop,
          }}
          resizeMode="contain"
          source={logInImages.images.logo}
          onLayout={onLogoLoad}
        />
      </ImageConatiner>
      <CarouselConatiner>
        <LoginBackgroundCarousel
          layoutHeight={layoutHeight}
          logoYPosition={logoYPosition}
        />
      </CarouselConatiner>
      <WrappingContainer>
        <StatusBar barStyle="light-content" />
        <Container vertical>
          <TextContainer onLayout={onLayout}>
            <ButtonContainer>
              <Button
                variant="contained"
                accessibilityHint="Press to login to your account"
                center
                onPress={redirectToLogin}
                maxWidth
              >
                Sign In
              </Button>
              <TextButton
                accessibilityHint="Press to begin onboarding process"
                center
                maxWidth
                onPress={navigateToNextOnboardingStepOrToHome}
              >
                enter as guest
              </TextButton>
            </ButtonContainer>
            <LegalLinksContainer>
              <LegalLinks onDarkBackground isSignUp={true} />
            </LegalLinksContainer>
          </TextContainer>
        </Container>
      </WrappingContainer>
    </React.Fragment>
  )
}

WelcomeScreen.navigationOptions = () => ({
  title: 'Get Started',
})

export default connector(WelcomeScreen)
