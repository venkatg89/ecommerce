import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { NavigationInjectedProps } from 'react-navigation'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Header from 'src/controls/navigation/Header'
import ProfileSection from 'src/components/Profile/Settings/Section'
import ProfileWishLists from 'src/components/Profile/WishLists'
import ProfileOrderHistory from 'src/components/Profile/ProfileOrderHistory'
import AccountGuestMode from 'src/components/Profile/AccountGuest'

import { push, Routes } from 'src/helpers/navigationService'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import {
  myAtgAccountSelector,
  getMyProfileUidSelector,
} from 'src/redux/selectors/userSelector'
import { getCreditCardsAction } from 'src/redux/actions/shop/creditCardsAction'
import { fetchUserAction } from 'src/redux/actions/user/fetchUserAction'
import { icons } from 'assets/images'

const PageHeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
`

const Divider = styled.View`
  height: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.grey5};
  margin-vertical: ${({ theme }) => theme.spacing(4)};
`

interface StateProps {
  myProfileUid?: string
  atgAccount?: AtgAccountModel
}

const selector = createStructuredSelector({
  myProfileUid: getMyProfileUidSelector,
  atgAccount: myAtgAccountSelector,
})

interface DispatchProps {
  fetchUser: () => void
  getCreditCards: (params: { atgUserId: string }) => void
}

const dispatcher = (dispatch) => ({
  fetchUser: () => dispatch(fetchUserAction()),
  getCreditCards: (params: { atgUserId: string }) =>
    dispatch(getCreditCardsAction(params)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & NavigationInjectedProps & DispatchProps

const ProfileScreen = ({
  myProfileUid,
  atgAccount,
  fetchUser,
  getCreditCards,
}: Props) => {
  useEffect(() => {
    if (myProfileUid) {
      fetchUser()
    }
  }, [myProfileUid])

  useEffect(() => {
    if (atgAccount) {
      getCreditCards({ atgUserId: atgAccount.atgUserId })
    }
  }, [atgAccount])

  return (
    <Container>
      <ScrollContainer>
        {!!atgAccount ? (
          <>
            <PageHeaderText>{`Hi, ${atgAccount.firstName}`}</PageHeaderText>
            <ProfileOrderHistory />
            <Divider />
            <ProfileWishLists />
            <Divider />
            <ProfileSection
              title="My Account"
              details="Update settings, payments, and everything else."
              icon={<Icon source={icons.arrowRight} />}
              onPress={() => {
                push(Routes.PROFILE__MY_PROFILE)
              }}
            />
          </>
        ) : (
          <AccountGuestMode />
        )}
      </ScrollContainer>
    </Container>
  )
}

ProfileScreen.navigationOptions = () => ({
  title: 'Account',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(ProfileScreen)
