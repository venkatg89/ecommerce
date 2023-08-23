import React from 'react'
import { ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { icons } from 'assets/images'
import _Button from 'src/controls/Button'
import { BnMembershipModelRecord } from 'src/models/UserModel/MembershipModel'
import MembershipCard from 'src/components/Profile/AccountMembership/MembershipCard'
import { bnMembershipSelector } from 'src/redux/selectors/myBn/membershipSelector'
import {
  CONTENT_VERTICAL_PADDING,
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'

const Container = styled.View`
  background-color: ${({ theme }) => theme.palette.lightYellow};
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`

const ScrollContainer = styled.View`
  padding-bottom: ${({ theme }) => theme.spacing(2)}px;
  align-items: center;
`

const LinkButtonContainer = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing(2)}px;
  margin-top: ${({ theme }) => theme.spacing(3)}px;
`

const LinkButton = styled(_Button)``

const ButtonClose = styled(_Button)`
  padding-right: ${({ theme }) => theme.spacing(2)}px;
  margin-top: -${({ theme }) => theme.spacing(2)}px;
`

const TopLineContainer = styled.View`
  align-items: center;
  justify-content: center;
`

const TopLine = styled.View`
  background-color: ${({ theme }) => theme.palette.grey5};
  margin-top: ${({ theme }) => theme.spacing(1)};
  width: 29;
  height: 4;
`

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const TopHeader = styled.Text`
  flex: 1;
  text-align: center;
  ${({ theme }) => theme.typography.heading1};
  color: ${({ theme }) => theme.palette.grey1};
  padding-left: ${({ theme }) => theme.spacing(6)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const IconClose = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

interface StateProps {
  bnMembership: Nullable<BnMembershipModelRecord>
  isLoggedIn: boolean
}

interface OwnProps {
  modalBenefitsClose: () => void
  openLoginModal?: () => void
}

const selector = createStructuredSelector({
  bnMembership: bnMembershipSelector,
  isLoggedIn: isUserLoggedInSelector,
})

const connector = connect<StateProps, {}>(selector)

type Props = StateProps & OwnProps

const MembershipBenefits = ({
  bnMembership,
  modalBenefitsClose,
  isLoggedIn,
  openLoginModal,
}: Props) => {
  const { width } = useResponsiveDimensions()
  const contentContainerStyle: ViewStyle = {
    alignItems: 'center',
    paddingVertical: CONTENT_VERTICAL_PADDING,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
  }

  return (
    <Container>
      <TopLineContainer>
        <TopLine />
      </TopLineContainer>
      <Wrapper>
        <TopHeader>Membership</TopHeader>
        <ButtonClose icon onPress={modalBenefitsClose}>
          <IconClose source={icons.actionClose} />
        </ButtonClose>
      </Wrapper>
      <ScrollContainer contentContainerStyle={contentContainerStyle}>
        <MembershipCard
          bnMembership={bnMembership}
          modalBenefitsClose={modalBenefitsClose}
        />
        {!isLoggedIn && (
          <LinkButtonContainer>
            <LinkButton
              onPress={openLoginModal}
              variant="contained"
              maxWidth
              center
              large
            >
              + LINK MEMBERSHIP
            </LinkButton>
          </LinkButtonContainer>
        )}
      </ScrollContainer>
    </Container>
  )
}

export default connector(MembershipBenefits)
