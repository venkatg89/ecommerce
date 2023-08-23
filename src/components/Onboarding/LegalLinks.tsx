import React, { useContext } from 'react'
import { Dimensions } from 'react-native'
import styled, { ThemeContext } from 'styled-components/native'

import {
  WebRoutes,
  navigate,
  Params,
  Routes,
} from 'src/helpers/navigationService'
import { ThemeModel } from 'src/models/ThemeModel'

const SCREEN_WIDTH = Dimensions.get('window').width
const asTwoLines = SCREEN_WIDTH < 700 // less than iPhone 8 or X width

interface Props {
  onDarkBackground?: boolean
  isSignUp?: boolean
}

interface TextColor {
  textColor: string
  outlineShadow?: boolean
}

const FinePrintContainer = styled.View`
  flex-direction: ${asTwoLines ? 'column' : 'row'};
  align-items: center;
`

const FinePrint = styled.Text<TextColor>`
  color: ${({ theme }) => theme.palette.grey1};
  font-size: 11px;
`

const NegativeSpace = styled.Text`
  margin-top: -4;
  height: 1;
  width: 1;
`

const Space = styled.Text`
  height: 2;
  width: 2;
`

const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const TermsButton = styled.TouchableOpacity`
  padding-top: 8;
  padding-bottom: 8;
`

const Underline = styled.Text<TextColor>`
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.caption};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.palette.grey1};
`

const PolicyText = styled.Text`
  ${({ theme }) => theme.typography.caption};
  align-items: center;
  color: ${({ theme }) => theme.palette.grey1};
  top: -5px;
`

const TextDescription = styled.Text`
  ${({ theme }) => theme.typography.caption};
  align-items: center;
  color: ${({ theme }) => theme.palette.grey1};
`

const Container = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const redirectToAppAgreement = () => {
  navigate(Routes.WEBVIEW__WITH_SESSION, {
    [Params.WEB_ROUTE]: WebRoutes.APP_TERMS,
  })
}
const redirectToPrivacy = () => {
  navigate(Routes.WEBVIEW__WITH_SESSION, {
    [Params.WEB_ROUTE]: WebRoutes.PRIVACY_POLICY,
  })
}
const redirectToTermsOfUse = () => {
  navigate(Routes.WEBVIEW__WITH_SESSION, {
    [Params.WEB_ROUTE]: WebRoutes.TERMS_OF_USE,
  })
}

export default (props: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const textColor = props.onDarkBackground
    ? theme.palette.white
    : theme.palette.grey2
  const shadow = props.onDarkBackground
  const isSignUp = props.isSignUp

  return (
    <Container>
      <FinePrintContainer>
        <FinePrint textColor={textColor} outlineShadow={shadow}>
          By continuing, I accept the
        </FinePrint>
        {!asTwoLines ? <Space /> : <NegativeSpace />}
        <ButtonContainer>
          <TermsButton onPress={redirectToAppAgreement}>
            <Underline textColor={textColor} outlineShadow={shadow}>
              App Agreement
            </Underline>
          </TermsButton>
          <FinePrint textColor={textColor} outlineShadow={shadow}>
            ,
          </FinePrint>
          <Space />
          <TermsButton onPress={redirectToTermsOfUse}>
            <Underline textColor={textColor} outlineShadow={shadow}>
              Terms of Use
            </Underline>
          </TermsButton>
          <Space />
          <TextDescription>and</TextDescription>
          <Space />
          <TermsButton onPress={redirectToPrivacy}>
            <Underline textColor={textColor} outlineShadow={shadow}>
              Privacy Policy
            </Underline>
          </TermsButton>
        </ButtonContainer>
      </FinePrintContainer>
      {isSignUp && (
        <PolicyText>
          As described in our Privacy Policy, we share your information
          collected in this App with 3rd party service providers who provide
          services on our behalf.
        </PolicyText>
      )}
    </Container>
  )
}
