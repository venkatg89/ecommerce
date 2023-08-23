import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Header from 'src/controls/navigation/Header'
import ProfileSection from 'src/components/Profile/Settings/Section'

import { icons } from 'assets/images'
import { push, Routes, WebRoutes } from 'src/helpers/navigationService'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { createStructuredSelector } from 'reselect'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'
import { connect } from 'react-redux'
import { Linking } from 'react-native'
import { fetchAtgAccountAction } from 'src/redux/actions/user/atgAccountAction'

const PageHeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
`

const DigitalRightRequest = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
`

const RowContainer = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(2)};
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(4)};
`

const IconClickable = styled.TouchableOpacity``

interface StateProps {
  atgAccount?: AtgAccountModel
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
})

interface DispatchProps {
  fetchAtgAccount(): void
}

const dispatcher = (dispatch) => ({
  fetchAtgAccount: () => dispatch(fetchAtgAccountAction()),
})

const connector = connect<StateProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const AccountSettingsScreen = ({ atgAccount, fetchAtgAccount }: Props) => {
  useEffect(() => {
    fetchAtgAccount()
  }, [])

  return (
    <ScrollContainer>
      <PageHeaderText>Account Settings</PageHeaderText>
      <ProfileSection
        title="Name"
        details={`${atgAccount?.firstName} ${atgAccount?.lastName}`}
        icon={<Icon source={icons.settingEdit} />}
        onPress={() => {
          push(Routes.ACCOUNT__NAME)
        }}
      />
      <ProfileSection
        title="Email Address"
        details={atgAccount?.email}
        icon={<Icon source={icons.settingEdit} />}
        onPress={() => {
          push(Routes.ACCOUNT__EMAIL__ADDRESS)
        }}
      />
      <ProfileSection
        title="Mobile Phone Number"
        details={atgAccount?.phoneNumber}
        icon={<Icon source={icons.settingEdit} />}
        onPress={() => {
          push(Routes.ACCOUNT__PHONE__NUMBER)
        }}
      />
      <ProfileSection
        title="Change Password"
        details=". . . . . . ."
        isPasswordField={true}
        icon={<Icon source={icons.settingEdit} />}
        onPress={() => {
          push(Routes.PASSWORD__PASSWORD__ASSISTANT__FORM, {
            isChangePassword: true,
          })
        }}
      />
      <ProfileSection
        title="Security Question"
        details=". . . . . . ."
        isPasswordField={true}
        icon={<Icon source={icons.settingEdit} />}
        onPress={() => {
          push(Routes.ACCOUNT__SECURITY__QUESTION)
        }}
      />
      <ProfileSection
        title="Content Settings"
        details={
          atgAccount?.explicitContentSetting
            ? 'Allow explicit content'
            : 'Do not Allow explicit content'
        }
        icon={<Icon source={icons.settingEdit} />}
        onPress={() => {
          push(Routes.ACCOUNT__EXPLICIT__CONTENT__SETTING, {
            explicitContentSetting: atgAccount?.explicitContentSetting,
          })
        }}
      />
      <RowContainer>
        <DigitalRightRequest>Digital Rights Request</DigitalRightRequest>
        <IconClickable
          onPress={() => Linking.openURL(WebRoutes.DIGITAL_RIGHT_REQUEST)}
        >
          <Icon source={icons.browser} />
        </IconClickable>
      </RowContainer>
    </ScrollContainer>
  )
}

AccountSettingsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Account Settings',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AccountSettingsScreen)
