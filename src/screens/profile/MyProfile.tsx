import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'

import Container from 'src/controls/layout/ScreenContainer'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Header from 'src/controls/navigation/Header'
import Button from 'src/controls/Button'
import ProfileSection from 'src/components/Profile/Settings/Section'

import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import {
  myAtgAccountSelector,
  getMyProfileUidSelector,
} from 'src/redux/selectors/userSelector'
import { fetchUserAction } from 'src/redux/actions/user/fetchUserAction'

import { icons } from 'assets/images'
import { push, Routes, WebRoutes } from 'src/helpers/navigationService'
import { Linking } from 'react-native'
import MembershipHome from 'src/components/Home/MembershipHome'

import AppDetails from 'src/components/AppDetails'

const PageHeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
`

const SignOutButton = styled(Button)`
  color: ${({ theme }) => theme.palette.supportingError};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  padding-horizontal: ${({ theme }) => theme.spacing(2.5)}px;
  padding-vertical: ${({ theme }) => theme.spacing(1.5)}px;
  border: 1px ${({ theme }) => theme.palette.supportingError};
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
}

const dispatcher = (dispatch) => ({
  fetchUser: () => dispatch(fetchUserAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const MyProfileScreen = ({
  myProfileUid,
  atgAccount,
  fetchUser,
  navigation,
}: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  useEffect(() => {
    if (myProfileUid) {
      fetchUser()
    }
  }, [myProfileUid])

  useEffect(() => {
    navigation.setParams({ _account: atgAccount })
  }, [atgAccount])

  return (
    <Container>
      <ScrollContainer>
        {!!atgAccount ? (
          <>
            <PageHeaderText>My Account</PageHeaderText>
            <ProfileSection
              title="Account Settings"
              icon={<Icon source={icons.arrowRight} />}
              onPress={() => {
                push(Routes.ACCOUNT_SETTINGS)
              }}
            />
            <ProfileSection
              title="Payment Methods"
              icon={<Icon source={icons.arrowRight} />}
              onPress={() => {
                push(Routes.ACCOUNT_PAYMENT_METHODS)
              }}
            />
            <ProfileSection
              title="Address Book"
              icon={<Icon source={icons.arrowRight} />}
              onPress={() => {
                push(Routes.PROFILE__ADDRESS_BOOK)
              }}
            />
            <ProfileSection
              title="Gift Cards"
              icon={<Icon source={icons.arrowRight} />}
              onPress={() => {
                push(Routes.ACCOUNT__GIFT_CARDS)
              }}
            />
            <ProfileSection
              title="Memberships"
              icon={<Icon source={icons.arrowRight} />}
              onPress={() => {
                push(Routes.ACCOUNT__MEMBERSHIP)
              }}
            />
            <ProfileSection
              title="Notification Settings"
              icon={<Icon source={icons.arrowRight} />}
              onPress={() => {
                push(Routes.ACCOUNT__NOTIFICATIONS)
              }}
            />
            <ProfileSection
              title="Legal & Policies"
              icon={<Icon source={icons.arrowRight} />}
              onPress={() => {
                push(Routes.PROFILE__LEGAL)
              }}
            />
            <ProfileSection
              title="Help"
              icon={<Icon source={icons.browser} />}
              onPress={() => Linking.openURL(WebRoutes.HELP)}
            />
          </>
        ) : (
          <>
            <PageHeaderText>App Details</PageHeaderText>
            <ProfileSection
              title="Gift Cards"
              icon={<Icon source={icons.arrowRight} />}
              onPress={() => {
                push(Routes.ACCOUNT__GIFT_CARDS_BALANCE)
              }}
            />
            <ProfileSection
              title="Memberships"
              icon={<Icon source={icons.arrowRight} />}
              onPress={() => {
                setShowModal(true)
              }}
            />
            <ProfileSection
              title="Legal & Policies"
              icon={<Icon source={icons.arrowRight} />}
              onPress={() => {
                push(Routes.PROFILE__LEGAL)
              }}
            />
            <ProfileSection
              title="Help"
              icon={<Icon source={icons.browser} />}
              onPress={() => Linking.openURL(WebRoutes.HELP)}
            />
            {showModal && (
              <MembershipHome
                openModal={true}
                isGuest={true}
                handleMembershipModal={() => setShowModal(false)}
              />
            )}
          </>
        )}
      </ScrollContainer>
      {!!atgAccount && (
        <SignOutButton
          onPress={() => {
            push(Routes.PROFILE__SETTINGS)
          }}
          center
        >
          sign out
        </SignOutButton>
      )}
      <AppDetails />
    </Container>
  )
}

MyProfileScreen.navigationOptions = ({ navigation }) => {
  const isUserLogged = navigation.getParam('_account')
  return {
    title: isUserLogged ? 'My Account' : 'App Details',
    header: (headerProps) => <Header headerProps={headerProps} />,
  }
}

export default connector(MyProfileScreen)
