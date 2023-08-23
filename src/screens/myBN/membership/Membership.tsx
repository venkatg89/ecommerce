import React, { useContext } from 'react'
import { ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled, { ThemeContext } from 'styled-components/native'

import _Button from 'src/controls/Button'
import Container from 'src/controls/layout/ScreenContainer'

import BnMembershipCard from 'src/components/BnMembershipCard'
import { BnMembershipModelRecord } from 'src/models/UserModel/MembershipModel'

import { bnMembershipSelector } from 'src/redux/selectors/myBn/membershipSelector'

import { navigate, push, Routes, Params, WebRoutes } from 'src/helpers/navigationService'
import BenefitList from 'src/screens/myBN/membership/BenefitList'
import { CONTENT_VERTICAL_PADDING, CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'

const BenefitContainer = styled.View`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const BenefitTitle = styled.Text`
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const TermsContainer = styled.View`
  padding-top: ${({ theme }) => theme.spacing(4)};
`

const AlreadyMemberText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const SubText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.black};
  transform: translateY(8px);
  text-align: center;
`

const ScrollContainer = styled.ScrollView`
`

const Flex = styled.View`
  flex-grow: 1;
  /* margin-bottom: 16; */
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
`

interface StateProps {
  bnMembership: Nullable<BnMembershipModelRecord>;
}

const selector = createStructuredSelector({
  bnMembership: bnMembershipSelector,
})

const connector = connect<StateProps, {}>(selector)

type Props = StateProps

const redirectToTerms = () => push(Routes.WEBVIEW__WITH_SESSION, { [Params.WEB_ROUTE]: WebRoutes.MEMBERSHIP_TERMS })
const redirectToBn = () => { push(Routes.WEBVIEW__WITH_SESSION, { [Params.WEB_ROUTE]: WebRoutes.MEMBERSHIP_MAIN }) }
const redirectToEdit = () => { push(Routes.WEBVIEW__WITH_SESSION, { [Params.WEB_ROUTE]: WebRoutes.MANAGE_MY_MEMBERSHIP }) }


const MyBnMembershipScreen = ({ bnMembership }: Props) => {
  const { palette } = useContext(ThemeContext)
  const { width } = useResponsiveDimensions()
  const contentContainerStyle: ViewStyle = {
    alignItems: 'center',
    paddingVertical: CONTENT_VERTICAL_PADDING,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
  }

  const navigateToAddMember = () => navigate(Routes.MY_BN__ADD_MEMBERSHIP)


  const benefitTitle = bnMembership ? 'Your Member Benefits' : 'B&N Member Benefits'

  return (
    <Container>
      <ScrollContainer contentContainerStyle={ contentContainerStyle }>
        <BnMembershipCard bnMembership={ bnMembership } />
        {!bnMembership && (
          <>
            <AlreadyMemberText>Already have a Membership?</AlreadyMemberText>
            <Button center onPress={ navigateToAddMember } textStyle={ { color: palette.linkGreen } }>
              Link your account
            </Button>
          </>
        )}
        <BenefitContainer>
          <BenefitTitle>{ benefitTitle }</BenefitTitle>
          <BenefitList joined={ !!bnMembership } />
        </BenefitContainer>
        { bnMembership
          ? (
            <React.Fragment>
              <Button
                center
                onPress={ redirectToEdit }
                textStyle={ { color: palette.linkGreen } }
              >
              Manage your membership
              </Button>
              <SubText>View B&N Membership Program</SubText>
              <Button
                center
                onPress={ redirectToTerms }
                textStyle={ { color: palette.linkGreen } }
              >
                Terms & Conditions
              </Button>
            </React.Fragment>
          )
          : (
            <Flex>
              <Button variant="contained" center onPress={ redirectToBn }>
                learn more on bn.com
              </Button>
              <TermsContainer>
                <SubText>View B&N Membership Program </SubText>
                <Button center textStyle={ { color: palette.linkGreen } } onPress={ redirectToTerms }>
                  Terms & Conditions
                </Button>
              </TermsContainer>
            </Flex>
          )}
      </ScrollContainer>
    </Container>
  )
}


export default connector(MyBnMembershipScreen)
