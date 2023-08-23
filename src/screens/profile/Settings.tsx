import React from 'react'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { NavigationInjectedProps } from 'react-navigation'
import { createStructuredSelector } from 'reselect'

import Container from 'src/controls/layout/ScreenContainer'
import _ScrollContainer from 'src/controls/layout/ScrollContainer'
import Header from 'src/controls/navigation/Header'
import _Button from 'src/controls/Button'

import AppDetails from 'src/components/AppDetails'
import ProfileSettings from 'src/components/Profile/Settings'
import _ScreenHeader from 'src/components/ScreenHeader'

import { ProfileModel as MilqProfileModel } from 'src/models/UserModel'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import {
  myAtgAccountSelector,
  myMilqProfileSelector,
  myAtgEditAccountErrorSelector,
} from 'src/redux/selectors/userSelector'

import { logoutAction } from 'src/redux/actions/login/logoutAction'
import { atgEditAccountApiActions } from 'src/redux/actions/user/atgAccountAction'
import Alert from 'src/controls/Modal/Alert'

const ErrorMessage = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  text-align: center;
`

const ScreenHeader = styled(_ScreenHeader)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const ScrollContainer = styled(_ScrollContainer)``

const ButtonContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing(7)};
`

const Spacer = styled.View`
  height: ${({ theme }) => theme.spacing(4)};
`

// const NoContent = styled.View``

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const styles = StyleSheet.create({
  appDetails: {
    marginTop: 10,
  },
})

interface State {}

interface StateProps {
  atgAccount?: AtgAccountModel
  milqProfile?: MilqProfileModel
  editAccountError: string
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  milqProfile: myMilqProfileSelector,
  editAccountError: myAtgEditAccountErrorSelector,
})

interface DispatchProps {
  logoutAction(): void
  clearError(): void
}

const dispatcher = (dispatch) => ({
  logoutAction: () => dispatch(logoutAction()),
  clearError: () => dispatch(atgEditAccountApiActions.actions.clear),
})

const connector = connect<StateProps, {}, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

// TODO: refactor to function component
class ProfileSettingsScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
    header: (headerProps) => <Header headerProps={headerProps} />,
  })

  render() {
    const { atgAccount, milqProfile, editAccountError, clearError } = this.props

    if (!atgAccount || !milqProfile) {
      return (
        <Container>
          <AppDetails style={styles.appDetails} />
          <ButtonContainer>
            <Button
              maxWidth
              center
              variant="contained"
              onPress={() => this.props.logoutAction()}
            >
              Sign Out
            </Button>
          </ButtonContainer>
        </Container>
      )
    }

    return (
      <Container>
        <ScrollContainer>
          <ScreenHeader header="Settings" />
          <ProfileSettings atgAccount={atgAccount} milqProfile={milqProfile} />
          <Spacer />
          <ButtonContainer>
            <Button
              maxWidth
              center
              variant="contained"
              onPress={() => this.props.logoutAction()}
            >
              Sign Out
            </Button>
          </ButtonContainer>
          <AppDetails style={styles.appDetails} />
        </ScrollContainer>
        <Alert
          isOpen={Boolean(editAccountError)}
          onDismiss={clearError}
          title="Error"
          customBody={<ErrorMessage>{editAccountError}</ErrorMessage>}
          cancelText="Cancel"
        />
      </Container>
    )
  }
}

export default connector(ProfileSettingsScreen)
