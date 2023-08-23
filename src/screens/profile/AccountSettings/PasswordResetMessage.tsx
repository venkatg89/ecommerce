import React from 'react'
import { connect } from 'react-redux'
import Container from 'src/controls/layout/ScreenContainer'
import { createStructuredSelector } from 'reselect'
import Header from 'src/controls/navigation/Header'
import styled from 'styled-components/native'
import Button from 'src/controls/Button'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'
import { reset, Routes } from 'src/helpers/navigationService'
import { NavigationActions } from 'react-navigation'

const NameHeader = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  align-self: center;
`

const DoneButton = styled(Button)`
  padding-vertical: ${({ theme }) => theme.spacing(1.5)};
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const Description = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface StateProps {
  atgAccount?: AtgAccountModel
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
})

const connector = connect<StateProps, {}>(selector)

type Props = StateProps

const PasswordResetMessageScreen = ({ atgAccount }: Props) => {
  const DoneButtonHandler = () => {
    reset(0, [
      NavigationActions.navigate({
        routeName: Routes.ACCOUNT_SETTINGS,
      }),
    ])
  }

  return (
    <Container>
      <NameHeader>Check Your Email!</NameHeader>
      <Description>
        {`An email with instructions for resetting your password has been sent to ${atgAccount?.email}`}
        .
      </Description>
      <Description>
        if you don't receive this email, please check your junk email folder or
        contact Customer Service for assistance.
      </Description>
      <DoneButton
        onPress={DoneButtonHandler}
        variant="contained"
        center
        style={{ width: '95%' }}
      >
        Done
      </DoneButton>
    </Container>
  )
}

PasswordResetMessageScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(PasswordResetMessageScreen)
