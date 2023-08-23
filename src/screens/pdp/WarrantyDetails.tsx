import React from 'react'
import { ViewStyle, Text } from 'react-native'
import styled from 'styled-components/native'
import Header from 'src/controls/navigation/Header'

import Container from 'src/controls/layout/ScreenContainer'
import { push, Routes, Params, WebRoutes } from 'src/helpers/navigationService'

import {
  CONTENT_VERTICAL_PADDING,
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'
import { icons } from 'assets/images'

const redirectToTCS = () => {
  push(Routes.WEBVIEW__WITH_SESSION, {
    [Params.WEB_ROUTE]: WebRoutes.NOOK_PROTECTION_PLAN_TCS,
  })
}

const ScrollContainer = styled.ScrollView``

const ProtectionPlanDetails = () => {
  const { width } = useResponsiveDimensions()
  const contentContainerStyle: ViewStyle = {
    alignItems: 'center',
    paddingVertical: CONTENT_VERTICAL_PADDING,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
  }

  return (
    <Container>
      <ScrollContainer contentContainerStyle={contentContainerStyle}>
        <TextContainer>
          <H2>Barnes & Noble Protection Plan</H2>
          <PlanBodyHolder>
            <PlanBody>
              Every NOOK comes with one year of customer support and mechanical
              breakdown coverage through its standard limited warranty. NOOK
              Protect extends your coverage to two years from the original
              purchase date and adds coverage for accidental mishaps such as
              drops, falls, spills, broken or cracked screens. No deductible or
              hidden charges. If your NOOK isn't fit for duty as a result of a
              covered breakdown, we'll replace it at no cost to you. Exclusions
              and limitations apply. For full coverage details and provider
              information, see{' '}
            </PlanBody>
            <TCSButton onPress={redirectToTCS}>
              <TCSLink>Terms and Conditions.</TCSLink>
            </TCSButton>
          </PlanBodyHolder>
        </TextContainer>
        <FeaturesContainer>
          <Row border>
            <LeftCell>
              <FeatBoldText>Features</FeatBoldText>
            </LeftCell>
            <Cell>
              <FeatBoldText>Standard Warranty</FeatBoldText>
              <FeatBodyText>(1 Year)</FeatBodyText>
            </Cell>
            <Cell>
              <FeatBoldText>NOOK Protect™</FeatBoldText>
              <FeatBodyText>(2 Years)</FeatBodyText>
            </Cell>
          </Row>
          <Row border>
            <LeftCell>
              <FeatBoldText>Customer Support</FeatBoldText>
            </LeftCell>
            <Cell>
              <Icon source={icons.checkmark} />
            </Cell>
            <Cell>
              <Icon source={icons.checkmark} />
            </Cell>
          </Row>
          <Row border>
            <LeftCell>
              <FeatBoldText>Mechanical</FeatBoldText>
              <FeatBoldText>Breakdowns</FeatBoldText>
            </LeftCell>
            <Cell>
              <Icon source={icons.checkmark} />
            </Cell>
            <Cell>
              <Icon source={icons.checkmark} />
            </Cell>
          </Row>

          <Row>
            <LeftCell>
              <FeatBoldText>Accident Damage</FeatBoldText>
              <FeatBodyText>• Drops</FeatBodyText>
              <FeatBodyText>• Spills</FeatBodyText>
              <FeatBodyText>• Other Accidents</FeatBodyText>
            </LeftCell>
            <Cell></Cell>
            <Cell>
              <Icon source={icons.checkmark} />
              <Icon source={icons.checkmark} />
              <Icon source={icons.checkmark} />
            </Cell>
          </Row>
        </FeaturesContainer>
      </ScrollContainer>
    </Container>
  )
}

ProtectionPlanDetails.navigationOptions = ({ navigation }) => {
  return {
    header: (headerProps) => <Header headerProps={headerProps} />,
  }
}

export default ProtectionPlanDetails

const TCSButton = styled.TouchableOpacity`
  flex-direction: row;
`

const FeaturesContainer = styled.View`
  flex: 1;
  width: 100%;
`
const TextContainer = styled.View`
  flex: 1;
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing(3)}px;
  padding-bottom: ${({ theme }) => theme.spacing(3)}px;
`
const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-bottom-color: ${({ theme }) => theme.palette.grey4};
  border-bottom-width: ${(props) => (props.border ? '1' : '0')};
  padding-bottom: ${({ theme }) => theme.spacing(1)}px;
  padding-top: ${({ theme }) => theme.spacing(1)}px;
`
const LeftCell = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  width: 35%;
`
const Cell = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 33%;
`

const H2 = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
`

const PlanBodyHolder = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  flex-direction: row;
`

const PlanBody = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
`

const TCSLink = styled(Text)`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.linkGreen};
`

const FeatBoldText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
`
const FeatBodyText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-top: ${({ theme }) => theme.spacing(1)}px;
  text-align: left;
`
const Icon = styled.Image`
  width: 24;
  height: 24;
  tint-color: ${({ theme }) => theme.palette.primaryGreen};
  margin-top: ${({ theme }) => theme.spacing(0.5)}px;
`
