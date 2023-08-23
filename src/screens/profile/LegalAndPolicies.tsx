import React from 'react'
import { Linking } from 'react-native'
import styled from 'styled-components/native'

import Header from 'src/controls/navigation/Header'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import _ScreenHeader from 'src/components/ScreenHeader'
import { WebRoutes } from 'src/helpers/navigationService'
import { icons } from 'assets/images'
import ProfileSection from 'src/components/Profile/Settings/Section'

const packageJson = require('../../../package.json')

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const ScreenHeader = styled(_ScreenHeader)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const ProfileSectionConatiner = styled.View`
  margin-top: ${({ theme }) => theme.spacing(3)};
`
const AppVersionContainer = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(4)};
`

const LegalAndPolicies = () => (
  <ScrollContainer>
    <ScreenHeader header="Legal & Policies" />
    <ProfileSectionConatiner>
      <ProfileSection
        title="App Agreement"
        icon={<Icon source={icons.browser} />}
        onPress={() => {
          Linking.openURL(WebRoutes.APP_TERMS)
        }}
      />
    </ProfileSectionConatiner>
    <ProfileSectionConatiner>
      <ProfileSection
        title="Terms of Service"
        icon={<Icon source={icons.browser} />}
        onPress={() => {
          Linking.openURL(WebRoutes.TERMS_OF_USE)
        }}
      />
    </ProfileSectionConatiner>
    <ProfileSectionConatiner>
      <ProfileSection
        title="Digital Content Terms"
        icon={<Icon source={icons.browser} />}
        onPress={() => {
          Linking.openURL(WebRoutes.DIGITAL_CONTENT)
        }}
      />
    </ProfileSectionConatiner>
    <ProfileSectionConatiner>
      <ProfileSection
        title="Privacy Policy"
        icon={<Icon source={icons.browser} />}
        onPress={() => {
          Linking.openURL(WebRoutes.PRIVACY_POLICY)
        }}
      />
    </ProfileSectionConatiner>
    <AppVersionContainer>{`App v ${packageJson.version}`}</AppVersionContainer>
  </ScrollContainer>
)

LegalAndPolicies.navigationOptions = () => ({
  titile: 'Legal and Policies',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default LegalAndPolicies
