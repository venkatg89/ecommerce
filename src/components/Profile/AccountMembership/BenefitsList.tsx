import React from 'react'
import { ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { BnMembershipModelRecord } from 'src/models/UserModel/MembershipModel'
import { bnMembershipSelector } from 'src/redux/selectors/myBn/membershipSelector'
import {
  CONTENT_VERTICAL_PADDING,
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'
import Benefits from './Benefits'
import { WebRoutes } from 'src/constants/routes'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'

const Container = styled.View`
  background-color: ${({ theme }) => theme.palette.lightYellow};
  padding-bottom: ${({ theme }) => theme.spacing(4)};
`

const BenefitContainer = styled.View`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const BenefitTitle = styled.Text`
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const SubText = styled.Text`
  ${({ theme }) => theme.typography.subtitle2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  transform: translateY(8px);
  text-align: center;
`

const ScrollContainer = styled.ScrollView``

const LinkText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  text-decoration: underline;
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ theme }) => theme.spacing(0.5)};
`

const ButtonWebView = styled.TouchableOpacity`
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const RowContainer = styled.View`
  flex-direction: row;
`

interface StateProps {
  bnMembership: Nullable<BnMembershipModelRecord>
  isLoggedIn: boolean
}

interface OwnProps {
  webviewOpen: (string) => string
}

const selector = createStructuredSelector({
  bnMembership: bnMembershipSelector,
  isLoggedIn: isUserLoggedInSelector,
})

const connector = connect<StateProps, {}>(selector)

type Props = StateProps & OwnProps

const MembershipBenefits = ({
  bnMembership,
  webviewOpen,
  isLoggedIn,
}: Props) => {
  const { width } = useResponsiveDimensions()
  const contentContainerStyle: ViewStyle = {
    alignItems: 'center',
    paddingVertical: CONTENT_VERTICAL_PADDING,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
  }

  return (
    <Container>
      <ScrollContainer contentContainerStyle={contentContainerStyle}>
        <BenefitContainer>
          <BenefitTitle>
            {!isLoggedIn ? 'B&N Member Benefits' : 'Your Member Benefits'}
          </BenefitTitle>
          <Benefits joined={!!bnMembership} />
        </BenefitContainer>
        <RowContainer>
          <SubText>View B&N Membership Program</SubText>
          <ButtonWebView
            onPress={() => webviewOpen(WebRoutes.MEMBERSHIP_TERMS_CONDITIONS)}
          >
            <LinkText>Terms & Conditions</LinkText>
          </ButtonWebView>
        </RowContainer>
      </ScrollContainer>
    </Container>
  )
}

export default connector(MembershipBenefits)
